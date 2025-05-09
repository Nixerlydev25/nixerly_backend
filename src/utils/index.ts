import bcrypt from "bcrypt";
import { getUserRole } from "../model/v1/user.model";
import { Role } from "@prisma/client";

const roleHierarchy = {
  [Role.SUPER_ADMIN]: 5,
  [Role.ADMIN]: 4,
  [Role.DEVELOPER]: 4,
  [Role.WORKER]: 3,
  [Role.BUSINESS]: 2,
};

export const generateUserName = (): string => {
  const randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000);
  return `user${randomFourDigitNumber}`;
};

export const hashPassword = (password: string): string => {
  const saltRounds = parseInt(process.env.SALT!);
  return bcrypt.hashSync(password, saltRounds);
};

export function comparePassword(password: string, hashedPassword: string) {
  try {
    const result = bcrypt.compareSync(password, hashedPassword);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Comparison failed");
  }
}

export const validateRoleHierarchy = async (requesterRole: Role, targetUserId: string): Promise<boolean> => {
  try {
    const targetUser = await getUserRole(targetUserId);

    if (!requesterRole || !targetUser) {
      return false;
    }

    if (!(requesterRole in roleHierarchy) || !(targetUser.role in roleHierarchy)) {
      return false;
    }

    const requesterRoleValue = roleHierarchy[requesterRole];
    const targetUserRoleValue = roleHierarchy[targetUser.role];

    return requesterRoleValue >= targetUserRoleValue;
    
  } catch (error) {
    throw new Error("Error checking user roles");
  }
};
