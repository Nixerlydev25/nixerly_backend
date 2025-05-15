import { Request, Response, NextFunction } from "express";
import { ResponseStatus } from "../../types/response.enums";
import * as educationModel from "../../model/v1/education.model";

export const createEducationHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const educationData = request.body;
    const created = await educationModel.createEducation(userId, educationData);
    response.status(ResponseStatus.Created).json({
      success: true,
      message: "Education created successfully",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerEducationHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = request.params;
    const education = await educationModel.getWorkerEducation(workerId);
    response.status(ResponseStatus.OK).json({
      success: true,
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEducationHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const data = request.body;
    const updated = await educationModel.updateEducation(userId, data);
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Education updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEducationHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { id } = request.body;
    await educationModel.deleteEducation(userId, id);
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateAllEducationsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const educationData = request.body;
    const updated = await educationModel.updateAllEducations(userId, educationData);
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "All education entries updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
