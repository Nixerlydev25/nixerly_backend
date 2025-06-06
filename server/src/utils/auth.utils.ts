import { User } from "@prisma/client";
import { Response } from "express";
import { signJWT } from "./jwt.utils";
import { environment } from "../types/global";

const ACCESS_TOKEN_MAX_AGE = 3600000 * 24; // 24 hours in milliseconds
const REFRESH_TOKEN_MAX_AGE = 3.154e10; // 1 year in milliseconds
const IS_PRODUCTION = process.env.NODE_ENV === environment.PRODUCTION;

export function setUserCookies(
  response: Response,
  user: User,
  isMobileClient: boolean,
) {
  
  const accessToken = signJWT(
    {
      email: user.email,
      userId: `${user.id}`,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      defaultProfile : user.defaultProfile,
    },
    "12h",
  );

  const refreshToken = signJWT(
    {
      email: user.email,
      userId: `${user.id}`,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      defaultProfile : user.defaultProfile,
    },
    "1y",
  );

  if (!isMobileClient) {
    response.cookie("access_token", accessToken, {
      maxAge: ACCESS_TOKEN_MAX_AGE,
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: IS_PRODUCTION ? "none" : "lax",
      ...(IS_PRODUCTION && { domain: process.env.COOKIE_CLIENT }),
    });

    response.cookie("refresh_token", refreshToken, {
      maxAge: REFRESH_TOKEN_MAX_AGE,
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: IS_PRODUCTION ? "none" : "lax",
      ...(IS_PRODUCTION && { domain: process.env.COOKIE_CLIENT }),
    });
  }

  return { accessToken, refreshToken };
}
