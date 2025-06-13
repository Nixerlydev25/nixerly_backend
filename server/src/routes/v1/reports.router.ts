import { Router } from "express";
import { Role } from "@prisma/client";
import { ROUTES } from "../../constants/routes.constants";
import * as reportController from "../../controllers/v1/reports.controller";
import isAuthorized from "../../middleware/isAuthorized";
import * as ValidationMiddleware from "../../middleware/validation";
import {
  reportWorkerBodySchema,
  reportBusinessBodySchema,
  reportJobBodySchema,
  reportWorkerParamSchema,
  reportBusinessParamSchema,
  reportJobParamSchema,
} from "../../schema/v1/reports.validation";

const reportRouter = Router();

// Report a worker (only business and admin can report)
reportRouter.post(
  ROUTES.REPORT.REPORT_WORKER,
  isAuthorized([Role.BUSINESS, Role.ADMIN]),
  ValidationMiddleware.paramValidation(reportWorkerParamSchema, "workerId"),
  ValidationMiddleware.bodyValidation(reportWorkerBodySchema),
  reportController.reportWorkerHandler
);

// Report a business (only worker and admin can report)
reportRouter.post(
  ROUTES.REPORT.REPORT_BUSINESS,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.paramValidation(reportBusinessParamSchema, "businessId"),
  ValidationMiddleware.bodyValidation(reportBusinessBodySchema),
  reportController.reportBusinessHandler
);

// Report a job (only worker and admin can report)
reportRouter.post(
  ROUTES.REPORT.REPORT_JOB,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.paramValidation(reportJobParamSchema, "jobId"),
  ValidationMiddleware.bodyValidation(reportJobBodySchema),
  reportController.reportJobHandler
);

// Check if worker has reported a job
reportRouter.get(
  ROUTES.REPORT.HAS_WORKER_REPORTED_JOB,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.paramValidation(reportJobParamSchema, "jobId"),
  reportController.hasWorkerReportedJobHandler
);

// Check if worker has reported a business
reportRouter.get(
  ROUTES.REPORT.HAS_WORKER_REPORTED_BUSINESS,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.paramValidation(reportBusinessParamSchema, "businessId"),
  reportController.hasWorkerReportedBusinessHandler
);

// Check if business has reported a worker
reportRouter.get(
  ROUTES.REPORT.HAS_BUSINESS_REPORTED_WORKER,
  isAuthorized([Role.BUSINESS, Role.ADMIN]),
  ValidationMiddleware.paramValidation(reportWorkerParamSchema, "workerId"),
  reportController.hasBusinessReportedWorkerHandler
);

export default reportRouter;
