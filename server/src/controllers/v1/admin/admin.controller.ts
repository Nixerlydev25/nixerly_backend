import { Request, Response, NextFunction } from "express";
import { ResponseStatus } from "../../../types/response.enums";
import * as adminModel from "../../../model/v1/admin/admin.model";

export const toggleWorkerBlockStatus = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = request.params;
    const updatedWorker = await adminModel.toggleWorkerBlockStatus(workerId);
    
    response.status(ResponseStatus.OK).json({
      success: true,
      message: `Worker ${updatedWorker.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: updatedWorker,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBusinessBlockStatus = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { businessId } = request.params;
    const updatedBusiness = await adminModel.toggleBusinessBlockStatus(businessId);
    
    response.status(ResponseStatus.OK).json({
      success: true,
      message: `Business ${updatedBusiness.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: updatedBusiness,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleJobBlockStatus = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { jobId } = request.params;
    const updatedJob = await adminModel.toggleJobBlockStatus(jobId);
    
    response.status(ResponseStatus.OK).json({
      success: true,
      message: `Job ${updatedJob.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
}; 