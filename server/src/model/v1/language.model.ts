import { Language, Proficiency } from "@prisma/client";
import prisma from "../../config/prisma.config";
import { DatabaseError } from "../../utils/errors";

export const createUserLanguages = async (
  userId: string,
  languages: { name: Language; proficiency: Proficiency }[]
) => {
  try {
    // Fetch worker profile ID for the user
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) {
      throw new DatabaseError("Worker profile not found for this user");
    }

    const workerId = workerProfile.id;

    // Create multiple languages in a transaction
    await prisma.workerProfile.update({
      where: {
        id: workerId,
      },
      data: {
        languages: {
          create: languages.map(({ name, proficiency }) => ({
            language: name,
            proficiency,
          })),
        },
      },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const updateUserLanguage = async (
  userId: string,
  name: Language,
  proficiency: Proficiency
) => {
  try {
    // Fetch worker profile ID for the user
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) {
      throw new DatabaseError("Worker profile not found for this user");
    }

    const workerId = workerProfile.id;

    return await prisma.workerLanguage.update({
      where: {
        workerId_language: {
          workerId,
          language: name,
        },
      },
      data: {
        proficiency,
      },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const deleteUserLanguage = async (
  userId: string,
  language: Language
) => {
  try {
    // Fetch worker profile ID for the user
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) {
      throw new DatabaseError("Worker profile not found for this user");
    }

    const workerId = workerProfile.id;

    await prisma.workerLanguage.delete({
      where: {
        workerId_language: {
          workerId,
          language,
        },
      },
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};

export const updateAllUserLanguages = async (
  userId: string,
  languages: { name: Language; proficiency: Proficiency }[]
) => {
  try {
    // Fetch worker profile ID for the user
    const workerProfile = await prisma.workerProfile.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!workerProfile) {
      throw new DatabaseError("Worker profile not found for this user");
    }

    const workerId = workerProfile.id;

    // Use a transaction to delete all existing languages and create new ones
    return await prisma.$transaction(async (tx) => {
      // Delete all existing languages
      await tx.workerLanguage.deleteMany({
        where: { workerId },
      });

      // Create new languages
      const createdLanguages = await tx.workerLanguage.createMany({
        data: languages.map(({ name, proficiency }) => ({
          workerId,
          language: name,
          proficiency,
        })),
      });

      return createdLanguages;
    });
  } catch (error: any) {
    throw new DatabaseError(error.message);
  }
};