import prisma from '../../../config/prisma.config';
import { DatabaseError } from '../../../utils/errors';
import { Prisma, ReportType } from '@prisma/client';

export const getAllBusinesses = async (filters: {
  page: number;
  limit: number;
  search?: string;
  status?: 'ACTIVE' | 'BLOCKED';
  industry?: string;
  country?: string;
}) => {
  try {
    const { page, limit, search, status, industry, country } = filters;
    const skip = (page - 1) * limit;

    const where = {
      isBlocked:
        status === 'BLOCKED' ? true : status === 'ACTIVE' ? false : undefined,
      ...(search && {
        OR: [
          { companyName: { contains: search, mode: 'insensitive' } },
          {
            user: {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        ],
      }),
      ...(industry && { industry }),
      ...(country && { country }),
    };

    // Get total count for pagination
    const totalCount = await prisma.businessProfile.count({ where });

    // Get count for businesses with status ACTIVE and BLOCKED
    const activeBusinessCount = await prisma.businessProfile.count({
      where: {
        isBlocked: false,
      },
    });

    const blockedBusinessCount = await prisma.businessProfile.count({
      where: {
        isBlocked: true,
      },
    });

    // Get businesses with pagination and filters
    const businesses = await prisma.businessProfile.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        companyName: true,
        description: true,
        industry: true,
        city: true,
        state: true,
        country: true,
        website: true,
        employeeCount: true,
        yearFounded: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
        isBlocked: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            defaultProfile: true,
          },
        },
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    // Add total jobs count
    const businessesWithDetails = businesses.map((business) => ({
      ...business,
      totalJobs: business._count.jobs,
    }));

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return {
      businesses: businessesWithDetails,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        hasMore,
      },
      statusCounts: {
        active: activeBusinessCount,
        blocked: blockedBusinessCount,
      },
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getBusinessById = async (businessId: string) => {
  try {
    const business = await prisma.businessProfile.findUnique({
      where: { id: businessId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return business;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const blockBusiness = async (businessId: string) => {
  try {
    // Get the business profile
    const business = await prisma.businessProfile.findUnique({
      where: { id: businessId },
      select: { isBlocked: true },
    });

    if (!business) {
      throw new DatabaseError('Business not found');
    }

    if (business.isBlocked) {
      throw new DatabaseError('Business is already blocked');
    }

    // Update business profile to blocked status
    const updatedBusiness = await prisma.businessProfile.update({
      where: { id: businessId },
      data: {
        isBlocked: true,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedBusiness;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const unblockBusiness = async (businessId: string) => {
  try {
    // Get the business profile
    const business = await prisma.businessProfile.findUnique({
      where: { id: businessId },
      select: { isBlocked: true },
    });

    if (!business) {
      throw new DatabaseError('Business not found');
    }

    if (!business.isBlocked) {
      throw new DatabaseError('Business is not blocked');
    }

    // Update business profile to unblocked status
    const updatedBusiness = await prisma.businessProfile.update({
      where: { id: businessId },
      data: {
        isBlocked: false,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedBusiness;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
