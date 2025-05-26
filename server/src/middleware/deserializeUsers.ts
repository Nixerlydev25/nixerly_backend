import "express";
import { NextFunction, Request, Response } from "express";
import { signJWT, verifyJWT } from "../utils/jwt.utils";
import { environment } from "../types/global";
import { ProfileType, Role } from "@prisma/client";
import { ResponseStatus } from "../types/response.enums";

interface JWTPayload {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  defaultProfile: ProfileType;
  role: Role;
}

declare module "express-serve-static-core" {
  interface Request {
    user: JWTPayload;
  }
}

const ACCESS_TOKEN_MAX_AGE = 3600000 * 12; // 12 hours in milliseconds
const IS_PRODUCTION = process.env.NODE_ENV === environment.PRODUCTION;

async function deserializeUser(
  request: Request,
  response: Response,
  next: NextFunction
) {

  console.log("DESERIALIZE-USER");
  let accessToken = null;
  let refreshToken = null;
  const isMobileClient = request.headers["x-client"] === "mobile";
  console.log({isMobileClient})
  if (isMobileClient) {
    accessToken = request.headers["x-client-access"] as string;
    refreshToken = request.headers["x-client-refresh"] as string;
  } else {
    accessToken = request.cookies["access_token"];
    refreshToken = request.cookies["refresh_token"];
  }

  console.log({ accessToken, refreshToken });

  if (!accessToken) {
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);
  console.log({payload, expired})
  // If the access token is valid, set the user and proceed
  if (payload) {
    request.user = payload as JWTPayload;
    return next();
  }

  // If no refresh token is provided, handle based on the platform
  if (!refreshToken) {
    if (isMobileClient && expired) {
      return response.status(ResponseStatus.Unauthorized).json({
        message: "Access token expired",
      });
    }
    return next();
  }

  // If the access token is expired
  if (expired) {
    if (isMobileClient) {
      console.log("// Mobile clients should receive a 401 Unauthorized response")
      return response.status(ResponseStatus.Unauthorized).json({
        message: "Access token expired",
      });
    } else {
      const refreshResult = verifyJWT(refreshToken);
      const refreshPayload = refreshResult.payload as JWTPayload | null;

      if (!refreshPayload) {
        return next();
      }

      request.user = refreshPayload as JWTPayload;

      const newAccessToken = await revalidatedAccessToken(
        refreshPayload.userId,
        request,
        response
      );

      if (newAccessToken) {
        request.user = newAccessToken;
      }

      return next();
    }
  }

  return next();
}

async function revalidatedAccessToken(
  userId: string,
  request: Request,
  response: Response
): Promise<JWTPayload | null> {
  console.log("REVALIDATEING-SESSION");

  const newAccessToken = signJWT(
    {
      email: request.user.email,
      userId: userId,
      role: request.user.role,
      defaultProfile: request.user.defaultProfile,
      firstName: request.user.firstName,
      lastName: request.user.lastName,
    },
    "12h"
  );

  response.cookie("access_token", newAccessToken, {
    maxAge: ACCESS_TOKEN_MAX_AGE,
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "none" : "lax",
    ...(IS_PRODUCTION && { domain: process.env.COOKIE_CLIENT }),
  });

  const newPayload = verifyJWT(newAccessToken).payload as JWTPayload;

  return newPayload;
}

export default deserializeUser;
