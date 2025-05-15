import { Router } from "express";
import * as workerController from "../../controllers/worker.controller";
import { ROUTES } from "../../constants/routes.constants";
import isAuthorized from "../../middleware/isAuthorized";
import * as ValidationMiddleware from "../../middleware/validation";
import { getWorkerDetailsSchema } from "../../schema/v1/worker.validation";

import { Role } from "@prisma/client";
const workerRouter = Router();

workerRouter.get(
  ROUTES.WORKER_PROFILE.GET_ALL,
  isAuthorized([Role.ADMIN, Role.BUSINESS, Role.WORKER]),
  workerController.getAllWorkers
);

workerRouter.get(
  ROUTES.WORKER_PROFILE.GET_DETAILS,
  isAuthorized([Role.ADMIN, Role.BUSINESS, Role.WORKER]),
  ValidationMiddleware.paramValidation(getWorkerDetailsSchema, 'workerId'),
  workerController.getWorkerDetails
);

export default workerRouter;
