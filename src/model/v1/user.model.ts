import {
  ProfileType,
} from "@prisma/client";
import prisma from "../../config/prisma.config";
import { hashPassword } from "../../utils";
import { DatabaseError } from "../../utils/errors";
import { NotFoundError } from "../../utils/errors";

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
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
      include: { businessProfile: true },
    });
    
    return user;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const saveProfilePicture = async (userId: string, s3Key: string) => {
  try {
    // First, get the worker profile ID
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) {
      throw new NotFoundError("Worker profile not found");
    }

    // Check if profile picture already exists
    const existingProfilePicture = await prisma.profilePicture.findUnique({
      where: { workerProfileId: workerProfile.id },
    });

    if (existingProfilePicture) {
      // Update existing profile picture
      const updatedProfilePicture = await prisma.profilePicture.update({
        where: { workerProfileId: workerProfile.id },
        data: { s3Key },
      });
      return updatedProfilePicture;
    } else {
      // Create new profile picture
      const newProfilePicture = await prisma.profilePicture.create({
        data: {
          workerProfileId: workerProfile.id,
          s3Key,
        },
      });
      return newProfilePicture;
    }
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
