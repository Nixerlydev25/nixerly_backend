import { Request, Response, NextFunction } from "express";
import { WorkerModel } from "../model/worker.model";
import { ResponseStatus } from "../types/response.enums";
import { SkillName } from "@prisma/client";

export const getAllWorkers = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, skills, minHourlyRate, maxHourlyRate, minTotalEarnings, maxTotalEarnings, minAvgRating, maxAvgRating } = request.query;
    
    const pageP = parseInt(page as string, 10) || 1;
    const limitP = parseInt(limit as string, 10) || 10;
    const skip = (pageP - 1) * limitP;

    // Parse and convert filter parameters
    const filters = {
      skills: skills ? (skills as string).split(',').map(skill => skill as SkillName) : undefined,
      minHourlyRate: minHourlyRate ? parseFloat(minHourlyRate as string) : undefined,
      maxHourlyRate: maxHourlyRate ? parseFloat(maxHourlyRate as string) : undefined,
      minTotalEarnings: minTotalEarnings ? parseFloat(minTotalEarnings as string) : undefined,
      maxTotalEarnings: maxTotalEarnings ? parseFloat(maxTotalEarnings as string) : undefined,
      minAvgRating: minAvgRating ? parseFloat(minAvgRating as string) : undefined,
      maxAvgRating: maxAvgRating ? parseFloat(maxAvgRating as string) : undefined,
    };

    const { workers, totalCount } = await WorkerModel.getAllWorkers(
      skip,
      limitP,
      filters
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
    });
  } catch (error) {
    next(error);
  }
};
