import { Roles } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { DatabaseError } from "../../utils/errors";

export const updateUserRole = async (id: string, role: Roles) => {
  try {
    const updatedUser = await prisma.users.update({
      where: { id },
      data: { role },
    });
    return updatedUser;
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
