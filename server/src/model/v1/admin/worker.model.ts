import prisma from '../../../config/prisma.config';
import { DatabaseError, NotFoundError } from '../../../utils/errors';

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
      isBlocked:
        status === 'BLOCKED' ? true : status === 'ACTIVE' ? false : undefined,
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
  } catch (error) {
    throw new DatabaseError('Error fetching workers');
  }
};

export const toggleWorkerBlock = async (workerId: string) => {
  try {
    // Get the worker profile
    const worker = await prisma.workerProfile.findUnique({
      where: { id: workerId },
      select: { isBlocked: true },
    });

    if (!worker) {
      throw new NotFoundError('Worker not found');
    }

    // Toggle the blocked status
    const updatedWorker = await prisma.workerProfile.update({
      where: { id: workerId },
      data: {
        isBlocked: !worker.isBlocked,
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
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new DatabaseError('Error toggling worker block status');
  }
};
