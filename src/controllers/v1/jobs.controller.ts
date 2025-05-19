import { Request, Response, NextFunction } from "express";
import { ResponseStatus } from "../../types/response.enums";
import * as jobModel from "../../model/v1/jobs.model";
import prisma from "../../config/prisma.config";
import { DatabaseError } from "../../utils/errors";

export const createJobHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const jobData = request.body;

    // Get business profile ID for the user
    const businessProfile = await prisma.businessProfile.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!businessProfile) {
      throw new DatabaseError("Business profile not found for this user");
    }

    const createdJob = await jobModel.createJob(businessProfile.id, jobData);

    response.status(ResponseStatus.Created).json({
      success: true,
      message: "Job created successfully",
      data: createdJob,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query;
    const { jobs, pagination } = await jobModel.getJobs(filters as any);

    response.status(ResponseStatus.OK).json({
      ...pagination,
      jobs: jobs,
    });
  } catch (error) {
    next(error);
  }
};
