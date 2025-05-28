import { NextFunction, Request, Response } from 'express';
import { ResponseStatus } from '../../../types/response.enums';
import * as jobModel from '../../../model/v1/admin/job.model';
export const getAllJobs = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query;
    const { jobs, pagination } = await jobModel.getAllJobs(filters as any);
    response.status(ResponseStatus.OK).json({
      message: 'Jobs fetched successfully',
      jobs,
      pagination,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getJobById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = request.params;
    const job = await jobModel.getJobById(jobId);
    response.status(ResponseStatus.OK).json({
      message: 'Job fetched successfully',
      job,
    });
  } catch (error: any) {
    next(error);
  }
};

export const blockJob = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = request.params;
    const { reason } = request.body;
    await jobModel.blockJob(jobId, reason);
    response.status(ResponseStatus.OK).json({
      message: 'Job blocked successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

export const unblockJob = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = request.params;
    await jobModel.unblockJob(jobId);
    response.status(ResponseStatus.OK).json({
      message: 'Job unblocked successfully',
    });
  } catch (error: any) {
    next(error);
  }
};
