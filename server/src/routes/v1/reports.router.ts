import { Router } from 'express';
import { ROUTES } from '../../constants/routes.constants';
import isAuthorized from '../../middleware/isAuthorized';
import { Role } from '@prisma/client';
import * as ValidationMiddleware from '../../middleware/validation';
import * as reportsController from '../../controllers/v1/reports.controller';
import {
  createReportWorkerSchema,
  reportWorkerIdSchema,
  reportBusinessIdSchema,
  reportBusinessSchema,
  reportJobSchema,
  reportJobIdSchema,
} from '../../schema/v1/reports.validation';
const reportsRouter = Router();

reportsRouter.post(
  ROUTES.REPORT.REPORT_WORKER,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(createReportWorkerSchema),
  ValidationMiddleware.paramValidation(reportWorkerIdSchema, 'workerId'),
  reportsController.createReportWorkerHandler
);

reportsRouter.post(
  ROUTES.REPORT.REPORT_BUSINESS,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(reportBusinessSchema),
  ValidationMiddleware.paramValidation(reportBusinessIdSchema, 'businessId'),
  reportsController.createReportBusinessHandler
);

reportsRouter.post(
  ROUTES.REPORT.REPORT_JOB,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(reportJobSchema),
  ValidationMiddleware.paramValidation(reportJobIdSchema, 'jobId'),
  reportsController.createReportJobHandler
);

export default reportsRouter;
