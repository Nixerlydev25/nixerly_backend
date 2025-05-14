import prisma from "../../config/prisma.config";
import { DatabaseError } from "../../utils/errors";
import { z } from "zod";
import { createExperienceSchema } from "../../schema/v1/experience.validation";

type CreateExperienceInput = z.infer<typeof createExperienceSchema>[number];
type UpdateExperienceInput = {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
};

export const createExperience = async (userId: string, experiences: CreateExperienceInput[]) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    return await prisma.experience.createMany({
      data: experiences.map((experience) => ({
        startDate: new Date(experience.startDate),
        endDate: experience.endDate ? new Date(experience.endDate) : null,
        country: experience.country,
        city: experience.city,
        state: experience.state,
        title: experience.title,
        company: experience.company,
        description: experience.description,
        currentlyWorking: experience.current,
        workerId: workerProfile.id,
      })),
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

export const updateExperience = async (userId: string, data: UpdateExperienceInput) => {
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
      throw new DatabaseError("Experience not found");

    return await prisma.experience.delete({
      where: { id },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};
