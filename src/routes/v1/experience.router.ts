import { Router } from "express";
import { Role } from "@prisma/client";
import { ROUTES } from "../../constants/routes.constants";
import * as experienceController from "../../controllers/v1/experience.controller";
import isAuthorized from "../../middleware/isAuthorized";
import * as ValidationMiddleware from "../../middleware/validation";
import {
  createCertificateSchema,
  updateCertificateSchema,
  deleteCertificateSchema,
} from "../../schema/v1/certificate.validation";

const experienceRouter = Router();

// Create certificate
experienceRouter.post(
  ROUTES.WORKER_CERTIFICATIONS.CREATE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(createCertificateSchema),
  experienceController.createExperienceHandler
);

// Get all certificates for a worker
experienceRouter.get(
  ROUTES.WORKER_CERTIFICATIONS.GET_ALL + ":workerId",
  isAuthorized([Role.WORKER, Role.ADMIN]),
  experienceController.getWorkerExperiencesHandler
);

// Update certificate
experienceRouter.put(
  ROUTES.WORKER_CERTIFICATIONS.UPDATE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(updateCertificateSchema),
  experienceController.updateExperienceHandler
);

// Delete certificate
experienceRouter.delete(
  ROUTES.WORKER_CERTIFICATIONS.DELETE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(deleteCertificateSchema),
  experienceController.deleteExperienceHandler
);

export default experienceRouter;
