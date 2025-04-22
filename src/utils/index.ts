import bcrypt from "bcrypt";
import { Roles } from "@prisma/client";
import { getUserRole } from "../model/v1/user.model";

const roleHierarchy = {
  [Roles.SUPER_ADMIN]: 5,
  [Roles.ADMIN]: 4,
  [Roles.DEVELOPER]: 4,
  [Roles.ANALYST]: 3,
  [Roles.MODERATOR]: 3,
  [Roles.USER]: 2,
  [Roles.GUEST]: 1,
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

export const validateRoleHierarchy = async (requesterRole: Roles, targetUserId: string): Promise<boolean> => {
  try {
    const targetUser = await getUserRole(targetUserId);

    if (!requesterRole || !targetUser) {
      return false;
    }

    if (!(requesterRole in roleHierarchy) || !(targetUser.role in roleHierarchy)) {
      return false;
    }

    return roleHierarchy[requesterRole as keyof typeof roleHierarchy] >= roleHierarchy[targetUser.role as keyof typeof roleHierarchy];
  } catch (error) {
    throw new Error("Error checking user roles");
  }
};
