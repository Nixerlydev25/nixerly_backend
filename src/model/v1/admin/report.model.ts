import { BlockType } from '@prisma/client';
import prisma from '../../../config/prisma.config';
import { DatabaseError } from '../../../utils/errors';

export const getAllReports = async (filters: any) => {
  try {
    const { page, limit, search, status, country } = filters;
    const skip = (page - 1) * limit;
    const reports = await prisma.report.findMany({
      where: filters,
      skip,
      take: limit,
    });
    const totalCount = await prisma.report.count({
      where: filters,
    });
    const totalPages = Math.ceil(totalCount / filters.limit);
    const currentPage = parseInt(filters.page);
    const hasMore = currentPage < totalPages;
    return {
      reports,
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

export const getReportById = async (id: string) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        reporterBusiness: true,
        reporterWorker: true,
        reportedBusiness: true,
        reportedWorker: true,
        reportedJob: true,
        blocks: true,
      },
    });
    return report;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const blockUserByReport = async (reportId: string, reason: string) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        reportedWorker: true,
        reportedBusiness: true
      }
    });

    if (!report) {
      throw new DatabaseError('Report not found');
    }

    let blockType;
    let userId;
    let workerId;
    let businessId;

    if (report.reportedWorker) {
      blockType = BlockType.WORKER;
      userId = report.reportedWorker.userId;
      workerId = report.reportedWorkerId;
    } else if (report.reportedBusiness) {
      blockType = BlockType.BUSINESS; 
      userId = report.reportedBusiness.userId;
      businessId = report.reportedBusinessId;
    } else {
      throw new DatabaseError('No valid user found to block');
    }

    const block = await prisma.block.create({
      data: {
        reportId,
        reason,
        blockedBy: 'admin',
        isActive: true,
        blockType,
        userId,
        ...(workerId && { workerId }),
        ...(businessId && { businessId })
      },
      include: {
        report: true,
        worker: {
          include: {
            user: true
          }
        },
        business: {
          include: {
            user: true
          }
        }
      },
    });

    return block;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
