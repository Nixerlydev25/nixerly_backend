import { Request, Response, NextFunction } from "express";
import { ResponseStatus } from "../../types/response.enums";
import * as ExperienceModel from "../../model/v1/experience.model";

export const createExperienceHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const data = request.body;
    const created = await ExperienceModel.createExperience(userId, data);
    response.status(ResponseStatus.Created).json({
      success: true,
      message: "experience created successfully",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerExperiencesHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = request.params;
    const experiences = await ExperienceModel.getWorkerExperiences(workerId);
    response.status(ResponseStatus.OK).json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExperienceHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const data = request.body;
    const updated = await ExperienceModel.updateExperience(userId, data);
    response.status(ResponseStatus.OK).json({
      success: true,
    message: "experience updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExperienceHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { id } = request.body;
    await ExperienceModel.deleteExperience(userId, id);
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "experience deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
