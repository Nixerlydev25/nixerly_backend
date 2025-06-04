import { Request, Response, NextFunction } from "express";
import { ResponseStatus } from "../../../types/response.enums";
import * as adminReportsModel from "../../../model/v1/admin/admin-reports.model";

export const getAllJobReports = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query;
    const { reports, pagination } = await adminReportsModel.getAllJobReports(filters as any);
    
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Job reports fetched successfully",
      data: {
        reports,
        pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllWorkerReports = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query;
    const { reports, pagination } = await adminReportsModel.getAllWorkerReports(filters as any);
    
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Worker reports fetched successfully",
      data: {
        reports,
        pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBusinessReports = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query;
    const { reports, pagination } = await adminReportsModel.getAllBusinessReports(filters as any);
    
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Business reports fetched successfully",
      data: {
        reports,
        pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getJobReportDetails = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    const report = await adminReportsModel.getJobReportDetails(reportId);
    
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Job report details fetched successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerReportDetails = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    const report = await adminReportsModel.getWorkerReportDetails(reportId);
    
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Worker report details fetched successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessReportDetails = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = request.params;
    const report = await adminReportsModel.getBusinessReportDetails(reportId);
    
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Business report details fetched successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};
