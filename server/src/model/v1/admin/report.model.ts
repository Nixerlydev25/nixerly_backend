import { ReportCategory } from '@prisma/client';
import prisma from '../../../config/prisma.config';
import { DatabaseError } from '../../../utils/errors';

export const getAllWorkerReports = async (filters: any) => {
  try {
    const { page, limit, search, reportCategory } = filters;
    const skip = (page - 1) * limit;
    const reports = await prisma.workerReport.findMany({
      where: {
        ...(reportCategory && { reportCategory }),
      },
      include: {
        reporterWorker: true,
        reporterBusiness: true,
        targetWorker: true,
      },
      skip,
      take: limit,
    });
    const totalCount = await prisma.workerReport.count({
      where: {
        ...(reportCategory && { reportCategory }),
      },
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

export const getWorkerReportById = async (id: string) => {
  try {
    const report = await prisma.workerReport.findUnique({
      where: { id },
      include: {
        reporterBusiness: true,
        reporterWorker: true,
        targetWorker: true,
      },
    });
    return report;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getAllBusinessReports = async (filters: any) => {
  try {
    const { page, limit, search, reportCategory } = filters;
    const skip = (page - 1) * limit;
    const reports = await prisma.businessReport.findMany({
      where: {
        ...(reportCategory && { reportCategory }),
      },
      include: {
        reporterWorker: true,
        reporterBusiness: true,
        targetBusiness: true,
      },
      skip,
      take: limit,
    });
    const totalCount = await prisma.businessReport.count({
      where: {
        ...(reportCategory && { reportCategory }),
      },
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

export const getBusinessReportById = async (id: string) => {
  try {
    const report = await prisma.businessReport.findUnique({
      where: { id },
      include: {
        reporterWorker: true,
        reporterBusiness: true,
        targetBusiness: true,
      },
    });
    return report;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getAllJobReports = async (filters: any) => {
  try {
    const { page, limit, search, reportCategory } = filters;
    const skip = (page - 1) * limit;
    const reports = await prisma.jobReport.findMany({
      where: {
        ...(reportCategory && { reportCategory }),
      },
      include: {
        reporterWorker: true,
        reporterBusiness: true,
        job: true,
      },
      skip,
      take: limit,
    });
    const totalCount = await prisma.jobReport.count({
      where: {
        ...(reportCategory && { reportCategory }),
      },
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

export const getJobReportById = async (id: string) => {
  try {
    const report = await prisma.jobReport.findUnique({
      where: { id },
      include: {
        reporterWorker: true,
        reporterBusiness: true,
        job: true,
      },
    });
    return report;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const toggleBlockWorkerByReport = async (reportId: string) => {
  try {
    const report = await prisma.workerReport.findUnique({
      where: { id: reportId },
      include: {
        targetWorker: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!report) {
      throw new DatabaseError('Report not found');
    }

    // Block worker profile
    const updatedWorker = await prisma.workerProfile.update({
      where: { id: report.targetWorkerId },
      data: {
        isBlocked: !report.targetWorker.isBlocked,
      },
    });

    // Block associated user
    await prisma.user.update({
      where: { id: report.targetWorker.user.id },
      data: {
        isSuspended: true,
      },
    });

    return updatedWorker;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const toggleBlockBusinessByReport = async (reportId: string) => {
  try {
    const report = await prisma.businessReport.findUnique({
      where: { id: reportId },
      include: {
        targetBusiness: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!report) {
      throw new DatabaseError('Report not found');
    }

    // Block business profile
    const updatedBusiness = await prisma.businessProfile.update({
      where: { id: report.targetBusinessId },
      data: {
        isBlocked: !report.targetBusiness.isBlocked,
      },
    });

    // Block associated user
    await prisma.user.update({
      where: { id: report.targetBusiness.user.id },
      data: {
        isSuspended: true,
      },
    });

    return updatedBusiness;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const toggleBlockJobByReport = async (reportId: string) => {
  try {
    const report = await prisma.jobReport.findUnique({
      where: { id: reportId },
      include: {
        job: true,
      },
    });

    if (!report) {
      throw new DatabaseError('Report not found');
    }

    // Block job
    const updatedJob = await prisma.job.update({
      where: { id: report.jobId },
      data: {
        isBlocked: !report.job.isBlocked,
      },
    });

    return updatedJob;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
