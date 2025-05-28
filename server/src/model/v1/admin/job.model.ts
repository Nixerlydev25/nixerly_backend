import prisma from '../../../config/prisma.config';
import { DatabaseError } from '../../../utils/errors';
import { ReportType } from '@prisma/client';

export const getAllJobs = async (filters: any) => {
  try {
    const { page, limit, search, employmentType, jobType, status } = filters;
    const skip = (page - 1) * Number(limit);

    const where = {
      ...(search && {
        OR: [{ title: { contains: search, mode: 'insensitive' } }],
      }),
      ...(employmentType && { employmentType: { in: employmentType } }),
      ...(jobType && { jobType: { in: jobType } }),
      ...(status && { status: { in: status } }),
    };

    const jobs = await prisma.job.findMany({
      where,
      skip,
      take: Number(limit),
    });

    const totalCount = await prisma.job.count({
      where,
    });

    const totalPages = Math.ceil(totalCount / Number(limit));
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

export const getJobById = async (jobId: string) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        applications: true,
        businessProfile: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!job) {
      throw new DatabaseError('Job not found');
    }

    return job;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const blockJob = async (
  jobId: string,
  reason: string,
  reportType?: ReportType,
  reportId?: string
) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        businessProfileId: true,
        isBlocked: true,
      },
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
        isBlocked: true,
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
        where: { id: reportId },
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
      select: { isBlocked: true },
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
        isBlocked: false,
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
