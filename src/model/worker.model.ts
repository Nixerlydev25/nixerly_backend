import { OnboardingStepWorkerProfile } from "@prisma/client";
import { DatabaseError, NotFoundError } from "../utils/errors";
import prisma from "../config/prisma.config";
import {
  WorkerFilters,
  createWorkerFilterClause,
  createWorkerSortClause,
} from "../utils/filters";

export const getAllWorkers = async (
  skip: number,
  limit: number,
  filters?: WorkerFilters,
  sortOption?: string
) => {
  try {
    // Create base where clause with completed onboarding requirement
    const whereClause = {
      onboardingStep: OnboardingStepWorkerProfile.COMPLETED,
      ...createWorkerFilterClause(filters),
    };

    // Create orderBy clause based on sort option
    console.log({ sortOption });
    const orderByClause = createWorkerSortClause(sortOption);

    console.log({ orderByClause });

    const [workers, totalCount] = await Promise.all([
      prisma.workerProfile.findMany({
        where: whereClause,
        skip,
        take: limit,
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
        },
        orderBy: orderByClause,
      }),
      prisma.workerProfile.count({
        where: whereClause,
      }),
    ]);

    // Transform the skills to be an array of just skillNames
    const transformedWorkers = workers.map((worker) => ({
      ...worker,
      skills: worker.skills.map((skill) => skill.skillName),
    }));

    return { workers: transformedWorkers, totalCount };
  } catch (error) {
    console.log(error);
    throw new DatabaseError("Error fetching workers");
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
          },
        },
        skills: true,
        experience: true,
        education: true,
        languages: true,
        // Explicitly exclude conversations
      },
    });

    if (!worker) return null;

    // Transform the skills for better readability
    const transformedSkills = worker.skills.map((skill) => skill.skillName);

    // Return the worker with transformed skills
    return {
      ...worker,
      skills: transformedSkills,
    };
  } catch (error) {
    console.log(error);
    throw new DatabaseError("Error fetching worker details");
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
