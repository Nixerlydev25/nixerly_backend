import {
  ProfileType,
} from "@prisma/client";
import prisma from "../../config/prisma.config";
import { hashPassword } from "../../utils";
import { DatabaseError } from "../../utils/errors";
import {S3Service} from "../../services/s3.service";

export const updateUserVerificationStatus = async (
  userId: string,
  isVerified: boolean
): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: { isVerified },
  });
};

export const getUser = async (userID: string) => {
  try {
    const users = await prisma.user.findUnique({
      where: { id: userID }, // replace with user id
      select: {
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    return users;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getUserRole = async (userID: string) => {
  try {
    const users = await prisma.user.findUnique({
      where: { id: userID },
      select: {
        role: true,
      },
    });
    return users;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const toggleFirstTimeLogin = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { firstTimeLogin: !user.firstTimeLogin },
    });

    return updatedUser;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const markUserAsDeleted = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    });

    return updatedUser;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getCurrentUserDetails = async (
  userId: string,
  defaultProfile: ProfileType
) => {
  try {
    const includeProfile =
      defaultProfile === "WORKER"
        ? { workerProfile: true }
        : defaultProfile === "BUSINESS"
        ? { businessProfile: true }
        : {};


        // only return thisid
  //       : '9bf6dc77-083a-401a-b8e0-fa9351efee5c',
  // email: 'dev.naveedrehmani@gmail.com',
  // firstName: 'admin',
  // lastName: 'admin',
  // createdAt: '2025-05-29T20:14:59.511Z',
  // updatedAt: '2025-05-29T20:14:59.511Z',
  // isVerified: true,
  // isDeleted: false,
  // isSuspended: false,
  // role: 'ADMIN',
  // provider: 'EMAIL_PASSWORD',
  // defaultProfile: 'WORKER',
  // firstTimeLogin: true,
  // workerProfile: null

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        defaultProfile: true,
        isVerified: true,
        isDeleted: true,
        isSuspended: true,
        provider: true,
        firstTimeLogin: true,
        createdAt: true,
        updatedAt: true,
        ...includeProfile,
      },
    });

    return user;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

// PASSWORD RECOVERY.
export const findUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const resetPassword = async (userId: string, newPassword: string) => {
  try {
    const hashedPassword = hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return updatedUser;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const updateUser = async (
  userId: string,
  userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    defaultProfile?: ProfileType;
    firstTimeLogin?: boolean;
  }
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    return updatedUser;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getWorkerProfileDetails = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        defaultProfile: true,
        isVerified: true,
        firstTimeLogin: true,
        createdAt: true,
        updatedAt: true,
        workerProfile: {
          include: {
            skills: true,
            experience: true,
            education: true,
            certificates: true,
            portfolio: {
              include: {
                assets: true,
              },
            },
            languages: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!user || !user.workerProfile) {
      return null;
    }

    // Transform the skills to be an array of just skillNames
    let profilePictureUrl = null;
    if (user.workerProfile.profilePicture?.s3Key) {
      try {
        profilePictureUrl = await S3Service.getObjectUrl(user.workerProfile.profilePicture.s3Key);
      } catch (error) {
        console.error('Failed to get profile picture URL:', error);
        // Continue execution even if profile picture URL generation fails
      }
    }

    const transformedUser = {
      ...user,
      workerProfile: {
        ...user.workerProfile,
        skills: user.workerProfile.skills.map((skill) => skill.skillName),
        languages: user.workerProfile.languages.map((language) => ({
          language: language.language,
          proficiency: language.proficiency,
          id: language.id,
        })),
        profilePicture: profilePictureUrl
      },
    };

    return transformedUser;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getBusinessProfileDetails = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        businessProfile: {
          include: {
            jobs: {
              select: {
                id: true,
                title: true,
                description:true,
                requirements:true,
                employmentType: true,
                numberOfPositions: true,
                budget: true,
                hourlyRateMin: true,
                hourlyRateMax: true,
                status: true,
              }
            }, 
          },
        }
      }
    });
    
    return user;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getWorkerAppliedJobs = async (
  userId: string,
  filters: {
    page: number;
    limit: number;
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }
) => {
  try {
    const { page, limit, search, startDate, endDate } = filters;
    const skip = (page - 1) * limit;

    // Get worker profile id first
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId },
    });

    if (!workerProfile) {
      throw new DatabaseError("Worker profile not found");
    }

    // Build where clause for filtering
    const where = {
      workerProfileId: workerProfile.id,
      ...(search && {
        job: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { businessProfile: { companyName: { contains: search, mode: 'insensitive' } } }
          ]
        }
      }),
      ...(startDate && endDate && {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      })
    };

    // Get job applications with pagination
    const applications = await prisma.jobApplication.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        job: {
          include: {
            businessProfile: {
              select: {
                companyName: true,
                city: true,
                state: true,
                country: true
              }
            },
            location: true
          }
        }
      }
    });

    // Get total count for pagination
    const totalCount = await prisma.jobApplication.count({ where });
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return {
      applications,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        hasMore
      }
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
