import prisma from "../../../config/prisma.config";
import {
  OAuthProvider,
  User,
  Role,
} from "@prisma/client";

interface UserWithRestrictions extends User {
  restrictions: { restrictionType: string }[];
}

export async function findOrCreateUser(
  email: string,
  provider: OAuthProvider,
  name?: string
): Promise<UserWithRestrictions> {
  try {
    const user = await prisma.user.findFirst({
      where: { email, provider },
      include: {
        restrictions: {
          select: {
            restrictionType: true,
          },
        },
      },
    });

    if (user) {
      return user as UserWithRestrictions;
    }

    const newUser = await prisma.user.create({
      data: {
        firstName: name || "",
        lastName: "",
        email,
        password: "OAUTH_NO_PASSWORD",
        isVerified: true,
        isDeleted: false,
        isSuspended: false,
        role: Role.WORKER,
        provider,
        defaultProfile: "WORKER", // adjust to your enum or value
        firstTimeLogin: true,
        restrictions: {
          create: [],
        },
      },
      include: {
        restrictions: {
          select: {
            restrictionType: true,
          },
        },
      },
    });

    return newUser as UserWithRestrictions;
  } catch (error) {
    console.error("Error in findOrCreateUser:", error);
    throw error;
  }
}