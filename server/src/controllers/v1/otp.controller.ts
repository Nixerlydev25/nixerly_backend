import { NextFunction, Request, Response } from "express";
import OtpService from "../../services/email.service";
import * as userModel from "../../model/v1/user.model";
import * as authModel from "../../model/v1/auth.model";
import { ResponseStatus, ResponseMessages } from "../../types/response.enums";

import { verifyOtpSchema, sendOtpSchema, sendOtpwithUserSchema, verifyOtpByEmailSchema } from "../../schema/v1/otp.validation";

import { ValidationError } from "../../utils/errors";

export const verifyOtpHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { otp } = verifyOtpSchema.parse(request.body);

    const isValidOtp = await OtpService.verifyOtpHandler(userId, parseInt(otp));
    
    if (isValidOtp) {
      await userModel.updateUserVerificationStatus(userId, true);
      return response
        .status(ResponseStatus.OK)
        .json({ message: ResponseMessages.Success });
    } else {
      throw new ValidationError("Invalid or expired OTP");
    }
  } catch (error: any) {
    return next(error);
  }
};

export const sendOtpHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId, email } = sendOtpwithUserSchema.parse(request.body);

    await OtpService.sendOtpHandler(userId, email);

    return response
      .status(ResponseStatus.OK)
      .json({ message: ResponseMessages.Success });
  } catch (error: any) {
    return next(error);
  }
};

export const sendOtpByEmailHandler = async (
  request: Request,
  response: Response
) => {
  try {
    const { email } = sendOtpSchema.parse(request.body);

    const user = await authModel.findUserByEmail(email);

    if (!user) {
      return response
        .status(ResponseStatus.NotFound)
        .json({ message: "User not found." });
    }

    const userId = user.id;

    await OtpService.sendOtpHandler(userId, email);

    return response
      .status(ResponseStatus.OK)
      .json({ message: ResponseMessages.Success });
  } catch (error: any) {
    return response
      .status(ResponseStatus.InternalServerError)
      .json({ message: error.message });
  }
};

export const verifyOtpByEmailHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = verifyOtpByEmailSchema.parse(request.body);

    const user = await authModel.findUserByEmail(email);

    if (!user) {
      return response
        .status(ResponseStatus.NotFound)
        .json({ message: "User not found." });
    }

    const userId = user.id;

    const isValidOtp = await OtpService.verifyOtpHandler(userId, parseInt(otp));

    if (isValidOtp) {
      return response
        .status(ResponseStatus.OK)
        .json({ message: ResponseMessages.Success });
    } else {
      throw new ValidationError("Invalid or expired OTP");
    }
  } catch (error: any) {
    return next(error);
  }
};