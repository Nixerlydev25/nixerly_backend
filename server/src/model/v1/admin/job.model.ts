import prisma from '../../../config/prisma.config';
import { DatabaseError, NotFoundError } from '../../../utils/errors';

export const getAllJobs = async (filters: any) => {
  try {
    const { page, limit, search, employmentType, jobType, status } = filters;
    const skip = (page - 1) * Number(limit);

    const where = {
      ...(search && {
        OR: [{ title: { contains: search } }],
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
      select: {
        id: true,
        title: true,
        description: true,
        requirements: true,
        employmentType: true,
        numberOfPositions: true,
        budget: true,
        hourlyRateMin: true,
        hourlyRateMax: true,
        salary: true,
        businessProfileId: true,
        status: true,
        jobType: true,
        startDate: true,
        numberOfWorkersRequired: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
        isBlocked: true,
        businessProfile: {
          select: {
            id: true,
            userId: true,
            companyName: true,
            description: true,
            industry: true,
            phoneNumber: true,
            city: true,
            state: true,
            country: true,
            website: true,
            employeeCount: true,
            yearFounded: true,
            totalSpent: true,
            postedJobs: true,
            onboardingStep: true,
            createdAt: true,
            updatedAt: true,
            isBlocked: true,
            lastActive: true,
          },
        },
        skills: true,
        workAreaImages: true,
        applications: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            workerStartDateAvailability: true,
            duration: true,
            workerProfile: {
              select: {
                id: true,
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
      },
    });

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    return job;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const toggleJobBlock = async (jobId: string) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { isBlocked: true },
    });

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { isBlocked: !job.isBlocked },
    });

    return updatedJob;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
