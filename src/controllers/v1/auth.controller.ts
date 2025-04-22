import { NextFunction, Request, Response } from "express";
import * as authModel from "../../model/v1/auth.model";
import { ResponseMessages, ResponseStatus } from "../../types/response.enums";

import * as bcryptHelper from "../../utils";
import {
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
  updateUserDetailsSchema,
} from "../../schema/v1/auth.validation";
import { z } from "zod";
import { setUserCookies } from "../../utils/auth.utils";
import { signJWT, verifyJWT } from "../../utils/jwt.utils";
// import * as userModel from "../../model/v1/user.model";
import OtpService from "../../services/email.service";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const LOGOUT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? ("none" as const) : ("lax" as const),
  ...(IS_PRODUCTION && { domain: process.env.COOKIE_CLIENT }),
};

export const signupHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = signUpSchema.parse(request.body);

    const existingUser = await authModel.findUserByEmail(email);

    if (existingUser) {
      return response
        .status(ResponseStatus.BadRequest)
        .json({ message: ResponseMessages.UserAlreadyExists });
    }

    const newUser = await authModel.createUser({
      email,
      password,
      name,
    });

    const isMobileClient = request.headers["x-client"] === "mobile";

    const { accessToken, refreshToken } = setUserCookies(
      response,
      newUser,
      isMobileClient
    );

    if (isMobileClient) {
      return response.status(ResponseStatus.Created).json({
        message: ResponseMessages.Success,
        accessToken,
        refreshToken,
        role: newUser.role,
        userId: newUser.id,
        firstTimeLogin: newUser.firstTimeLogin,
        restrictions: newUser.restrictions.map(
          (restriction) => restriction.restrictionType
        ),
        isVerified: newUser.isVerified,
        name: newUser.name,
      });
    }

    return response.status(ResponseStatus.Created).json({
      message: ResponseMessages.Success,
    });
  } catch (error: any) {
    next(error);
  }
};

export const signinHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = loginSchema.parse(request.body);

    const user = await authModel.findUserByEmail(email);

    if (!user || !bcryptHelper.comparePassword(password, user.password)) {
      return response
        .status(ResponseStatus.Unauthorized)
        .send({ message: "Invalid Credentials" });
    }

    if (user.isDeleted) {
      return response.status(ResponseStatus.Unauthorized).send({
        message: "Your Account has been deleted.",
      });
    }

    if (user.isSuspended) {
      return response.status(ResponseStatus.Unauthorized).send({
        message:
          "Your Account is Temporarily Suspended, Contact Customer support for further assistance.",
      });
    }

    if (
      !user.isTemporaryPasswordReset &&
      (user.role == "ADMIN" || user.role == "DEVELOPER")
    ) {
      return response.status(ResponseStatus.Unauthorized).send({
        message: "Please reset your temporary password.",
        data: user,
      });
    }

    const isMobileClient = request.headers["x-client"] === "mobile";

    const { accessToken, refreshToken } = setUserCookies(
      response,
      user,
      isMobileClient
    );

    if (isMobileClient) {
      return response.status(ResponseStatus.OK).json({
        userId: user.id,
        message: ResponseMessages.Success,
        accessToken,
        refreshToken,
        isVerified: user ? user.isVerified : false,
        role: user.role,
        isTemporaryPasswordReset: user.isTemporaryPasswordReset,
        firstTimeLogin: user.firstTimeLogin,
        restrictions: user.restrictions.map(
          (restriction) => restriction.restrictionType
        ),
        name: user.name,
      });
    }

    return response.status(ResponseStatus.OK).json({
      message: ResponseMessages.Success,
    });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const passwordRecoveryHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = loginSchema.parse(request.body);
    const user = await authModel.findUserByEmail(email);

    if (!user) {
      return response
        .status(ResponseStatus.NotFound)
        .json({ message: ResponseMessages.UserNotFound });
    }

    const isPasswordCorrect = bcryptHelper.comparePassword(
      password,
      user.password
    );

    if (isPasswordCorrect) {
      return response.status(ResponseStatus.BadRequest).json({
        message: "New password cannot be the same as the old password",
      });
    }

    await authModel.updatePassword(user.id, password);

    return response
      .status(ResponseStatus.OK)
      .json({ message: ResponseMessages.Success });
  } catch (error: any) {
    next(error);
  }
};

export async function logoutHandler(
  _: Request,
  response: Response,
  next: NextFunction
) {
  try {
    console.log("logoutHandler");
    response.clearCookie("access_token", LOGOUT_COOKIE_OPTIONS);
    response.clearCookie("refresh_token", LOGOUT_COOKIE_OPTIONS);
    console.log("logoutHandler 2");
    // log cookies
    console.log("cookies", response.getHeaders());
    return response
      .status(ResponseStatus.OK)
      .json({ message: ResponseMessages.Success });
  } catch (error: any) {
    next(error);
  }
}

export const refreshAccessToken = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = request.headers["x-refresh-token"] as string;

    if (!refreshToken) {
      return response
        .status(ResponseStatus.Unauthorized)
        .json({ message: ResponseMessages.Unauthorized });
    }

    const { payload } = verifyJWT(refreshToken);

    if (!payload) {
      return response
        .status(ResponseStatus.Unauthorized)
        .json({ message: "Invalid refresh token" });
    }

    const newAccessToken = signJWT(
      {
        email: payload.email,
        userId: payload.userId,
        oAuthAccessToken: payload.oAuthAccessToken,
        role: payload.role,
      },
      "12h" // expires in 12 hour
    );
    console.log("return access toekn");
    return response.status(ResponseStatus.OK).json({
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    next(error);
  }
};

export const resetPasswordHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { otp, email, password } = resetPasswordSchema.parse(request.body);

    const user = await authModel.findUserByEmail(email);
    if (!user) {
      return response
        .status(ResponseStatus.NotFound)
        .json({ message: ResponseMessages.UserNotFound });
    }

    const isValidOtp = await OtpService.verifyOtpHandler(
      user.id,
      parseInt(otp)
    );

    if (!isValidOtp) {
      return response
        .status(ResponseStatus.BadRequest)
        .json({ message: "Invalid or expired OTP" });
    }

    await authModel.updatePassword(user.id, password);

    return response
      .status(ResponseStatus.OK)
      .json({ message: ResponseMessages.Success });
  } catch (error: any) {
    next(error);
  }
};

export const isAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    if (!request.user) {
      return response.status(ResponseStatus.NotAcceptable).json({
        message: "logout request",
      });
    }

    const user = await authModel.fetchUserVerifiedStatus(request.user.userId);

    const userStatus = {
      isVerified: user ? user.isVerified : false,
      user,
    };

    response.status(ResponseStatus.OK).json(userStatus);
  } catch (error: any) {
    next(error);
  }
};

export const deleteMyAccount = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId, email } = request.user;

    const userData = await authModel.findUserByEmail(email);

    if (!userData) {
      return response
        .status(ResponseStatus.NotFound)
        .json({ message: ResponseMessages.UserNotFound });
    }

    const deleteUser = await authModel.deleteUser(userId);

    return response
      .status(ResponseStatus.OK)
      .json({ message: ResponseMessages.Success, data: deleteUser });
  } catch (error: any) {
    next(error);
  }
};
