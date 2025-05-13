import { Request, Response, NextFunction } from "express";
import { WorkerModel } from "../model/worker.model";
import { ResponseStatus } from "../types/response.enums";

export const getAllWorkers = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, ...filters } = request.query;
    const pageP = parseInt(page as string, 10) || 1;
    const limitP = parseInt(limit as string, 10) || 10;
    const skip = (pageP - 1) * limitP;

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
      currentPage: page,
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
