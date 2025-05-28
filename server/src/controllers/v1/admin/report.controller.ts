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

export const getBusinessReports = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query;
    const { reports, pagination } = await reportModel.getBusinessReports(
      filters as any
    );
    response.status(ResponseStatus.OK).json({
      message: 'Business reports fetched successfully',
      reports,
      pagination,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getWorkerReports = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query;
    const { reports, pagination } = await reportModel.getWorkerReports(
      filters as any
    );
    response.status(ResponseStatus.OK).json({
      message: 'Worker reports fetched successfully',
      reports,
      pagination,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getJobReports = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query;
    const { reports, pagination } = await reportModel.getJobReports(
      filters as any
    );
    response.status(ResponseStatus.OK).json({
      message: 'Job reports fetched successfully',
      reports,
      pagination,
    });
  } catch (error: any) {
    next(error);
  }
};

export const blockWorkerByReport = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    await reportModel.blockWorkerByReport(reportId);
    response.status(ResponseStatus.OK).json({
      message: 'Worker blocked successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

export const unblockWorkerByReport = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    await reportModel.unblockWorkerByReport(reportId);
    response.status(ResponseStatus.OK).json({
      message: 'Worker unblocked successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

export const blockJobByReport = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    await reportModel.blockJobByReport(reportId);
    response.status(ResponseStatus.OK).json({
      message: 'Job blocked successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

export const unblockJobByReport = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    await reportModel.unblockJobByReport(reportId);
    response.status(ResponseStatus.OK).json({
      message: 'Job unblocked successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

export const blockBusinessByReport = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    await reportModel.blockUserByReport(reportId);
    response.status(ResponseStatus.OK).json({
      message: 'User blocked successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

export const unblockBusinessByReport = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    await reportModel.unblockBusinessByReport(reportId);
    response.status(ResponseStatus.OK).json({
      message: 'Business unblocked successfully',
    });
  } catch (error: any) {
    next(error);
  }
};
