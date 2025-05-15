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
} 