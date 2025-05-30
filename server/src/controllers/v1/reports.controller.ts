import { request, Request, Response } from 'express';
import { createReportWorkerSchema } from '../../schema/v1/reports.validation';
import { ResponseStatus } from '../../types/response.enums';
import * as reportModel from '../../models/v1/report.model';

export const createReportWorkerHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const { reason, category, targetWorkerId } = request.body;

    await reportModel.createReportWorker(reason, category, targetWorkerId);

    return response.status(ResponseStatus.OK).json({
      message: 'Reported to user successfully',
    });
  } catch (error) {
    return response.status(ResponseStatus.BadRequest).json({
      message: 'Invalid request body',
      error: (error as Error).message,
    });
  }
};

export const createReportBusinessHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const { reason, category, targetBusinessId } = request.body;

    await reportModel.createReportBusiness(reason, category, targetBusinessId);

    return response.status(ResponseStatus.OK).json({
      message: 'Reported to business successfully',
    });
  } catch (error) {
    return response.status(ResponseStatus.BadRequest).json({
      message: 'Invalid request body',
      error: (error as Error).message,
    });
  }
};

export const createReportJobHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const { reason, category, targetJobId } = request.body;

    await reportModel.createReportJob(reason, category, targetJobId);

    return response.status(ResponseStatus.OK).json({
      message: 'Reported to job successfully',
    });
  } catch (error) {
    return response.status(ResponseStatus.BadRequest).json({
      message: 'Invalid request body',
      error: (error as Error).message,
    });
  }
};
