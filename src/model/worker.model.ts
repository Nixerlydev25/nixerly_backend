import {  OnboardingStepWorkerProfile, SkillName } from '@prisma/client';
import { DatabaseError } from '../utils/errors';
import prisma from '../config/prisma.config';

interface WorkerFilters {
  skills?: SkillName[];
  minHourlyRate?: number;
  maxHourlyRate?: number;
  minTotalEarnings?: number;
  maxTotalEarnings?: number;
  minAvgRating?: number;
  maxAvgRating?: number;
}

export class WorkerModel {
  static async getAllWorkers(skip: number, limit: number, filters?: WorkerFilters) {
    try {
      const whereClause: any = {
        // Only return workers who have completed onboarding
        onboardingStep: OnboardingStepWorkerProfile.COMPLETED
      };

      // Apply filters if they exist
      if (filters) {
        // Skills filter
        if (filters.skills && filters.skills.length > 0) {
          whereClause.skills = {
            some: {
              skillName: {
                in: filters.skills
              }
            }
          };
        }

        // Hourly rate range
        if (filters.minHourlyRate !== undefined || filters.maxHourlyRate !== undefined) {
          whereClause.hourlyRate = {};
          if (filters.minHourlyRate !== undefined) {
            whereClause.hourlyRate.gte = filters.minHourlyRate;
          }
          if (filters.maxHourlyRate !== undefined) {
            whereClause.hourlyRate.lte = filters.maxHourlyRate;
          }
        }

        // Total earnings range
        if (filters.minTotalEarnings !== undefined || filters.maxTotalEarnings !== undefined) {
          whereClause.totalEarnings = {};
          if (filters.minTotalEarnings !== undefined) {
            whereClause.totalEarnings.gte = filters.minTotalEarnings;
          }
          if (filters.maxTotalEarnings !== undefined) {
            whereClause.totalEarnings.lte = filters.maxTotalEarnings;
          }
        }

        // Average rating range
        if (filters.minAvgRating !== undefined || filters.maxAvgRating !== undefined) {
          whereClause.avgRating = {};
          if (filters.minAvgRating !== undefined) {
            whereClause.avgRating.gte = filters.minAvgRating;
          }
          if (filters.maxAvgRating !== undefined) {
            whereClause.avgRating.lte = filters.maxAvgRating;
          }
        }
      }

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
          orderBy: {
            user: {
              createdAt: 'desc'
            }
          }
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