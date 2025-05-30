import { ReportCategory } from '@prisma/client';
import prisma from '../../config/prisma.config';

export const createReportWorker = async (
  reason: string,
  category: ReportCategory,
  targetWorkerId: string
) => {
  try {
    const report = await prisma.workerReport.create({
      data: {
        reason,
        category,
        targetWorkerId,
      },
    });

    return report;
  } catch (error) {
    throw new Error('Failed to create report');
  }
};

export const createReportBusiness = async (
  reason: string,
  category: ReportCategory,
  targetBusinessId: string
) => {
  try {
    const report = await prisma.businessReport.create({
      data: {
        reason,
        category,
        targetBusinessId,
      },
    });

    return report;
  } catch (error) {
    throw new Error('Failed to create report');
  }
};

export const createReportJob = async (
  reason: string,
  category: ReportCategory,
  targetJobId: string
) => {
  try {
    const report = await prisma.jobReport.create({
      data: {
        reason,
        category,
        jobId: targetJobId,
      },
    });

    return report;
  } catch (error) {
    throw new Error('Failed to create report');
  }
};
