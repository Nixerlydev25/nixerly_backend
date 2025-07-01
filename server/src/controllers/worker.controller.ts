import { Request, Response, NextFunction } from "express";
import * as WorkerModel from "../model/worker.model";
import { ResponseMessages, ResponseStatus } from "../types/response.enums";
import { SkillName } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { S3Service } from "../services/s3.service";

export const getAllWorkers = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query;

    const {
      workers,
      pagination: { totalCount, totalPages, currentPage, hasMore },
    } = await WorkerModel.getAllWorkers(filters as any);

    response.status(ResponseStatus.OK).json({
      data: workers,
      pagination: {
        totalCount,
        totalPages,
        currentPage,
        hasMore,
      },
      filters: {
        applied: Object.entries(filters)
          .filter(([_, value]) => value !== undefined)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed information about a specific worker
 * Excludes conversation data
 */
export const getWorkerDetails = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = request.params;

    const worker = await WorkerModel.getWorkerById(workerId);

    if (!worker) {
      return response.status(ResponseStatus.NotFound).json({
        message: "Worker not found",
      });
    }

    response.status(ResponseStatus.OK).json(worker);
  } catch (error) {
    next(error);
  }
};

export const updateWorkerProfileHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { onboardingStep, ...workerProfile } = request.body;

    const updatedUser = await WorkerModel.updateWorkerProfile(
      userId,
      onboardingStep,
      workerProfile
    );

    return response.status(ResponseStatus.OK).json(updatedUser);
  } catch (error: any) {
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
    const fileExtension = fileName.split(".").pop();
    const s3Key = `profile-pictures/${userId}/${uuidv4()}.${fileExtension}`;

    // Generate presigned URL
    const presignedUrl = await S3Service.generatePresignedUrl(
      s3Key,
      contentType
    );

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

    const profilePicture = await WorkerModel.saveProfilePicture(userId, s3Key);

    return response.status(ResponseStatus.OK).json({
      message: ResponseMessages.Success,
      profilePicture,
    });
  } catch (error: any) {
    return next(error);
  }
};
