import { Request, Response, NextFunction } from "express";
import * as WorkerModel from "../model/worker.model";
import { ResponseMessages, ResponseStatus } from "../types/response.enums";
import { SkillName } from "@prisma/client";
import { WorkerFilters, SortOption } from "../utils/filters";
import { v4 as uuidv4 } from 'uuid';
import {S3Service} from "../services/s3.service";

export const getAllWorkers = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, skills, minHourlyRate, maxHourlyRate, minTotalEarnings, maxTotalEarnings, minAvgRating, maxAvgRating, sort } = request.query;
    console.log(request.query)
    const pageP = parseInt(page as string, 10) || 1;
    const limitP = parseInt(limit as string, 10) || 10;
    const skip = (pageP - 1) * limitP;

    // Parse and convert filter parameters
    const filters: WorkerFilters = {
      skills: skills ? (skills as string).split(',').map(skill => skill as SkillName) : undefined,
      minHourlyRate: minHourlyRate ? parseFloat(minHourlyRate as string) : undefined,
      maxHourlyRate: maxHourlyRate ? parseFloat(maxHourlyRate as string) : undefined,
      minTotalEarnings: minTotalEarnings ? parseFloat(minTotalEarnings as string) : undefined,
      maxTotalEarnings: maxTotalEarnings ? parseFloat(maxTotalEarnings as string) : undefined,
      minAvgRating: minAvgRating ? parseFloat(minAvgRating as string) : undefined,
      maxAvgRating: maxAvgRating ? parseFloat(maxAvgRating as string) : undefined,
    };

    // Validate sort parameter if provided
    let sortOption: string | undefined = sort as string;
    if (sortOption && !Object.values(SortOption).includes(sortOption as SortOption)) {
      sortOption = undefined; // Use default sorting if invalid sort option
    }

    const { workers, totalCount } = await WorkerModel.getAllWorkers(
      skip,
      limitP,
      filters,
      sortOption
    );

    const totalPages = Math.ceil(totalCount / limitP);
    const hasMore = pageP < totalPages;

    response.status(ResponseStatus.OK).json({
      data: workers,
      totalCount,
      totalPages,
      currentPage: pageP,
      hasMore,
      filters: {
        applied: Object.entries(filters)
          .filter(([_, value]) => value !== undefined)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
      },
      sort: sortOption,
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
        message: "Worker not found"
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
    const fileExtension = fileName.split('.').pop();
    const s3Key = `profile-pictures/${userId}/${uuidv4()}.${fileExtension}`;

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

    const profilePicture = await WorkerModel.saveProfilePicture(userId, s3Key);

    return response.status(ResponseStatus.OK).json({
      message: ResponseMessages.Success,
      profilePicture,
    });
  } catch (error: any) {
    return next(error);
  }
};
