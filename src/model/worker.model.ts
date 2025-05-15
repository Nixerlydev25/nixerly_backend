import { OnboardingStepWorkerProfile } from '@prisma/client';
import { DatabaseError } from '../utils/errors';
import prisma from '../config/prisma.config';
import { WorkerFilters, createWorkerFilterClause, createWorkerSortClause } from '../utils/filters';

export class WorkerModel {
  static async getAllWorkers(skip: number, limit: number, filters?: WorkerFilters, sortOption?: string) {
    try {
      // Create base where clause with completed onboarding requirement
      const whereClause = {
        onboardingStep: OnboardingStepWorkerProfile.COMPLETED,
        ...createWorkerFilterClause(filters)
      };

      // Create orderBy clause based on sort option
      console.log({sortOption})
      const orderByClause = createWorkerSortClause(sortOption);
      
      console.log({orderByClause})

      const [workers, totalCount] = await Promise.all([
        prisma.workerProfile.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            user: true,
            skills: {
              select: {
                skillName: true
              }
            },
            experience: true,
            education: true,
            languages: true
          },
          orderBy: orderByClause
        }),
        prisma.workerProfile.count({
          where: whereClause
        })
      ]);

      // Transform the skills to be an array of just skillNames
      const transformedWorkers = workers.map(worker => ({
        ...worker,
        skills: worker.skills.map(skill => skill.skillName)
      }));

      return { workers: transformedWorkers, totalCount };
    } catch (error) {
      console.log(error)
      throw new DatabaseError('Error fetching workers');
    }
  }

  /**
   * Get a worker by ID with all details except conversations
   * @param workerId The ID of the worker to retrieve
   * @returns The worker profile with related data or null if not found
   */
  static async getWorkerById(workerId: string) {
    try {
      const worker = await prisma.workerProfile.findUnique({
        where: {
          id: workerId,
          onboardingStep: OnboardingStepWorkerProfile.COMPLETED
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              defaultProfile: true,
            }
          },
          skills: true,
          experience: true,
          education: true,
          languages: true,
          // Explicitly exclude conversations
        }
      });

      if (!worker) return null;

      // Transform the skills for better readability
      const transformedSkills = worker.skills.map(skill => skill.skillName);

      // Return the worker with transformed skills
      return {
        ...worker,
        skills: transformedSkills
      };
    } catch (error) {
      console.log(error);
      throw new DatabaseError('Error fetching worker details');
    }
  }
} 