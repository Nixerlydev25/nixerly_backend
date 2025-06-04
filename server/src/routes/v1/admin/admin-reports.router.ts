import { Router } from "express";
import { Role } from "@prisma/client";
import { ROUTES } from "../../../constants/routes.constants";
import * as adminReportsController from "../../../controllers/v1/admin/admin-reports.controller";
import isAuthorized from "../../../middleware/isAuthorized";
import * as ValidationMiddleware from "../../../middleware/validation";
import {
  jobReportsFilterSchema,
  workerReportsFilterSchema,
  businessReportsFilterSchema,
  reportIdParamSchema,
} from "../../../schema/v1/admin/admin-reports.validation";

const adminReportsRouter = Router();

// Get all job reports with filters and pagination
adminReportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_JOB_REPORTS,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.queryValidation(jobReportsFilterSchema),
  adminReportsController.getAllJobReports
);

// Get all worker reports with filters and pagination
adminReportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_WORKER_REPORTS,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.queryValidation(workerReportsFilterSchema),
  adminReportsController.getAllWorkerReports
);

// Get all business reports with filters and pagination
adminReportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_BUSINESS_REPORTS,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.queryValidation(businessReportsFilterSchema),
  adminReportsController.getAllBusinessReports
);

// Get detailed information for a specific job report
adminReportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_SINGLE_JOB_REPORT,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.paramValidation(reportIdParamSchema, "reportId"),
  adminReportsController.getJobReportDetails
);

// Get detailed information for a specific worker report
adminReportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_SINGLE_WORKER_REPORT,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.paramValidation(reportIdParamSchema, "reportId"),
  adminReportsController.getWorkerReportDetails
);

// Get detailed information for a specific business report
adminReportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_SINGLE_BUSINESS_REPORT,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.paramValidation(reportIdParamSchema, "reportId"),
  adminReportsController.getBusinessReportDetails
);

export default adminReportsRouter;
