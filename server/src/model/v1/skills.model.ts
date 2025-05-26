import { SkillName } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { DatabaseError } from "../../utils/errors";

export const createSkills = async (userId: string, skills: SkillName[]) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    return await prisma.workerSkill.createMany({
      data: skills.map(skillName => ({
        skillName,
        workerId: workerProfile.id,
      })),
      skipDuplicates: true,
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const getWorkerSkills = async (workerId: string) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { id: workerId },
      select: { id: true },
    });

    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    return await prisma.workerSkill.findMany({
      where: { workerId: workerProfile.id },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const updateSkills = async (userId: string, skills: SkillName[]) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    // Perform operations in a transaction
    return await prisma.$transaction(async (tx) => {
      // Delete all existing skills
      await tx.workerSkill.deleteMany({
        where: {
          workerId: workerProfile.id,
        },
      });

      // Add new skills
      await tx.workerSkill.createMany({
        data: skills.map(skillName => ({
          skillName,
          workerId: workerProfile.id,
        })),
      });

      // Return updated skills
      return await tx.workerSkill.findMany({
        where: { workerId: workerProfile.id },
      });
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const deleteSkills = async (userId: string, skills: SkillName[]) => {
  try {
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) throw new DatabaseError("Worker profile not found");

    return await prisma.workerSkill.deleteMany({
      where: {
        workerId: workerProfile.id,
        skillName: { in: skills },
      },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};