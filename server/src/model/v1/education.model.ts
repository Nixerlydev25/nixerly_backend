import prisma from "../../config/prisma.config";
import { DatabaseError } from "../../utils/errors";
import { z } from "zod";
import { createEducationSchema } from "../../schema/v1/education.validation";

type CreateEducationInput = z.infer<typeof createEducationSchema>[number];

export const createEducation = async (userId: string, educationData: CreateEducationInput[]) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    return await prisma.education.createMany({
      data: educationData.map(education => ({
        school: education.school,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        startDate: new Date(education.startDate),
        endDate: education.endDate ? new Date(education.endDate) : null,
        description: education.description,
        currentlyStudying: education.currentlyStudying,
        workerId: workerProfile.id,
      })),
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getWorkerEducation = async (workerId: string) => {
  try {
    return await prisma.education.findMany({
      where: { workerId },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const updateEducation = async (userId: string, data: any) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    const education = await prisma.education.findUnique({
      where: { id: data.id },
    });
    if (!education || education.workerId !== workerProfile.id)
      throw new DatabaseError("Education not found");

    return await prisma.education.update({
      where: { id: data.id },
      data: { ...data },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const deleteEducation = async (userId: string, id: string) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    const education = await prisma.education.findUnique({
      where: { id },
    });
    if (!education || education.workerId !== workerProfile.id)
      throw new DatabaseError("Education not found");

    return await prisma.education.delete({
      where: { id },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const updateAllEducations = async (userId: string, educationData: CreateEducationInput[]) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    // Delete all existing education entries for this worker
    await prisma.education.deleteMany({
      where: { workerId: workerProfile.id },
    });

    // Create all new education entries
    return await prisma.education.createMany({
      data: educationData.map(education => ({
        school: education.school,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        startDate: new Date(education.startDate),
        endDate: education.endDate ? new Date(education.endDate) : null,
        description: education.description,
        currentlyStudying: education.currentlyStudying,
        workerId: workerProfile.id,
      })),
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
