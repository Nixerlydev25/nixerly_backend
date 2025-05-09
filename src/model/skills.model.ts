import { PrismaClient, CategoryName, SkillName } from '@prisma/client';

const prisma = new PrismaClient();

interface AddWorkerCategoryInput {
  workerId: string;
  categoryId: string;
  skills: string[]; // Array of skill IDs
}

interface UpdateWorkerSkillsInput {
  workerCategoryId: string;
  skills: string[]; // Array of skill IDs
}

export const SkillsModel = {
  // Add category with skills to worker profile
  addWorkerCategory: async (input: AddWorkerCategoryInput) => {
    const { workerId, categoryId, skills } = input;

    return await prisma.$transaction(async (tx) => {
      // Create worker category
      const workerCategory = await tx.workerCategory.create({
        data: {
          workerId,
          categoryId,
        },
        include: {
          workerSkills: true,
          category: true,
        },
      });

      // Add skills to worker category if provided
      if (skills.length > 0) {
        await tx.workerSkill.createMany({
          data: skills.map((skillId) => ({
            workerCategoryId: workerCategory.id,
            skillId,
          })),
        });
      }

      return workerCategory;
    });
  },

  // Update skills for a worker category
  updateWorkerSkills: async (input: UpdateWorkerSkillsInput) => {
    const { workerCategoryId, skills } = input;

    return await prisma.$transaction(async (tx) => {
      // Delete existing skills
      await tx.workerSkill.deleteMany({
        where: {
          workerCategoryId,
        },
      });

      // Add new skills
      if (skills.length > 0) {
        await tx.workerSkill.createMany({
          data: skills.map((skillId) => ({
            workerCategoryId,
            skillId,
          })),
        });
      }

      return await tx.workerCategory.findUnique({
        where: {
          id: workerCategoryId,
        },
        include: {
          workerSkills: {
            include: {
              skill: true,
            },
          },
          category: true,
        },
      });
    });
  },

  // Delete worker category (this will cascade delete related skills)
  deleteWorkerCategory: async (workerCategoryId: string) => {
    return await prisma.workerCategory.delete({
      where: {
        id: workerCategoryId,
      },
      include: {
        category: true,
      },
    });
  },

  // Get all categories with their skills
  getAllCategories: async () => {
    return await prisma.category.findMany({
      include: {
        skills: true,
      },
    });
  },

  // Get worker categories with skills
  getWorkerCategories: async (workerId: string) => {
    return await prisma.workerCategory.findMany({
      where: {
        workerId,
      },
      include: {
        category: true,
        workerSkills: {
          include: {
            skill: true,
          },
        },
      },
    });
  },
}; 