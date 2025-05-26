import { ReportType } from '@prisma/client';
import prisma from '../../../config/prisma.config';
import { DatabaseError } from '../../../utils/errors';

export const getAllReports = async (filters: any) => {
  try {
    const { page, limit, search, reportType } = filters;
    const skip = (page - 1) * limit;
    const reports = await prisma.report.findMany({
      where: {
        ...(reportType && { reportType }),
      },
      include: {
        reporterWorker: true,
        reporterBusiness: true,
        reportedWorker: true,
        reportedBusiness: true,
        reportedJob: true
      },
      skip,
      take: limit,
    });
    const totalCount = await prisma.report.count({
      where: {
        ...(reportType && { reportType }),
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

export const getReportById = async (id: string) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        reporterBusiness: true,
        reporterWorker: true,
        reportedBusiness: true,
        reportedWorker: true,
        reportedJob: true
      },
    });
    return report;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const blockUserByReport = async (reportId: string) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        reportedWorker: {
          include: {
            user: true
          }
        },
        reportedBusiness: {
          include: {
            user: true
          }
        },
        reportedJob: true
      }
    });

    if (!report) {
      throw new DatabaseError('Report not found');
    }

    if (report.reportedWorker) {
      // Block worker profile
      const updatedWorker = await prisma.workerProfile.update({
        where: { id: report.reportedWorkerId! },
        data: {
          isBlocked: true
        }
      });

      // Block associated user
      await prisma.user.update({
        where: { id: report.reportedWorker.userId },
        data: {
          isSuspended: true
        }
      });

      return updatedWorker;

    } else if (report.reportedBusiness) {
      // Block business profile
      const updatedBusiness = await prisma.businessProfile.update({
        where: { id: report.reportedBusinessId! },
        data: {
          isBlocked: true
        }
      });

      // Block associated user
      await prisma.user.update({
        where: { id: report.reportedBusiness.userId },
        data: {
          isSuspended: true
        }
      });

      return updatedBusiness;

    } else if (report.reportedJob) {
      // Block job
      const updatedJob = await prisma.job.update({
        where: { id: report.reportedJobId! },
        data: {
          isBlocked: true
        }
      });

      return updatedJob;
    }

    throw new DatabaseError('No valid entity found to block');

  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const unblockUserByReport = async (reportId: string) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        reportedWorker: {
          include: {
            user: true
          }
        },
        reportedBusiness: {
          include: {
            user: true
          }
        },
        reportedJob: true
      }
    });

    if (!report) {
      throw new DatabaseError('Report not found');
    }
    
    if (report.reportedWorker) {
      // Unblock worker profile
      const updatedWorker = await prisma.workerProfile.update({
        where: { id: report.reportedWorkerId! },
        data: {
          isBlocked: false
        }
      });

      // Unblock associated user
      await prisma.user.update({
        where: { id: report.reportedWorker.userId },
        data: {
          isSuspended: false
        }
      });

      return updatedWorker;

    } else if (report.reportedBusiness) {
      // Unblock business profile
      const updatedBusiness = await prisma.businessProfile.update({
        where: { id: report.reportedBusinessId! },
        data: {
          isBlocked: false
        }
      });

      // Unblock associated user
      await prisma.user.update({
        where: { id: report.reportedBusiness.userId },
        data: {
          isSuspended: false
        }
      });

      return updatedBusiness;

    } else if (report.reportedJob) {
      // Unblock job
      const updatedJob = await prisma.job.update({
        where: { id: report.reportedJobId! },
        data: {
          isBlocked: false
        }
      });

      return updatedJob;
    }

    throw new DatabaseError('No valid entity found to unblock');
    
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
