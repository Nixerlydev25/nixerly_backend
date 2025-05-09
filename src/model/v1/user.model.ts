import { ProfileType, OnboardingStepBusinessProfile, OnboardingStepWorkerProfile } from "@prisma/client";
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

export const updateWorkerProfile = async (
  userId: string,
  onboardingStep: OnboardingStepWorkerProfile,
  workerProfileData: {
    title: string;
    description: string;
    city: string;
    state: string;
    country: string;
    hourlyRate: number;
    availability: boolean;
  }
) => {
  try {
    await prisma.workerProfile.update({
      where: { userId },
      data: { ...workerProfileData, onboardingStep },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {},
      include: { workerProfile: true },
    });

    return updatedUser;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const updateBusinessProfile = async (
  userId: string,
  onboardingStep: OnboardingStepBusinessProfile,
  businessProfileData: Record<string, any>
) => {
  try {
    await prisma.businessProfile.update({
      where: { userId },
      data: { ...businessProfileData, onboardingStep },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {},
      include: { businessProfile: true },
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
