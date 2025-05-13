import { Router } from "express";
import * as workerController from "../../controllers/worker.controller";
import { ROUTES } from "../../constants/routes.constants";
import isAuthorized from "../../middleware/isAuthorized";

import { Role } from "@prisma/client";
const workerRouter = Router();

workerRouter.get(
  ROUTES.WORKER_PROFILE.GET_ALL,
  isAuthorized([Role.ADMIN, Role.BUSINESS, Role.WORKER]),
  workerController.getAllWorkers
);

export default workerRouter;
