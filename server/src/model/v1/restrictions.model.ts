import { RestrictionType } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { ResponseStatus } from "../../types/response.enums";
import { DatabaseError, ValidationError } from "../../utils/errors";

export const addRestriction = async (
  userId: string,
  restrictionType: RestrictionType
) => {
  const existingRestriction = await prisma.userRestriction.findFirst({
    where: {
      userId,
      restrictionType,
    },
  });

  if (existingRestriction) {
    throw new ValidationError(
      `Restriction of type '${restrictionType}' already exists for this user.`,
      ResponseStatus.Conflict
    );
  }

  const restriction = await prisma.userRestriction.create({
    data: {
      userId,
      restrictionType,
    },
  });

  return restriction;
};

export const getAllRestrictions = async () => {
  try {
    const restrictions = await prisma.userRestriction.findMany();
    return restrictions;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getUserRestrictions = async (userId: string) => {
  try {
    const restrictions = await prisma.userRestriction.findMany({
      where: {
        userId,
      },
    });
    return restrictions;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const removeRestriction = async (
  userId: string,
  restrictionType: RestrictionType
) => {
  try {
    const restriction = await prisma.userRestriction.deleteMany({
      where: {
        userId,
        restrictionType,
      },
    });
    return restriction;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
