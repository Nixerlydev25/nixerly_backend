import { Router } from "express";
import { Role } from "@prisma/client";
import { ROUTES } from "../../constants/routes.constants";
import * as certificateController from "../../controllers/v1/certificate.controller";
import isAuthorized from "../../middleware/isAuthorized";
import * as ValidationMiddleware from "../../middleware/validation";
import {
  createCertificateSchema,
  updateCertificateSchema,
  deleteCertificateSchema,
} from "../../schema/v1/certificate.validation";

const certificationRouter = Router();

// Create certificate
certificationRouter.post(
  ROUTES.WORKER_CERTIFICATIONS.CREATE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(createCertificateSchema),
  certificateController.createCertificateHandler
);

// Get all certificates for a worker
certificationRouter.get(
  ROUTES.WORKER_CERTIFICATIONS.GET_ALL + ":workerId",
  isAuthorized([Role.WORKER, Role.ADMIN]),
  certificateController.getWorkerCertificatesHandler
);

// Update certificate
certificationRouter.put(
  ROUTES.WORKER_CERTIFICATIONS.UPDATE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(updateCertificateSchema),
  certificateController.updateCertificateHandler
);

// Delete certificate
certificationRouter.delete(
  ROUTES.WORKER_CERTIFICATIONS.DELETE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(deleteCertificateSchema),
  certificateController.deleteCertificateHandler
);

export default certificationRouter;
