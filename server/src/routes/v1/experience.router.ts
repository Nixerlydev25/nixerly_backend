import { Router } from "express";
import { Role } from "@prisma/client";
import { ROUTES } from "../../constants/routes.constants";
import * as experienceController from "../../controllers/v1/experience.controller";
import isAuthorized from "../../middleware/isAuthorized";
import * as ValidationMiddleware from "../../middleware/validation";
import {
  updateExperienceSchema,
  deleteExperienceSchema,
  createOrUpdateExperienceSchema,
} from "../../schema/v1/experience.validation";

const experienceRouter = Router();

experienceRouter.post(
  ROUTES.WORKER_EXPERIENCE.CREATE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(createOrUpdateExperienceSchema),
  experienceController.createExperienceHandler
);

experienceRouter.get(
  ROUTES.WORKER_EXPERIENCE.GET_ALL,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  experienceController.getWorkerExperiencesHandler
);

experienceRouter.put(
  ROUTES.WORKER_EXPERIENCE.UPDATE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(updateExperienceSchema),
  experienceController.updateExperienceHandler
);

experienceRouter.put(
  ROUTES.WORKER_EXPERIENCE.UPDATE_ALL,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  experienceController.updateAllExperiencesHandler
);

experienceRouter.delete(
  ROUTES.WORKER_EXPERIENCE.DELETE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(deleteExperienceSchema),
  experienceController.deleteExperienceHandler
);

export default experienceRouter;
