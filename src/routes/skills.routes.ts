import { Router } from 'express';
import { SkillsController } from '../controllers/skills.controller';
import { authenticate } from '../middleware/auth';
import { validateWorkerAccess } from '../middleware/validateWorkerAccess';

const router = Router();

// Get all categories with their skills
router.get('/categories', SkillsController.getAllCategories);

// Get worker categories with skills
router.get(
  '/worker/:workerId/categories',
  authenticate,
  validateWorkerAccess,
  SkillsController.getWorkerCategories
);

// Add category with skills to worker profile
router.post(
  '/worker/:workerId/categories',
  authenticate,
  validateWorkerAccess,
  SkillsController.addWorkerCategory
);

// Update skills for a worker category
router.put(
  '/worker/categories/:workerCategoryId/skills',
  authenticate,
  validateWorkerAccess,
  SkillsController.updateWorkerSkills
);

// Delete worker category
router.delete(
  '/worker/categories/:workerCategoryId',
  authenticate,
  validateWorkerAccess,
  SkillsController.deleteWorkerCategory
);

export default router; 