import { OAuthProvider, Role, ProfileType } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { generateUserName, hashPassword } from "../../utils";
import { DatabaseError, ValidationError } from "../../utils/errors";

interface LoginUser {
  email: string;
  password: string;
}

interface CreateUser extends LoginUser {
  password: string;
  name: string;
  email: string;
  profileType: ProfileType;
}

export const findUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      include: {
      restrictions:{
          select: {
            restrictionType: true,
        }
      }
      }
    });
    return user;
  } catch (err: any) {
    throw err;
  }
};

export const createUser = async (data: CreateUser) => {
  try {
    const { name, email, password } = data;

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword(password),
        provider: OAuthProvider.EMAIL_PASSWORD,
        isSuspended: false,
        role : data.profileType === ProfileType.WORKER ? Role.WORKER : Role.BUSINESS,
        defaultProfile: data.profileType,
        workerProfile : {
          create: {}
        },
        businessProfile : {
          create: {}
        }
      },
      include: {
        restrictions: true,
      },
    });

    return newUser;
  } catch (err: any) {
    throw err;
  }
};

export const updatePassword = async (userId: string, newPassword: string) => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashPassword(newPassword),
      },
    });
  } catch (err: any) {
    throw err;
  }
};

export const fetchUserVerifiedStatus = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isVerified: true,
        name: true,
      },
    });
    return user;
  } catch (err: any) {
    throw err;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId,isDeleted:false },
    });

    if (!user) {
      throw new ValidationError("User Does Not Exist");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    });

    if (!updatedUser) {
      throw new DatabaseError("Failed to delete account!");
    }

    return updatedUser;
  } catch (error: any) {
    throw error;
  }
};