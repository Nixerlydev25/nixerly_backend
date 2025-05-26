import prisma from '../../../config/prisma.config';
import { DatabaseError } from '../../../utils/errors';
import { ReportType } from '@prisma/client';

export const getAllJobs = async (filters: any) => {
  try {
    const { page, limit, search, status, country } = filters;
    const skip = (page - 1) * limit;

    const where = {
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
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { 
        businessProfileId: true,
        isBlocked: true
      }
    });

    if (!job) {
      throw new DatabaseError('Job not found');
    }

    if (job.isBlocked) {
      throw new DatabaseError('Job is already blocked');
    }

    // Update job to blocked status
    const blockedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        isBlocked: true
      },
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
    });

    // If there's a report, include it in response
    if (reportId) {
      const report = await prisma.report.findUnique({
        where: { id: reportId }
      });
      return { ...blockedJob, report };
    }

    return blockedJob;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const unblockJob = async (jobId: string) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { isBlocked: true }
    });

    if (!job) {
      throw new DatabaseError('Job not found');
    }

    if (!job.isBlocked) {
      throw new DatabaseError('Job is not blocked');
    }

    const unblockedJob = await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        isBlocked: false
      },
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
    });

    return unblockedJob;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
