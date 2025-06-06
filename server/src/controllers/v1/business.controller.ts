import { NextFunction, Request, Response } from "express";
import { ResponseStatus, ResponseMessages } from "../../types/response.enums";
import * as businessModel from "../../model/v1/business.model";
import { NotFoundError } from "../../utils/errors";
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from "../../services/s3.service";

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

export const getProfilePictureUploadUrlHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { contentType, fileName } = request.body;

    // Generate a unique key for the S3 object
    const fileExtension = fileName.split('.').pop();
    const s3Key = `profile-pictures/business/${userId}/${uuidv4()}.${fileExtension}`;

    // Generate presigned URL
    const presignedUrl = await S3Service.generatePresignedUrl(s3Key, contentType);

    return response.status(ResponseStatus.OK).json({
      presignedUrl,
      s3Key,
    });
  } catch (error: any) {
    return next(error);
  }
};

export const saveProfilePictureHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { s3Key } = request.body;

    const profilePicture = await businessModel.saveProfilePicture(userId, s3Key);

    return response.status(ResponseStatus.OK).json({
      message: ResponseMessages.Success,
      profilePicture,
    });
  } catch (error: any) {
    return next(error);
  }
};
