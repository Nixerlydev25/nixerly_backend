import { Router } from "express";
import { Role } from "@prisma/client";
import { ROUTES } from "../../constants/routes.constants";
import * as skillController from "../../controllers/v1/skills.controller";
import isAuthorized from "../../middleware/isAuthorized";
import * as ValidationMiddleware from "../../middleware/validation";
import {
  createSkillsSchema,
  updateSkillsSchema,
  deleteSkillsSchema,
} from "../../schema/v1/skills.validation";

const skillRouter = Router();

// Create multiple skills for a worker
skillRouter.post(
  ROUTES.WROKER_SKILLS.CREATE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(createSkillsSchema),
  skillController.createWorkerSkillsHandler
);

// Get all skills for a worker
skillRouter.get(
  ROUTES.WROKER_SKILLS.GET_ALL,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  skillController.getWorkerSkillsHandler
);

// Update skills (add new ones and remove ones not in the list)
skillRouter.patch(
  ROUTES.WROKER_SKILLS.UPDATE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(updateSkillsSchema),
  skillController.updateWorkerSkillsHandler
);

// Delete multiple skills
skillRouter.delete(
  ROUTES.WROKER_SKILLS.DELETE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(deleteSkillsSchema),
  skillController.deleteWorkerSkillsHandler
);

export default skillRouter;