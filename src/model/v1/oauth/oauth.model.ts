import prisma from "../../../config/prisma.config";
import { OAuthProvider, Roles, Users, UserRestrictions } from "@prisma/client";

interface UserWithRestrictions extends Users {
  restrictions: UserRestrictions[];
}

export async function findOrCreateUser(
  email: string,
  provider: OAuthProvider,
  name?: string
): Promise<UserWithRestrictions> {
  try {
    let user = await prisma.users.findFirst({
      where: { email, provider },
      include: {
        restrictions: {
          select: {
            restrictionType: true,
          },
        },
      },
    });

    if (!user) {
      user = await prisma.users.create({
        data: {
          name: name || "",
          email,
          password: "OAUTH_NO_PASSWORD",
          isSuspended: false,
          role: Roles.USER,
          provider: provider,
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
    }

    return user as UserWithRestrictions;
  } catch (error: unknown) {
    console.error("Error in findOrCreateUser:", error);
    throw error;
  }
}
