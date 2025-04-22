import { v4 as uuidv4 } from 'uuid';
import prisma from '../../config/prisma.config'
import { DatabaseError } from '../../utils/errors';

export const expireExistingOtps = async (userId: string): Promise<void> => {
  try {
    await prisma.otp.updateMany({
      where: { userId, isExpired: false },
      data: { isExpired: true },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const createOtp = async (otp: number, userId: string): Promise<void> => {
  try {
    await prisma.otp.create({
      data: {
        id: uuidv4(),
        otp,
        userId,
      },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }

};

export const findValidOtp = async (userId: string, otp: number): Promise<any> => {
  try {
    return prisma.otp.findFirst({
      where: {
        userId,
        otp,
        isExpired: false,
        created_at: {
          gte: new Date(Date.now() - 10 * 60 * 1000),
        },
      },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }

};

export const expireOtpById = async (id: string): Promise<void> => {
  try {
    await prisma.otp.update({
      where: { id },
      data: { isExpired: true },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }

};

export const findValidOtpByEmail = async (email: string, otp: number) => {
  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return null;

    return await prisma.otp.findFirst({
      where: { userId: user.id, otp, isExpired: false },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};