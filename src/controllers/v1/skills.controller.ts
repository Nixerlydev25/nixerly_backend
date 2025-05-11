import { Request, Response, NextFunction } from "express";
import { ResponseStatus } from "../../types/response.enums";
import * as skillModel from "../../model/v1/skills.model";

export const createWorkerSkillsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { skills } = request.body;

    const createdSkills = await skillModel.createSkills(userId, skills);
    response.status(ResponseStatus.Created).json({
      success: true,
      message: "Skills created successfully",
      data: createdSkills,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerSkillsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = request.params;
    const skills = await skillModel.getWorkerSkills(workerId);
    response.status(ResponseStatus.OK).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkerSkillsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { skills } = request.body;

    const updatedSkills = await skillModel.updateSkills(userId, skills);
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Skills updated successfully",
      data: updatedSkills,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkerSkillsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { skills } = request.body;

    await skillModel.deleteSkills(userId, skills);
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Skills deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};