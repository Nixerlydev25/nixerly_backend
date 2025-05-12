import prisma from "../../config/prisma.config";
import { DatabaseError } from "../../utils/errors";

export const createExperience = async (userId: string, data: any) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    return await prisma.experience.create({
      data: {
        ...data,
        workerId: workerProfile.id,
      },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getWorkerExperiences = async (workerId: string) => {
  try {
    return await prisma.experience.findMany({
      where: { workerId },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const updateExperience = async (userId: string, data: any) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    const experience = await prisma.experience.findUnique({
      where: { id: data.id },
    });
    if (!experience || experience.workerId !== workerProfile.id)
      throw new DatabaseError("Experience not found");

    return await prisma.experience.update({
      where: { id: data.id },
      data: { ...data },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const deleteExperience = async (userId: string, id: string) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    const experience = await prisma.experience.findUnique({
      where: { id },
    });
    if (!experience || experience.workerId !== workerProfile.id)
      throw new DatabaseError("Exerience not found");

    return await prisma.experience.delete({
      where: { id },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
