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


export const toggleWorkerBlock = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = request.params;
    const worker = await workerModel.toggleWorkerBlock(workerId);

    response.status(ResponseStatus.OK).json({
      message: `Worker ${worker.isBlocked ? 'blocked' : 'unblocked'} successfully`,
    });
  } catch (error: any) {
    next(error);
  }
};
