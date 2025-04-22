import { Request, Response, NextFunction } from "express";
import * as userModel from "../../model/v1/user.model";
import { ResponseMessages, ResponseStatus } from "../../types/response.enums";
import { NotFoundError, ValidationError } from "../../utils/errors";
import OtpService from "../../services/email.service";
import * as forgetPasswordSchema from "../../schema/v1/user.valdiation";
import { updateUserDetailsSchema } from "../../schema/v1/auth.validation";

export const getCurrentUserDetails = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request?.user?.userId;

    if (!userId) {
      throw new NotFoundError("User not authenticated");
    }

    const currentUser = await userModel.getCurrentUserDetails(userId);

    if (!currentUser) {
      throw new NotFoundError("User not found");
    }

    response
      .status(ResponseStatus.OK)
      .json({ ...currentUser });
  } catch (error: any) {
    return next(error);
  }
};

export const toggleFirstTimeLogin = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    console.log("called");
    const { userId } = request.user;

    const updatedUser = await userModel.toggleFirstTimeLogin(userId);
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    response
      .status(ResponseStatus.OK)
      .json({ message: ResponseMessages.Success, user: updatedUser });
  } catch (error: any) {
    return next(error);
  }
};

export const deleteUserAccount = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;

    const updatedUser = await userModel.markUserAsDeleted(userId);
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    response.status(ResponseStatus.OK).json({
      message: ResponseMessages.Success,
      user: updatedUser,
    });
  } catch (error: any) {
    return next(error);
  }
};

// PASSWORD RECOVERY.
export const forgotPasswordHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email } = forgetPasswordSchema.forgotPassword.parse(request.body);

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      throw new ValidationError("User with this email does not exist");
    }

    await OtpService.sendOtpHandler(user.id, email);

    response.status(ResponseStatus.OK).json({
      message: ResponseMessages.Success,
      data: {
        email: user.email,
      },
    });
  } catch (error: any) {
    return next(error);
  }
};

export const verifyOtpHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = forgetPasswordSchema.verifyOtp.parse(request.body);
    console.log(email, otp);

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      throw new NotFoundError("User with this email does not exist");
    }

    const isValidOtp = await OtpService.verifyOtpByEmailHandler(
      email,
      parseInt(otp)
    );

    if (isValidOtp) {
      response.status(ResponseStatus.OK).json({
        message: ResponseMessages.Success,
      });
    } else {
      throw new ValidationError("Invalid or expired OTP");
    }
  } catch (error: any) {
    return next(error);
  }
};

export const resetPasswordHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    console.log(request.body);
    const { email, newPassword } = forgetPasswordSchema.resetPassword.parse(
      request.body
    );

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      throw new NotFoundError("User with this email does not exist");
    }

    const updatedUser = await userModel.resetPassword(user.id, newPassword);

    response.status(ResponseStatus.OK).json({
      message: ResponseMessages.Success,
    });
  } catch (error: any) {
    return next(error);
  }
};

export const updateUserDetailsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const {
      organization,
      profession,
      howDidYouHearAboutUs,
      schoolName,
      yearsOfExperience,
      subjectsTaught,
      gradeLevel,
      educationalQualification,
      teacherLicenseNumber,
    } = updateUserDetailsSchema.parse(request.body);

    const updatedUser = await userModel.updateUserDetails(userId, {
      organization,
      profession,
      howDidYouHearAboutUs,
      schoolName,
      yearsOfExperience,
      subjectsTaught,
      gradeLevel,
      educationalQualification,
      teacherLicenseNumber,
    });

    return response.status(ResponseStatus.OK).json({
      // message: ResponseMessages.Success,
      ...updatedUser,
    });
  } catch (error: any) {
   next(error)
  }
};
