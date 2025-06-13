import { Request, Response, NextFunction, request } from "express";
import { ResponseStatus } from "../../types/response.enums";
import * as jobModel from "../../model/v1/jobs.model";
import prisma from "../../config/prisma.config";
import { BadRequestError, DatabaseError, NotFoundError, UnauthorizedError } from "../../utils/errors";
import { JobStatus } from "@prisma/client";

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
    const { jobs, pagination:{totalCount,
      totalPages,
      currentPage,
      hasMore,} } = await jobModel.getJobs(filters as any);

    response.status(ResponseStatus.OK).json({
      pagination:{
        totalCount,
        totalPages,
        currentPage,
        hasMore,
      },
      jobs: jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobDetailsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = request.params;
    console.log(jobId);
    const { userId, defaultProfile } = request.user;
    const jobFound = await jobModel.getJobById(jobId);
    if (!jobFound) {
      throw new NotFoundError("Job not found");
    }
    const job = await jobModel.getJobDetails(jobId, userId, defaultProfile);

    response.status(ResponseStatus.OK).json(job);
  } catch (error) {
    next(error);
  }
};

export const applyJobHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = request.params;
    const { userId } = request.user;
    const { coverLetter, proposedRate, availability: workerStartDateAvailability, jobDuration: duration } = request.body;

    const jobFound = await jobModel.getJobById(jobId);

    if (!jobFound) {
      throw new NotFoundError("Job not found");
    }

    if (jobFound.status === JobStatus.CLOSED) {
      throw new BadRequestError("Job is closed");
    }

    const appliedJob = await jobModel.applyJob(
      jobId,
      userId,
      coverLetter,
      proposedRate,
      workerStartDateAvailability,
      duration
    );

    response.status(ResponseStatus.Created).json({
      success: true,
      message: "Job applied successfully",
      data: appliedJob,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicantsOfJobHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = request.params;
    const { userId } = request.user;
    const filters = request.query;
    
    // check if job exists
    const jobFound = await jobModel.getJobById(jobId);
    if (!jobFound) {
      throw new NotFoundError("Job not found");
    }

    // check if user owns the job
    const isOwner = await jobModel.checkIfUserOwnsJob(userId, jobId);
    if (!isOwner) {
      throw new UnauthorizedError("You are not authorized to view this job");
    }

    const applicants = await jobModel.getApplicantsOfJob(jobId, filters as any);

    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Applicants fetched successfully",
      data: applicants,
    });
  } catch (error) {
    next(error);
  }
};
