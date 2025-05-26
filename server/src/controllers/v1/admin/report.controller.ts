import { NextFunction, Request, Response } from 'express';
import { ResponseStatus } from '../../../types/response.enums';
import * as reportModel from '../../../model/v1/admin/report.model';

export const getAllReports = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query;
    const { reports, pagination } = await reportModel.getAllReports(
      filters as any
    );
    response.status(ResponseStatus.OK).json({
      message: 'Reports fetched successfully',
      reports,
      pagination,
    });
  } catch (error: any) {
    next(error);
  }
};
