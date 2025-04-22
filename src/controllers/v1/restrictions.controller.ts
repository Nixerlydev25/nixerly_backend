import { NextFunction, Request, Response } from "express";
import * as restrictionModel from "../../model/v1/restrictions.model";
import { ResponseStatus } from "../../types/response.enums";
import {
  createRestrictionSchema,
  getRestrictionSchema,
  removeRestrictionSchema,
} from "../../schema/v1/restriction.validation";
import { validateRoleHierarchy } from "../../utils";
import { ValidationError } from "../../utils/errors";

export const addRestriction = async (request: Request, response: Response,
  next: NextFunction) => {
  try {
    const { userId, restrictionType } = createRestrictionSchema.parse(
      request.body
    );

    const requesterRole = request.user.role;
    
    // TODO : need to handle error handling globally.
    const canModify = await validateRoleHierarchy(requesterRole, userId)
    if (!canModify) {
      throw new ValidationError("You do not have permission to modify this user", 403);
    }

    const restriction = await restrictionModel.addRestriction(userId, restrictionType);

    response
      .status(ResponseStatus.Created)
      .json({ message: "Restriction added successfully", restriction });
  } catch (error: any) {
    return next(error);
  }
};

export const getAllRestrictions = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const restrictions = await restrictionModel.getAllRestrictions();
    response
      .status(ResponseStatus.OK)
      .json({ message: "Restrictions fetched successfully", restrictions });
  } catch (error: any) {
    return next(error);
  }
};

export const getUserRestrictions = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getRestrictionSchema.parse(request.params);
    const restrictions = await restrictionModel.getUserRestrictions(userId);
    response.status(ResponseStatus.OK).json({
      message: "User restrictions fetched successfully",
      restrictions,
    });
  } catch (error: any) {
    return next(error);
  }
};

export const removeRestriction = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId, restrictionType } = removeRestrictionSchema.parse(
      request.body
    );
    
    const requesterRole = request.user.role;

    const canModify = await validateRoleHierarchy(requesterRole, userId)
    if (!canModify) {
    throw new ValidationError("You do not have permission to modify this user", 403);
    }

    const restriction = await restrictionModel.removeRestriction(
      userId,
      restrictionType
    );

    response
      .status(ResponseStatus.Created)
      .json({ message: "Restriction removed successfully", restriction });
  } catch (error: any) {
    return next(error);
  }
};