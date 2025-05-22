import { OnboardingStepBusinessProfile } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { DatabaseError } from "../../utils/errors";

export const updateBusinessProfile = async (
  userId: string,
  businessProfileData: {
    onboardingStep?: OnboardingStepBusinessProfile;
    companyName?: string;
    description?: string;
    industry?: string;
    city?: string;
    state?: string;
    country?: string;
    website?: string;
    employeeCount?: number;
    yearFounded?: number;
    phoneNumber?: string;
  }
) => {
  try {
    const fieldsToUpdate = { ...businessProfileData };

    await prisma.businessProfile.update({
      where: { userId },
      data: {
        ...fieldsToUpdate,
      },
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


export const getBusinessProfileDetails = async (businessId: string) => {
  try {
    const user = await prisma.businessProfile.findUnique({
      where: { id: businessId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            defaultProfile: true,
            email: true,
          },
        },
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
      },
    });

    return user;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
