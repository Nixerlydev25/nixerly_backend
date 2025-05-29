import prisma from '../../../config/prisma.config';
import { DatabaseError, NotFoundError } from '../../../utils/errors';

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
      ...(status && {
        isBlocked:
          status === 'BLOCKED' ? true : status === 'ACTIVE' ? false : undefined,
      }),
      ...(search && {
        OR: [
          { companyName: { contains: search } },
          {
            user: {
              OR: [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
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

export const toggleBusinessBlock = async (businessId: string) => {
  try {
    const business = await prisma.businessProfile.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundError('Business not found');
    }

    await prisma.businessProfile.update({
      where: { id: businessId },
      data: { isBlocked: !business.isBlocked },
    });

    return {
      message: 'Business blocked successfully',
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
