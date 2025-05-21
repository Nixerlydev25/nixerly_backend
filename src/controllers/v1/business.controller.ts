import { NextFunction, Request, Response } from "express";
import { ResponseStatus } from "../../types/response.enums";
import * as businessModel from "../../model/v1/business.model";
import { NotFoundError } from "../../utils/errors";


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

export const getBusinessProfileDetailsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { businessId} = request.params;
    console.log({businessId})
    const userDetails = await businessModel.getBusinessProfileDetails(businessId);

    if (!userDetails) {
      throw new NotFoundError("Business profile not found");
    }

    return response.status(ResponseStatus.OK).json(userDetails);
  } catch (error: any) {
    return next(error);
  }
};
