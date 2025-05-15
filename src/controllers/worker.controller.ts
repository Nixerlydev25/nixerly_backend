import { Request, Response, NextFunction } from "express";
import * as WorkerModel from "../model/worker.model";
import { ResponseStatus } from "../types/response.enums";
import { SkillName } from "@prisma/client";
import { WorkerFilters, SortOption } from "../utils/filters";

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
