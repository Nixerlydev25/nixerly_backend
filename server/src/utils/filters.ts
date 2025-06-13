import { SkillName } from '@prisma/client';

/**
 * Interface for common filter parameters used across worker queries
 */
export interface WorkerFilters {
  skills?: SkillName[];
  minHourlyRate?: number;
  maxHourlyRate?: number;
  minTotalEarnings?: number;
  maxTotalEarnings?: number;
  minAvgRating?: number;
  maxAvgRating?: number;
  search?: string;
}


/**
 * Creates a Prisma-compatible where clause object based on provided filter parameters
 * @param filters The filter parameters to apply
 * @returns A Prisma-compatible where clause object
 */

export function createWorkerFilterClause(filters?: WorkerFilters): Record<string, any> {
  const whereClause: Record<string, any> = {};
  
  if (!filters) return whereClause;
  
  // Search filter for title or description
  if (filters.search) {
    whereClause.OR = [
      {
        title: {
          contains: filters.search,
        }
      },
      {
        description: {
          contains: filters.search,
        }
      }
    ];
  }

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

  whereClause.isBlocked = false;

  return whereClause;
}


export enum SortOption {
  RATING = 'rating',
  PRICE_LOW_TO_HIGH = 'price_low_to_high',
  PRICE_HIGH_TO_LOW = 'price_high_to_low',
}

export function createWorkerSortClause(sortOption?: string): Record<string, any> {
  if (!sortOption) {
    // Default sorting by creation date if no sort option provided
    return {
      user: {
        createdAt: 'desc'
      }
    };
  }

  switch (sortOption) {
    case SortOption.RATING:
      return {
        avgRating: 'desc'
      };
    case SortOption.PRICE_LOW_TO_HIGH:
      return {
        hourlyRate: 'asc'
      };
    case SortOption.PRICE_HIGH_TO_LOW:
      return {
        hourlyRate: 'desc'
      };
    default:
      // Default sorting by creation date
      return {
        user: {
          createdAt: 'desc'
        }
      };
  }
} 