import { OnboardingStepWorkerProfile, SkillName } from '@prisma/client';
import { DatabaseError, NotFoundError } from '../utils/errors';
import prisma from '../config/prisma.config';
import {
  createWorkerFilterClause,
  createWorkerSortClause,
} from '../utils/filters';
import { S3Service } from '../services/s3.service';

export const getAllWorkers = async (filters: {
  skills?: SkillName[];
  page: number;
  limit: number;
  sort?: string;
  search?: string;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  minTotalEarnings?: number;
  maxTotalEarnings?: number;
  minAvgRating?: number;
  maxAvgRating?: number;
}) => {
  try {
    // Create base where clause with completed onboarding requirement
    const whereClause = {
      onboardingStep: OnboardingStepWorkerProfile.COMPLETED,
      ...createWorkerFilterClause(filters),
    };

    // Create orderBy clause based on sort option
    const orderByClause = createWorkerSortClause(filters?.sort);

    console.log({ orderByClause, whereClause });

    const skip = (filters.page - 1) * filters.limit;

    const [workers, totalCount] = await Promise.all([
      prisma.workerProfile.findMany({
        where: whereClause,
        skip,
        take: filters.limit,
        include: {
          user: true,
          skills: {
            select: {
              skillName: true,
            },
          },
          experience: true,
          education: true,
          languages: true,
          profilePicture: true,
        },
        orderBy: orderByClause,
      }),
      prisma.workerProfile.count({
        where: whereClause,
      }),
    ]);

    // Transform workers with profile pictures and skills
    const transformedWorkers = await Promise.all(workers.map(async (worker) => {
      let profilePictureUrl = null;
      if (worker.profilePicture?.s3Key) {
        try {
          profilePictureUrl = await S3Service.getObjectUrl(worker.profilePicture.s3Key);
        } catch (error) {
          console.error("Failed to get profile picture URL:", error);
        }
      }

      return {
        ...worker,
        skills: worker.skills.map((skill) => skill.skillName),
        profilePicture: profilePictureUrl
      };
    }));

    return {
      workers: transformedWorkers,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / filters.limit),
        currentPage: filters.page,
        hasMore: filters.page * filters.limit < totalCount,
      },
    };
  } catch (error) {
    console.log(error);
    throw new DatabaseError('Error fetching workers');
  }
};

/**
 * Get a worker by ID with all details except conversations
 * @param workerId The ID of the worker to retrieve
 * @returns The worker profile with related data or null if not found
 */
export const getWorkerById = async (workerId: string) => {
  try {
    const worker = await prisma.workerProfile.findUnique({
      where: {
        id: workerId,
        onboardingStep: OnboardingStepWorkerProfile.COMPLETED,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            defaultProfile: true,
            email: true,
          },
        },
        skills: true,
        experience: true,
        education: true,
        languages: true,
        profilePicture: true,
      },
    });

    if (!worker) return null;

    // Transform profile picture if it exists
    let profilePictureUrl = null;
    if (worker.profilePicture?.s3Key) {
      try {
        profilePictureUrl = await S3Service.getObjectUrl(worker.profilePicture.s3Key);
      } catch (error) {
        console.error("Failed to get profile picture URL:", error);
      }
    }

    // Return the worker with transformed skills and profile picture
    return {
      ...worker,
      skills: worker.skills.map((skill) => skill.skillName),
      profilePicture: profilePictureUrl
    };
  } catch (error) {
    console.log(error);
    throw new DatabaseError('Error fetching worker details');
  }
};

export const updateWorkerProfile = async (
  userId: string,
  onboardingStep: OnboardingStepWorkerProfile | undefined,
  workerProfileData: {
    title: string;
    description: string;
    city: string;
    state: string;
    country: string;
    hourlyRate: number;
    availability: boolean;
    phoneNumber: string;
  }
) => {
  try {
    // Create the update data object
    const updateData: any = { ...workerProfileData };

    // Only include onboardingStep in the update if it's provided
    if (onboardingStep !== undefined) {
      updateData.onboardingStep = onboardingStep;
    }

    await prisma.workerProfile.update({
      where: { userId },
      data: updateData,
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

export const saveProfilePicture = async (userId: string, s3Key: string) => {
  try {
    // First, get the worker profile ID
    const workerProfile = await prisma.workerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) {
      throw new NotFoundError('Worker profile not found');
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

export const getWorkerProfileByUserId = async (userId: string) => {
  try {
    const worker = await prisma.workerProfile.findUnique({
      where: { userId },
      include: {
        profilePicture: true
      }
    });

    if (!worker) return null;

    // Transform profile picture if it exists
    let profilePictureUrl = null;
    if (worker.profilePicture?.s3Key) {
      try {
        profilePictureUrl = await S3Service.getObjectUrl(worker.profilePicture.s3Key);
      } catch (error) {
        console.error("Failed to get profile picture URL:", error);
        // Continue execution even if profile picture URL generation fails
      }
    }

    return {
      ...worker,
      profilePicture: profilePictureUrl
    };

  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};