import prisma from "../../config/prisma.config";
import { DatabaseError } from "../../utils/errors";
import { z } from "zod";
import {
  reportWorkerBodySchema,
  reportBusinessBodySchema,
  reportJobBodySchema,
} from "../../schema/v1/reports.validation";

type ReportWorkerInput = z.infer<typeof reportWorkerBodySchema>;
type ReportBusinessInput = z.infer<typeof reportBusinessBodySchema>;
type ReportJobInput = z.infer<typeof reportJobBodySchema>;

export const reportWorker = async (
  businessProfileId: string,
  reportedWorkerId: string,
  data: ReportWorkerInput
) => {
  try {
    return await prisma.workerReport.create({
      data: {
        reportedWorkerId,
        reporterBusinessId: businessProfileId,
        reason: data.reason,
        description: data.description,
      },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const reportBusiness = async (
  workerProfileId: string,
  reportedBusinessId: string,
  data: ReportBusinessInput
) => {
  try {
    return await prisma.businessReport.create({
      data: {
        reportedBusinessId,
        reporterWorkerId: workerProfileId,
        reason: data.reason,
        description: data.description,
      },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const reportJob = async (
  workerProfileId: string,
  reportedJobId: string,
  data: ReportJobInput
) => {
  try {
    return await prisma.jobReport.create({
      data: {
        reportedJobId,
        reporterWorkerId: workerProfileId,
        reason: data.reason,
        description: data.description,
      },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const hasWorkerReportedJob = async (
  workerProfileId: string,
  jobId: string
): Promise<boolean> => {
  try {
    const report = await prisma.jobReport.findFirst({
      where: {
        reporterWorkerId: workerProfileId,
        reportedJobId: jobId,
      },
    });
    return !!report;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const hasWorkerReportedBusiness = async (
  workerProfileId: string,
  businessId: string
): Promise<boolean> => {
  try {
    const report = await prisma.businessReport.findFirst({
      where: {
        reporterWorkerId: workerProfileId,
        reportedBusinessId: businessId,
      },
    });
    return !!report;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const hasBusinessReportedWorker = async (
  businessProfileId: string,
  workerId: string
): Promise<boolean> => {
  try {
    const report = await prisma.workerReport.findFirst({
      where: {
        reporterBusinessId: businessProfileId,
        reportedWorkerId: workerId,
      },
    });
    return !!report;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
