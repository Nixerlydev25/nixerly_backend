import { Router } from 'express';
import { ROUTES } from '../../constants/routes.constants';
import isAuthorized from '../../middleware/isAuthorized';
import { Role } from '@prisma/client';
import * as ValidationMiddleware from '../../middleware/validation';
import * as reportsController from '../../controllers/v1/reports.controller';
import {
  createReportWorkerSchema,
  reportBusinessSchema,
  reportJobSchema,
} from '../../schema/v1/reports.validation';
const reportsRouter = Router();

reportsRouter.post(
  ROUTES.REPORT.REPORT_WORKER,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(createReportWorkerSchema),
  reportsController.createReportWorkerHandler
);

reportsRouter.post(
  ROUTES.REPORT.REPORT_BUSINESS,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(reportBusinessSchema),
  reportsController.createReportBusinessHandler
);

reportsRouter.post(
  ROUTES.REPORT.REPORT_JOB,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(reportJobSchema),
  reportsController.createReportJobHandler
);

export default reportsRouter;
