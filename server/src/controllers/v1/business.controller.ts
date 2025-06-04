import { NextFunction, Request, Response } from "express";
import { ResponseStatus } from "../../types/response.enums";
import * as businessModel from "../../model/v1/business.model";
import { NotFoundError } from "../../utils/errors";

export const updateBusinessProfileHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { ...businessProfile } = request.body;

    const updatedUser = await businessModel.updateBusinessProfile(
      userId,
      businessProfile
    );

    return response.status(ResponseStatus.OK).json(updatedUser);
  } catch (error: any) {
    next(error);
  }
};

export const getBusinessProfileDetailsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { businessId } = request.params;
    console.log({ businessId });
    const userDetails = await businessModel.getBusinessProfileDetails(
      businessId
    );

    if (!userDetails) {
      throw new NotFoundError("Business profile not found");
    }

    return response.status(ResponseStatus.OK).json(userDetails);
  } catch (error: any) {
    return next(error);
  }
};

export const getMyBusinessJobsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const filters = request.query;

    const { allJobsPosts, pagination, jobStatusCounts } = await businessModel.getAllBusinessJobs(
      userId,
      filters as any
    );

    response.status(ResponseStatus.OK).json({
      success: true,
      message: "All business Jobs fetched",
      jobs: allJobsPosts,
      jobStatusCounts: jobStatusCounts,
      pagination,
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
    const { userId } = request.user;

    const job = await businessModel.getJobById(jobId, userId);

    return response.status(ResponseStatus.OK).json({
      success: true,
      message: "Job details fetched successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
};
