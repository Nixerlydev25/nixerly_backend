import prisma from '../../../config/prisma.config';
import { DatabaseError } from '../../../utils/errors';
import { Prisma, BlockType, ReportType } from '@prisma/client';

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
      blocks:
        status === 'BLOCKED'
          ? {
              some: {
                isActive: true,
              },
            }
          : status === 'ACTIVE'
          ? {
              none: {
                isActive: true,
              },
            }
          : undefined,
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
        blocks: {
          none: {
            isActive: true,
          },
        },
      },
    });

    const blockedBusinessCount = await prisma.businessProfile.count({
      where: {
        blocks: {
          some: {
            isActive: true,
          },
        },
      },
    });

    // Get businesses with pagination and filters
    const businesses = await prisma.businessProfile.findMany({
      where,
      skip,
      take: limit,
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
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            defaultProfile: true,
          },
        },
        blocks: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            reason: true,
            blockedBy: true,
            blockedAt: true,
            isActive: true,
            reportType: true,
            report: {
              select: {
                reason: true,
                reportType: true,
              }
            }
          },
        },
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    // Add total jobs count and format block status
    const businessesWithDetails = businesses.map((business) => ({
      ...business,
      totalJobs: business._count.jobs,
      isBlocked: business.blocks.length > 0,
      blockDetails: business.blocks[0] || null, // Get the active block if exists
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

export const blockBusiness = async (
  businessId: string,
  reason: string,
  reportType?: ReportType,
  reportId?: string
) => {
  try {
    // First check if business is already blocked
    const existingBlock = await prisma.block.findFirst({
      where: {
        businessId,
        isActive: true,
        blockType: BlockType.BUSINESS,
      },
    });

    if (existingBlock) {
      throw new DatabaseError('Business is already blocked');
    }

    // Get the business profile to get the userId
    const business = await prisma.businessProfile.findUnique({
      where: { id: businessId },
      select: { userId: true },
    });

    if (!business) {
      throw new DatabaseError('Business not found');
    }

    // Create new block record
    const block = await prisma.block.create({
      data: {
        blockType: BlockType.BUSINESS,
        userId: business.userId,
        businessId,
        reason,
        reportType,
        reportId,
        blockedBy: 'admin',
        isActive: true,
      },
      include: {
        business: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        report: true
      },
    });

    return block;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const unblockBusiness = async (businessId: string) => {
  try {
    // Find active block
    const existingBlock = await prisma.block.findFirst({
      where: {
        businessId,
        isActive: true,
        blockType: BlockType.BUSINESS,
      },
      include: {
        report: true
      }
    });

    if (!existingBlock) {
      throw new DatabaseError('No active block found for this business');
    }

    // Update block record
    const block = await prisma.block.update({
      where: {
        id: existingBlock.id,
      },
      data: {
        isActive: false,
        unBlockedAt: new Date(),
      },
      include: {
        business: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        report: true
      },
    });

    return block;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
