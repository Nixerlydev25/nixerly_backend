import { Request, Response, NextFunction } from "express";
import { ResponseStatus } from "../../types/response.enums";
import * as reportModel from "../../model/v1/report.model";
import * as businessModel from "../../model/v1/business.model";
import * as workerModel from "../../model/worker.model";
import * as jobModel from "../../model/v1/admin/job.model";

export const reportWorkerHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { workerId } = request.params; // Get workerId from params
    const reportData = request.body;

    // Get business profile using existing model
    const businessProfile = await businessModel.getBusinessProfileDetailsByUserId(
      userId
    );
    if (!businessProfile) {
      return response.status(ResponseStatus.NotFound).json({
        success: false,
        message: "Business profile not found",
      });
    }

    // Verify worker exists
    const worker = await workerModel.getWorkerProfileByUserId(workerId);
    if (!worker) {
      return response.status(ResponseStatus.NotFound).json({
        success: false,
        message: "Worker not found",
      });
    }

    const created = await reportModel.reportWorker(
      businessProfile.id,
      workerId,
      reportData
    );
    response.status(ResponseStatus.Created).json({
      success: true,
      message: "Worker report submitted successfully",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

export const reportBusinessHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { businessId } = request.params; // Get businessId from params
    const reportData = request.body;

    // Get worker profile using existing model
    const worker = await workerModel.getWorkerProfileByUserId(userId);
    if (!worker) {
      return response.status(ResponseStatus.NotFound).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    // Verify business exists
    const business = await businessModel.getBusinessProfileDetails(businessId);
    if (!business) {
      return response.status(ResponseStatus.NotFound).json({
        success: false,
        message: "Business not found",
      });
    }

    const created = await reportModel.reportBusiness(
      worker.id,
      businessId,
      reportData
    );
    response.status(ResponseStatus.Created).json({
      success: true,
      message: "Business report submitted successfully",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

export const reportJobHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { jobId } = request.params; // Get jobId from params
    const reportData = request.body;

    // Get worker profile using existing model
    const worker = await workerModel.getWorkerProfileByUserId(userId);
    if (!worker) {
      return response.status(ResponseStatus.NotFound).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    // Verify job exists
    const job = await jobModel.getJobById(jobId);
    if (!job) {
      return response.status(ResponseStatus.NotFound).json({
        success: false,
        message: "Job not found",
      });
    }

    const created = await reportModel.reportJob(worker.id, jobId, reportData);
    response.status(ResponseStatus.Created).json({
      success: true,
      message: "Job report submitted successfully",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

export const hasWorkerReportedJobHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { jobId } = request.params;

    // Get worker profile
    const worker = await workerModel.getWorkerProfileByUserId(userId);
    if (!worker) {
      return response.status(ResponseStatus.NotFound).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    const hasReported = await reportModel.hasWorkerReportedJob(worker.id, jobId);
    response.status(ResponseStatus.OK).json({
      success: true,
      data: hasReported,
    });
  } catch (error) {
    next(error);
  }
};

export const hasWorkerReportedBusinessHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { businessId } = request.params;

    // Get worker profile
    const worker = await workerModel.getWorkerProfileByUserId(userId);
    if (!worker) {
      return response.status(ResponseStatus.NotFound).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    const hasReported = await reportModel.hasWorkerReportedBusiness(worker.id, businessId);
    response.status(ResponseStatus.OK).json({
      success: true,
      data: hasReported,
    });
  } catch (error) {
    next(error);
  }
};

export const hasBusinessReportedWorkerHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { workerId } = request.params;

    // Get business profile
    const business = await businessModel.getBusinessProfileDetailsByUserId(userId);
    if (!business) {
      return response.status(ResponseStatus.NotFound).json({
        success: false,
        message: "Business profile not found",
      });
    }

    const hasReported = await reportModel.hasBusinessReportedWorker(business.id, workerId);
    response.status(ResponseStatus.OK).json({
      success: true,
      data: hasReported,
    });
  } catch (error) {
    next(error);
  }
};
