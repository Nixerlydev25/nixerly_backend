import { ReportStatus } from "@prisma/client";
import prisma from "../../../config/prisma.config";
import { DatabaseError, NotFoundError } from "../../../utils/errors";

export const toggleWorkerBlockStatus = async (workerId: string) => {
  try {
    const worker = await prisma.workerProfile.findUnique({
      where: { id: workerId },
      select: { 
        isBlocked: true,
        reportsReceived: {
          select: {
            id: true,
            status: true
          }
        }
      },
    });

    if (!worker) {
      throw new NotFoundError("Worker profile not found");
    }

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

    // If worker is blocked, update all pending reports to ACTION_TAKEN
    if (!worker.isBlocked && updatedWorker.isBlocked) {
      await prisma.workerReport.updateMany({
        where: {
          reportedWorkerId: workerId,
          status: ReportStatus.PENDING
        },
        data: {
          status: ReportStatus.ACTION_TAKEN
        }
      });
    }

    return updatedWorker;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const toggleBusinessBlockStatus = async (businessId: string) => {
  try {
    const business = await prisma.businessProfile.findUnique({
      where: { id: businessId },
      select: { 
        isBlocked: true,
        reportsReceived: {
          select: {
            id: true,
            status: true
          }
        }
      },
    });

    if (!business) {
      throw new NotFoundError("Business profile not found");
    }

    const updatedBusiness = await prisma.businessProfile.update({
      where: { id: businessId },
      data: {
        isBlocked: !business.isBlocked,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        jobs: {
          select: {
            id: true,
          },
        },
      },
    });

    // If business is blocked, also block all their active jobs
    if (!business.isBlocked && updatedBusiness.isBlocked) {
      await prisma.job.updateMany({
        where: {
          businessProfileId: businessId,
          isBlocked: false,
        },
        data: {
          isBlocked: true,
        },
      });

      // Update any pending reports to ACTION_TAKEN
      await prisma.businessReport.updateMany({
        where: {
          reportedBusinessId: businessId,
          status: ReportStatus.PENDING
        },
        data: {
          status: ReportStatus.ACTION_TAKEN
        }
      });
    }

    return updatedBusiness;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
export const toggleJobBlockStatus = async (jobId: string) => {
  try {
    console.log({jobId});
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { 
        isBlocked: true,
        reportsReceived: {
          select: {
            id: true,
            status: true
          }
        }
      },
    });

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        isBlocked: !job.isBlocked,
      },
      include: {
        businessProfile: {
          select: {
            companyName: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    // If job is being blocked, update any pending reports to ACTION_TAKEN
    if (!job.isBlocked && updatedJob.isBlocked) {
      await prisma.jobReport.updateMany({
        where: {
          reportedJobId: jobId,
          status: ReportStatus.PENDING
        },
        data: {
          status: ReportStatus.ACTION_TAKEN
        }
      });
    }

    return updatedJob;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};