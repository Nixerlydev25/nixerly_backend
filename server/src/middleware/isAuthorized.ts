import { Request, Response, NextFunction } from "express";
import { ResponseMessages, ResponseStatus } from "../types/response.enums";
import * as restrictionModel from "../model/v1/restrictions.model";
import { RestrictionType, Role, UserRestriction } from "@prisma/client";

const isAuthorized = (
  requiredRoles?: Role[],
  restrictedTo?: RestrictionType[]
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !request.user.email) {
      return response.status(ResponseStatus.Unauthorized).json({
        message: "Invalid session",
      });
    }

    if (!hasRequiredRole(request.user.role, requiredRoles)) {
      return response.status(ResponseStatus.Forbidden).json({
        message: ResponseMessages.Forbidden,
      });
    }

    try {
      if (await hasAnyRestriction(request.user.userId, restrictedTo)) {
        return response
          .status(ResponseStatus.Forbidden)
          .send({ message: ResponseMessages.Forbidden });
      }
    } catch (error: any) {
      return response.status(ResponseStatus.InternalServerError).json({
        message: "Failed to check restrictions",
      });
    }

    next();
  };
};

export default isAuthorized;

const hasRequiredRole = (userRole: Role, requiredRoles?: Role[]): boolean => {
  return requiredRoles
    ? requiredRoles.some((role) => userRole.includes(role))
    : true;
};

const hasAnyRestriction = async (
  userId: string,
  restrictedTo?: RestrictionType[]
): Promise<boolean> => {
  if (!restrictedTo) return false;

  const userRestrictions = await restrictionModel.getUserRestrictions(userId);
  return userRestrictions.some((restriction: UserRestriction) =>
    restrictedTo.includes(restriction.restrictionType)
  );
};