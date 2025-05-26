import { BlockType, ReportType } from '@prisma/client';
import prisma from '../../../config/prisma.config';
import { DatabaseError } from '../../../utils/errors';

export const getAllWorkers = async (filters: any) => {
  try {
    const { page, limit, search, status, country } = filters;
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(status && { status }),
      ...(country && { country }),
    };

    const workers = await prisma.workerProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: {
          select: {
            firstName: true,
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
          },
        },
      },
    });

    const totalCount = await prisma.workerProfile.count({
      where,
    });

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = page;
    const hasMore = currentPage < totalPages;

    return {
      pagination: { totalCount, totalPages, currentPage, hasMore },
      workers: workers,
    };
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const blockWorker = async (workerId: string, reason: string, reportType?: ReportType, reportId?: string) => {
  try {
    // Check if worker is already blocked
    const existingBlock = await prisma.block.findFirst({
      where: {
        workerId,
        isActive: true,
        blockType: BlockType.WORKER,
      },
    });

    if (existingBlock) {
      throw new DatabaseError('Worker is already blocked');
    }

    // Get the worker profile to get the userId
    const worker = await prisma.workerProfile.findUnique({
      where: { id: workerId },
      select: { userId: true },
    });

    if (!worker) {
      throw new DatabaseError('Worker not found');
    }

    // Create new block record
    const block = await prisma.block.create({
      data: {
        blockType: BlockType.WORKER,
        userId: worker.userId,
        workerId,
        reason,
        reportType,
        reportId,
        blockedBy: 'admin',
        isActive: true,
      },
      include: {
        worker: {
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

export const unblockWorker = async (workerId: string) => {
  try {
    // Find active block
    const existingBlock = await prisma.block.findFirst({
      where: {
        workerId,
        isActive: true,
        blockType: BlockType.WORKER,
      },
      include: {
        report: true
      }
    });

    if (!existingBlock) {
      throw new DatabaseError('No active block found for this worker');
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
        worker: {
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
