import { NextFunction, Request, Response } from "express";
import { ResponseStatus } from "../../types/response.enums";
import * as businessModel from "../../model/v1/business.model";


export const updateBusinessProfileHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { ...businessProfile } = request.body;

    const updatedUser = await businessModel.updateBusinessProfile(
      userId,
      businessProfile
    );

    return response.status(ResponseStatus.OK).json(updatedUser);
  } catch (error: any) {
    next(error);
  }
};
