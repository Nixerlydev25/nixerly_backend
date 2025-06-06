import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ProfileType, Role } from "@prisma/client";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "secret_key_here";

interface JWTPayload {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  defaultProfile: ProfileType;
  role: Role;
}

export const signJWT = (payload: JWTPayload, expiresIn: string ): string => {
    // @ts-ignore
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

export const verifyJWT = (token: string): { payload: JWTPayload | null; expired: boolean } => {
  try {
    const payload = jwt.verify(token, SECRET_KEY) as JWTPayload;
    
    return { payload, expired: false };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { payload: null, expired: true };
    } else {
      return { payload: null, expired: false };
    }
  }
};
