import { Restrictions } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { ResponseStatus } from "../../types/response.enums";
import { DatabaseError, ValidationError } from "../../utils/errors";

export const addRestriction = async (
  userId: string,
  restrictionType: Restrictions
) => {
  const existingRestriction = await prisma.userRestrictions.findFirst({
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

  const restriction = await prisma.userRestrictions.create({
    data: {
      userId,
      restrictionType,
    },
  });

  return restriction;
};

export const getAllRestrictions = async () => {
  try {
    const restrictions = await prisma.userRestrictions.findMany();
    return restrictions;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getUserRestrictions = async (userId: string) => {
  try {
    const restrictions = await prisma.userRestrictions.findMany({
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
  restrictionType: Restrictions
) => {
  try {
    const restriction = await prisma.userRestrictions.deleteMany({
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
