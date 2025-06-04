import { Request, Response } from 'express';
import { ResponseStatus } from '../../types/response.enums';
import * as reportModel from '../../models/v1/report.model';
import { ProfileType } from '@prisma/client';

export const createReportWorkerHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const { reason, category, targetWorkerId } = request.body;
    const { userId, defaultProfile } = request.user;

    await reportModel.reportWorker(
      reason,
      category,
      targetWorkerId,
      userId,
      defaultProfile
    );

    return response.status(ResponseStatus.OK).json({
      message: 'Reported worker successfully',
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
    const { userId, defaultProfile } = request.user;

    await reportModel.reportBusiness(
      reason,
      category,
      targetBusinessId,
      userId,
      defaultProfile
    );

    return response.status(ResponseStatus.OK).json({
      message: 'Reported business successfully',
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
    const { userId, defaultProfile } = request.user;

    await reportModel.reportJob(
      reason,
      category,
      targetJobId,
      userId,
      defaultProfile
    );

    return response.status(ResponseStatus.OK).json({
      message: 'Reported job successfully',
    });
  } catch (error) {
    return response.status(ResponseStatus.BadRequest).json({
      message: 'Invalid request body',
      error: (error as Error).message,
    });
  }
};
