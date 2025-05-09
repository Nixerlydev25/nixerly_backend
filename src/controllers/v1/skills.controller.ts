import { Request, Response } from 'express';
import { SkillsModel } from '../../model/skills.model';
import { ApiError } from '../../utils/ApiError';

export const SkillsController = {
  // Add category with skills to worker profile
  addWorkerCategory: async (req: Request, res: Response) => {
    try {
      const { workerId } = req.params;
      const { categoryId, skills } = req.body;

      if (!categoryId) {
        throw new ApiError(400, 'Category ID is required');
      }

      const result = await SkillsModel.addWorkerCategory({
        workerId,
        categoryId,
        skills: skills || [],
      });

      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Error adding worker category');
    }
  },

  // Update skills for a worker category
  updateWorkerSkills: async (req: Request, res: Response) => {
    try {
      const { workerCategoryId } = req.params;
      const { skills } = req.body;

      if (!Array.isArray(skills)) {
        throw new ApiError(400, 'Skills must be an array');
      }

      const result = await SkillsModel.updateWorkerSkills({
        workerCategoryId,
        skills,
      });

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Error updating worker skills');
    }
  },

  // Delete worker category
  deleteWorkerCategory: async (req: Request, res: Response) => {
    try {
      const { workerCategoryId } = req.params;

      const result = await SkillsModel.deleteWorkerCategory(workerCategoryId);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Error deleting worker category');
    }
  },

  // Get all categories with their skills
  getAllCategories: async (_req: Request, res: Response) => {
    try {
      const categories = await SkillsModel.getAllCategories();

      res.status(200).json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      throw new ApiError(500, 'Error fetching categories');
    }
  },

  // Get worker categories with skills
  getWorkerCategories: async (req: Request, res: Response) => {
    try {
      const { workerId } = req.params;
      const categories = await SkillsModel.getWorkerCategories(workerId);

      res.status(200).json({
        status: 'success',
        data: categories,
      });
    } catch (error) {
      throw new ApiError(500, 'Error fetching worker categories');
    }
  },
}; 