import { Router } from "express";
import { Role } from "@prisma/client";
import { ROUTES } from "../../constants/routes.constants";
import * as jobController from "../../controllers/v1/jobs.controller";
import isAuthorized from "../../middleware/isAuthorized";
import * as ValidationMiddleware from "../../middleware/validation";
import { createJobSchema, getJobDetailsSchema, getJobsQuerySchema } from "../../schema/v1/jobs.validation";

const jobsRouter = Router();

jobsRouter.post(
  ROUTES.JOBS.CREATE,
  isAuthorized([Role.BUSINESS, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(createJobSchema),
  jobController.createJobHandler
);

jobsRouter.get(
  ROUTES.JOBS.GET_ALL,
  isAuthorized([Role.WORKER, Role.BUSINESS, Role.ADMIN]),
  ValidationMiddleware.queryValidation(getJobsQuerySchema),
  jobController.getJobsHandler
);

jobsRouter.get(
  ROUTES.JOBS.GET_DETAILS,
  ValidationMiddleware.paramValidation(getJobDetailsSchema),
  jobController.getJobDetailsHandler
);

export default jobsRouter; 