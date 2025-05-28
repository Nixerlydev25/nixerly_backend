import { ReportType } from '@prisma/client';
import prisma from '../../../config/prisma.config';
import { DatabaseError } from '../../../utils/errors';

export const getAllWorkers = async (filters: any) => {
  try {
    const { page = 1, limit = 10, search, status, country } = filters;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(search && {
        user: {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      }),
      ...(status && { status }),
      ...(country && { country }),
    };

    const workers = await prisma.workerProfile.findMany({
      where,
      skip: Number(skip),
      take: Number(limit),
      orderBy: {
        createdAt: 'asc',
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

    const totalCount = await prisma.workerProfile.count({
      where,
    });

    const totalPages = Math.ceil(totalCount / Number(limit));
    const currentPage = Number(page);
    const hasMore = currentPage < totalPages;

    return {
      pagination: { totalCount, totalPages, currentPage, hasMore },
      workers: workers,
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getWorkerById = async (workerId: string) => {
  try {
    const worker = await prisma.workerProfile.findUnique({
      where: { id: workerId },
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

    return worker;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const blockWorker = async (
  workerId: string,
) => {
  try {
    // Get the worker profile
    const worker = await prisma.workerProfile.findUnique({
      where: { id: workerId },
      select: { isBlocked: true },
    });

    if (!worker) {
      throw new DatabaseError('Worker not found');
    }

    if (worker.isBlocked) {
      throw new DatabaseError('Worker is already blocked');
    }

    // Update worker profile to blocked status
    const updatedWorker = await prisma.workerProfile.update({
      where: { id: workerId },
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

    return updatedWorker;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const unblockWorker = async (workerId: string) => {
  try {
    // Get the worker profile
    const worker = await prisma.workerProfile.findUnique({
      where: { id: workerId },
      select: { isBlocked: true },
    });

    if (!worker) {
      throw new DatabaseError('Worker not found');
    }

    if (!worker.isBlocked) {
      throw new DatabaseError('Worker is not blocked');
    }

    // Update worker profile to unblocked status
    const updatedWorker = await prisma.workerProfile.update({
      where: { id: workerId },
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

    return updatedWorker;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
