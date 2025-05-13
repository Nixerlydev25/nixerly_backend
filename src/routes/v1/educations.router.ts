import { Router } from "express";
import { Role } from "@prisma/client";
import { ROUTES } from "../../constants/routes.constants";
import * as educationController from "../../controllers/v1/education.controller";
import isAuthorized from "../../middleware/isAuthorized";
import * as ValidationMiddleware from "../../middleware/validation";
import {
  createEducationSchema,
  updateEducationSchema,
  deleteEducationSchema,
} from "../../schema/v1/education.validation";

const educationRouter = Router();

// Create education
educationRouter.post(
  ROUTES.WORKER_EDUCATIONS.CREATE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(createEducationSchema),
  educationController.createEducationHandler
);

// Get all educations for a worker
educationRouter.get(
  ROUTES.WORKER_EDUCATIONS.GET_ALL + ":workerId",
  isAuthorized([Role.WORKER, Role.ADMIN]),
  educationController.getWorkerEducationHandler
);

// Update education
educationRouter.put(
  ROUTES.WORKER_EDUCATIONS.UPDATE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(updateEducationSchema),
  educationController.updateEducationHandler
);

// Delete education
educationRouter.delete(
  ROUTES.WORKER_EDUCATIONS.DELETE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(deleteEducationSchema),
  educationController.deleteEducationHandler
);

export default educationRouter;
