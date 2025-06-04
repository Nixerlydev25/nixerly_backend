import {
  ProfileType,
  ReportCategory,
  ReportJobsCategory,
  ReportStatus,
} from '@prisma/client';
import prisma from '../../config/prisma.config';


export const reportWorker = async (
  reason: string,
  category: ReportCategory,
  targetWorkerId: string,
  userId: string,
  defaultProfile: ProfileType
) => {
  try {
    const targetWorker = await prisma.workerProfile.findUnique({
      where: { id: targetWorkerId },
    });
    if (!targetWorker) {
      throw new Error('Target worker not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workerProfile: true,
        businessProfile: true,
      },
    });

    if (defaultProfile === ProfileType.WORKER) {
      if (!user?.workerProfile) {
        throw new Error('Worker profile not found');
      }
    }

    if (defaultProfile === ProfileType.BUSINESS) {
      if (!user?.businessProfile) {
        throw new Error('Business profile not found');
      }
    }

    const report = await prisma.workerReport.create({
      data: {
        reason,
        category,
        targetWorkerId,
        ...(defaultProfile === ProfileType.WORKER && {
          reporterWorkerId: user?.workerProfile?.id,
        }),
        ...(defaultProfile === ProfileType.BUSINESS && {
          reporterBusinessId: user?.businessProfile?.id,
        }),
        status: ReportStatus.PENDING,
      },
    });
    return report;
  } catch (error) {
    throw new Error(
      `Failed to create worker report: ${(error as Error).message}`
    );
  }
};

export const reportBusiness = async (
  reason: string,
  category: ReportCategory,
  targetBusinessId: string,
  userId: string,
  defaultProfile: ProfileType
) => {
  try {
    const targetBusiness = await prisma.businessProfile.findUnique({
      where: { id: targetBusinessId },
    });
    if (!targetBusiness) {
      throw new Error('Target business not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workerProfile: true,
        businessProfile: true,
      },
    });

    if (defaultProfile === ProfileType.WORKER) {
      if (!user?.workerProfile) {
        throw new Error('Worker profile not found');
      }
    }

    if (defaultProfile === ProfileType.BUSINESS) {
      if (!user?.businessProfile) {
        throw new Error('Business profile not found');
      }
    }

    const report = await prisma.businessReport.create({
      data: {
        reason,
        category,
        targetBusinessId,
        ...(defaultProfile === ProfileType.WORKER && {
          reporterWorkerId: user?.workerProfile?.id,
        }),
        ...(defaultProfile === ProfileType.BUSINESS && {
          reporterBusinessId: user?.businessProfile?.id,
        }),
        status: ReportStatus.PENDING,
      },
    });
    return report;
  } catch (error) {
    throw new Error(
      `Failed to create business report: ${(error as Error).message}`
    );
  }
};


export const reportJob = async (
  reason: string,
  category: ReportJobsCategory,
  targetJobId: string,
  userId: string,
  defaultProfile: ProfileType
) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: targetJobId },
    });

    if (!job) {
      throw new Error('Job not found');
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workerProfile: true,
        businessProfile: true,
      },
    });

    if (defaultProfile === ProfileType.WORKER) {
      const worker = await prisma.workerProfile.findUnique({
        where: { id: user?.workerProfile?.id },
      });
      if (!worker) {
        throw new Error('Reporter worker not found');
      }
    }

    if (defaultProfile === ProfileType.BUSINESS) {
      const business = await prisma.businessProfile.findUnique({
        where: { id: user?.businessProfile?.id },
      });
      if (!business) {
        throw new Error('Reporter business not found');
      }
    }

    const report = await prisma.jobReport.create({
      data: {
        reason,
        category,
        targetJobId,
        ...(defaultProfile === ProfileType.WORKER && {
          reporterWorkerId: user?.workerProfile?.id,
        }),
        ...(defaultProfile === ProfileType.BUSINESS && {
          reporterBusinessId: user?.businessProfile?.id,
        }),
        status: ReportStatus.PENDING,
      },
    });
    return report;
  } catch (error) {
    throw new Error(`Failed to create job report: ${(error as Error).message}`);
  }
};
