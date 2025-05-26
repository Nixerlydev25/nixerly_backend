import prisma from '../../../config/prisma.config';
import { DatabaseError } from '../../../utils/errors';
import { BlockType, ReportType } from '@prisma/client';

export const getAllJobs = async (filters: any) => {
  try {
    const { page, limit, search, status, country } = filters;
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(search && {
        OR: [{ title: { contains: search, mode: 'insensitive' } }],
      }),
    };

    const jobs = await prisma.job.findMany({
      where,
      skip,
      take: limit,
    });

    const totalCount = await prisma.job.count({
      where,
    });

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = parseInt(page);
    const hasMore = currentPage < totalPages;

    return {
      jobs,
      pagination: {
        totalCount,
        totalPages,
        currentPage,
        hasMore,
      },
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const blockJob = async (jobId: string, reason: string, reportType?: ReportType, reportId?: string) => {
  try {
    const existingBlock = await prisma.block.findFirst({
      where: {
        jobId,
        isActive: true,
        blockType: BlockType.JOB,
      },
    });

    if (existingBlock) {
      throw new DatabaseError('Job is already blocked');
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { businessProfileId: true }
    });

    if (!job) {
      throw new DatabaseError('Job not found');
    }

    const block = await prisma.block.create({
      data: {
        blockType: BlockType.JOB,
        userId: job.businessProfileId,
        jobId,
        reason,
        reportType,
        reportId,
        blockedBy: 'admin',
        isActive: true,
      },
      include: {
        job: {
          include: {
            businessProfile: {
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

export const unblockJob = async (jobId: string) => {
  try {
    const existingBlock = await prisma.block.findFirst({
      where: {
        jobId,
        isActive: true,
        blockType: BlockType.JOB,
      },
      include: {
        report: true
      }
    });

    if (!existingBlock) {
      throw new DatabaseError('No active block found for this job');
    }

    const block = await prisma.block.update({
      where: {
        id: existingBlock.id,
      },
      data: {
        isActive: false,
        unBlockedAt: new Date(),
      },
      include: {
        job: {
          include: {
            businessProfile: {
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
