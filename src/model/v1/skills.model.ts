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

    // Get current skills
    const currentSkills = await prisma.workerSkill.findMany({
      where: { workerId: workerProfile.id },
      select: { skillName: true },
    });

    const currentSkillNames = currentSkills.map(s => s.skillName);
    
    // Skills to add (not in current skills)
    const skillsToAdd = skills.filter(skill => !currentSkillNames.includes(skill));
    
    // Skills to remove (in current skills but not in new skills)
    const skillsToRemove = currentSkillNames.filter(skill => !skills.includes(skill));

    // Perform operations in a transaction
    return await prisma.$transaction(async (tx) => {
      // Add new skills
      if (skillsToAdd.length > 0) {
        await tx.workerSkill.createMany({
          data: skillsToAdd.map(skillName => ({
            skillName,
            workerId: workerProfile.id,
          })),
          skipDuplicates: true,
        });
      }

      // Remove skills that are no longer needed
      if (skillsToRemove.length > 0) {
        await tx.workerSkill.deleteMany({
          where: {
            workerId: workerProfile.id,
            skillName: { in: skillsToRemove },
          },
        });
      }

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