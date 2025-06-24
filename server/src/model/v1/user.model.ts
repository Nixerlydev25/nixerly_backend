import { ProfileType } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { hashPassword } from "../../utils";
import { DatabaseError } from "../../utils/errors";
import { S3Service } from "../../services/s3.service";

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
    // Define type for user response
    type UserResponse = {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      defaultProfile: ProfileType;
      isVerified: boolean;
      isDeleted: boolean;
      isSuspended: boolean;
      firstTimeLogin: boolean;
      createdAt: Date;
      updatedAt: Date;
      workerProfile?: {
        id: string;
        profilePicture?: {
          s3Key: string;
          url?: string;
        };
      };
      businessProfile?: {
        id: string;
        profilePicture?: {
          s3Key: string;
          url?: string;
        };
      };
    };

    const includeProfile =
      defaultProfile === "WORKER"
        ? {
            workerProfile: {
              include: {
                profilePicture: true
              }
            }
          }
        : defaultProfile === "BUSINESS"
        ? {
            businessProfile: {
              include: {
                profilePicture: true
              }
            }
          }
        : {};

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
    }) as UserResponse | null;

    if (user) {
      // Get profile picture URL if exists
      if (
        user.workerProfile?.profilePicture?.s3Key ||
        user.businessProfile?.profilePicture?.s3Key
      ) {
        const s3Key =
          user.workerProfile?.profilePicture?.s3Key ||
          user.businessProfile?.profilePicture?.s3Key;

        const profilePictureUrl = await S3Service.getObjectUrl(s3Key!);

        // Only keep URL in response
        if (user.workerProfile?.profilePicture) {
          user.workerProfile.profilePicture = profilePictureUrl as any;
        } else if (user.businessProfile?.profilePicture) {
          user.businessProfile.profilePicture =  profilePictureUrl as any;
        }
      }
    }

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
            certificates: {
              include: {
                assets: true
              }
            },
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
        profilePictureUrl = await S3Service.getObjectUrl(
          user.workerProfile.profilePicture.s3Key
        );
      } catch (error) {
        console.error("Failed to get profile picture URL:", error);
        // Continue execution even if profile picture URL generation fails
      }
    }

    // Get S3 URLs for certificate assets
    const certificatesWithUrls = await Promise.all(
      user.workerProfile.certificates.map(async (certificate) => {
        const assetUrls = await Promise.all(
          certificate.assets.map(async (asset) => {
            try {
              const url = await S3Service.getObjectUrl(asset.key);
              return {
                url,
                key: asset.key,
                mediaType: asset.mediaType
              };
            } catch (error) {
              console.error(`Failed to get certificate asset URL for key ${asset.key}:`, error);
              return null;
            }
          })
        );
        return {
          ...certificate,
          assets: assetUrls.filter(asset => asset !== null)
        };
      })
    );

    // Get S3 URLs for portfolio assets
    const portfolioWithUrls = await Promise.all(
      user.workerProfile.portfolio.map(async (portfolioItem) => {
        const assetUrls = await Promise.all(
          portfolioItem.assets.map(async (asset) => {
            try {
              const url = await S3Service.getObjectUrl(asset.key);
              return {
                url,
                key: asset.key,
                mediaType: asset.mediaType
              };
            } catch (error) {
              console.error(`Failed to get portfolio asset URL for key ${asset.key}:`, error);
              return null;
            }
          })
        );
        return {
          ...portfolioItem,
          assets: assetUrls.filter(asset => asset !== null)
        };
      })
    );

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
        profilePicture: profilePictureUrl,
        certificates: certificatesWithUrls,
        portfolio: portfolioWithUrls
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
                description: true,
                requirements: true,
                employmentType: true,
                numberOfPositions: true,
                budget: true,
                hourlyRateMin: true,
                hourlyRateMax: true,
                status: true,
              },
            },
            profilePicture: true,
            assets: true,
          },
        },
      },
    });

    if (!user || !user.businessProfile) {
      return null;
    }

    let profilePictureUrl = null;
    if (user.businessProfile.profilePicture?.s3Key) {
      try {
        profilePictureUrl = await S3Service.getObjectUrl(
          user.businessProfile.profilePicture.s3Key
        );
      } catch (error) {
        console.error("Failed to get profile picture URL:", error);
        // Continue execution even if profile picture URL generation fails
      }
    }

    // Get S3 URLs for business assets
    const assetsWithUrls = await Promise.all(
      user.businessProfile.assets.map(async (asset) => {
        try {
          const url = await S3Service.getObjectUrl(asset.key);
          return {
            ...asset,
            url,
          };
        } catch (error) {
          console.error(`Failed to get asset URL for key ${asset.key}:`, error);
          return null;
        }
      })
    );

    const transformedUser = {
      ...user,
      businessProfile: {
        ...user.businessProfile,
        profilePicture: profilePictureUrl,
        assets: assetsWithUrls.filter(asset => asset !== null),
      },
    };

    return transformedUser;
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

    // Get job applications with pagination
    const applications = await prisma.jobApplication.findMany({
      where: {
        workerProfileId: workerProfile.id,
        ...(search && {
          job: {
            OR: [
              { title: { contains: search } },
              { businessProfile: { companyName: { contains: search } } },
            ],
          },
        }),
        ...(startDate &&
          endDate && {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          }),
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        job: {
          include: {
            businessProfile: {
              select: {
                companyName: true,
                city: true,
                state: true,
                country: true,
              },
            },
            location: true,
          },
        },
      },
    });

    // Get total count for pagination
    const totalCount = await prisma.jobApplication.count({
      where: {
        workerProfileId: workerProfile.id,
      },
    });
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return {
      applications,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        hasMore,
      },
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
