import prisma from "../../config/prisma.config";
import { DatabaseError } from "../../utils/errors";

interface promptLessonPlan {
  topic: string;
  additionalInstructions: string;
  standards: string;
  outputLanguage: string;
}

export const createLessonPlan = async (
  promptlessonPlan: promptLessonPlan,
  lessonPlan: any,
  userId: string
) => {
  try {
    const lessonPlanResponse = await prisma.lessonPlan.create({
      data: {
        title: lessonPlan.lessonOverview.title,
        aiPrompt: JSON.stringify(promptlessonPlan),
        aiResponse: JSON.stringify(lessonPlan),
        userId: userId,
      },
    });
    return lessonPlanResponse;
  } catch (error) {
    throw new DatabaseError("Failed to create lesson plan");
  }
};

export const updateLessonPlan = async (lessonPlanId: string, promptlessonPlan: promptLessonPlan, lessonPlan: any, userId: string) => {
  try {
    const lessonPlanResponse = await prisma.lessonPlan.update({
      where: { id: lessonPlanId },
      data: {
        title: lessonPlan.lessonOverview.title,
        aiPrompt: JSON.stringify(promptlessonPlan),
        aiResponse: JSON.stringify(lessonPlan),
        userId: userId,
      },
    });
    return lessonPlanResponse;
  } catch (error) {
    throw new DatabaseError("Failed to update lesson plan");
  }
};

export const getLessonPlan = async (lessonPlanId: string) => {
  try {
    const lessonPlan = await prisma.lessonPlan.findUnique({
      where: { id: lessonPlanId },
    });
    return lessonPlan;
  } catch (error) {
    throw new DatabaseError("Failed to get lesson plan");
  }
};

export const getAllUserLessonPlans = async (userId: string) => {
  try {
    const lessonPlans = await prisma.lessonPlan.findMany({
      where: { userId },
      include: {
        favorites: {
          where: { userId },
        },
      },
    });

    return lessonPlans.map(plan => ({
      ...plan,
      isFavorite: plan.favorites.length > 0,
    }));
  } catch (error) {
    throw new DatabaseError("Failed to get all user lesson plans");
  }
};

export const getAllFavorites = async (userId: string) => {
  try {
    // Find all lesson plans that this user has favorited
    const favorites = await prisma.lessonPlan.findMany({
      where: {
        favorites: {
          some: { userId },
        },
      },
    });

    return favorites;
  } catch (error) {
    throw new DatabaseError("Failed to get all favorites");
  }
};

export const addFavorite = async (lessonPlanId: string, userId: string) => {
  try {
    const favorite = await prisma.favoriteLessonPlan.create({
      data: {
        userId,
        lessonPlanId,
      },
    });
    return favorite;
  } catch (error) {
    throw new DatabaseError("Failed to add favorite");
  }
};

export const removeFavorite = async (lessonPlanId: string, userId: string) => {
  try {
    const favorite = await prisma.favoriteLessonPlan.delete({
      where: {
        userId_lessonPlanId: {
          userId,
          lessonPlanId,
        },
      },
    });
    return favorite;
  } catch (error) {
    throw new DatabaseError("Failed to remove favorite");
  }
};
