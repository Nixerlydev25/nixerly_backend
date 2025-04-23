import { ProfileType } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { hashPassword } from "../../utils";
import { DatabaseError } from "../../utils/errors";

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
  try{
  const users = await prisma.user.findUnique({
    where: { id: userID }, // replace with user id
    select: {
      email: true,
      name: true,
    },
  });
  return users;
  }catch (error: any) {
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

export const getCurrentUserDetails = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isSuspended: true,
        isVerified: true,
        role: true,
        isDeleted: true,
        restrictions:true,
        createdAt: true,
        isOnboardingComplete: true,
        defaultProfile: true,
        workerProfile: true,
        businessProfile: true,
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

// Update user details

interface UserDetails {
  organization?: string;
  profession?: string;
  howDidYouHearAboutUs?: string;
  schoolName?: string;
  yearsOfExperience?: number;
  subjectsTaught?: string;
  gradeLevel?: string;
  educationalQualification?: string;
  teacherLicenseNumber?: string;
}

export const updateUserDetails = async (
  userId: string,
  defaultProfile: ProfileType,
  userDetails: Record<string, any>
) => {
  try {
    const baseUserUpdate = {
      isOnboardingComplete: true,
    };

    if (defaultProfile === ProfileType.WORKER) {
      await prisma.workerProfile.update({
        where: { userId },
        data: userDetails,
      });
    } else if (defaultProfile === ProfileType.BUSINESS) {
      await prisma.businessProfile.update({
        where: { userId },
        data: userDetails,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: baseUserUpdate,
    });

    return updatedUser;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};