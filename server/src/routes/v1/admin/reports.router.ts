import { Router } from 'express';
import { ROUTES } from '../../../constants/routes.constants';
import * as reportController from '../../../controllers/v1/admin/report.controller';
import * as ValidationMiddleware from '../../../middleware/validation';
import {
  getAllReports,
  getWorkerReports,
  getBusinessReports,
  getJobReports,
} from '../../../schema/v1/admin/report.validation';
import { Role } from '@prisma/client';
import isAuthorized from '../../../middleware/isAuthorized';
const reportsRouter = Router();

reportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_ALL,
  // isAuthorized([Role.ADMIN]),
  ValidationMiddleware.queryValidation(getAllReports),
  reportController.getAllReports
);

reportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_BUSINESS_REPORTS,
  // isAuthorized([Role.ADMIN]),
  ValidationMiddleware.queryValidation(getBusinessReports),
  reportController.getBusinessReports
);

reportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_WORKER_REPORTS,
  // isAuthorized([Role.ADMIN]),
  ValidationMiddleware.queryValidation(getWorkerReports),
  reportController.getWorkerReports
);

reportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_JOB_REPORTS,
  // isAuthorized([Role.ADMIN]),
  ValidationMiddleware.queryValidation(getJobReports),
  reportController.getJobReports
);

export default reportsRouter;
