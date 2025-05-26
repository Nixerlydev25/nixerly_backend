import { Request, Response, NextFunction } from 'express';
import * as workerModel from '../../../model/v1/admin/worker.model';
import { ResponseStatus } from '../../../types/response.enums';

export const getAllWorkers = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query;

    const {
      pagination: { totalCount, totalPages, currentPage, hasMore },
      workers,
    } = await workerModel.getAllWorkers(filters as any);

    response.status(ResponseStatus.OK).json({
      message: 'Workers fetched successfully',
      pagination: {
        totalCount,
        totalPages,
        currentPage,
        hasMore,
      },
      data: workers,
    });
  } catch (error: any) {
    next(error);
  }
};

export const blockWorker = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = request.params;
    const { reason } = request.body;

    await workerModel.blockWorker(workerId, reason);

    response.status(ResponseStatus.OK).json({
      message: 'Worker blocked successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

export const unblockWorker = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = request.params;
    await workerModel.unblockWorker(workerId);

    response.status(ResponseStatus.OK).json({
      message: 'Worker unblocked successfully',
    });
  } catch (error: any) {
    next(error);
  }
};
