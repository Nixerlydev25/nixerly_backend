import { NextFunction, Request, Response } from 'express';
import { ResponseStatus } from '../../../types/response.enums';
import * as reportModel from '../../../model/v1/admin/report.model';

export const getWorkerReports = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const reports = await reportModel.getAllWorkerReports(request.query);
    return response.status(ResponseStatus.OK).json({
      message: 'Worker reports fetched successfully',
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerReportById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    const report = await reportModel.getWorkerReportById(reportId);
    return response.status(ResponseStatus.OK).json({
      message: 'Worker report fetched successfully',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessReportById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    const report = await reportModel.getBusinessReportById(reportId);
    return response.status(ResponseStatus.OK).json({
      message: 'Business report fetched successfully',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobReportById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    const report = await reportModel.getJobReportById(reportId);
    return response.status(ResponseStatus.OK).json({
      message: 'Job report fetched successfully',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};


export const getBusinessReports = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const reports = await reportModel.getAllBusinessReports(request.query);
    return response.status(ResponseStatus.OK).json({
      message: 'Business reports fetched successfully',
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobReports = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const reports = await reportModel.getAllJobReports(request.query);
    return response.status(ResponseStatus.OK).json({
      message: 'Job reports fetched successfully',
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBlockWorkerByReport = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    const updatedWorker = await reportModel.toggleBlockWorkerByReport(reportId);
    return response.status(ResponseStatus.OK).json({
      message: 'Worker report toggled successfully',
      data: updatedWorker,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBlockBusinessByReport = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    const updatedBusiness = await reportModel.toggleBlockBusinessByReport(
      reportId
    );
    return response.status(ResponseStatus.OK).json({
      message: 'Business report toggled successfully',
      data: updatedBusiness,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBlockJobByReport = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    console.log(reportId);
    const updatedJob = await reportModel.toggleBlockJobByReport(reportId);
    return response.status(ResponseStatus.OK).json({
      message: 'Job report toggled successfully',
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};
