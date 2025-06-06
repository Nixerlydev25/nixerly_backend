import { Role } from '@prisma/client';
import { Router } from 'express';
import isAuthorized from '../../../middleware/isAuthorized';
import { ROUTES } from '../../../constants/routes.constants';
import * as workerController from '../../../controllers/v1/admin/worker.controller';
import {
  getAllWorkers,
  toggleWorkerBlock,
} from '../../../schema/v1/admin/worker.validation';
import * as ValidationMiddleware from '../../../middleware/validation';
import * as adminController from '../../../controllers/v1/admin/admin.controller';
import { workerIdParamSchema } from '../../../schema/v1/admin/admin.validation';

const workerRouter = Router();

workerRouter.get(
  ROUTES.ADMIN.WORKER.GET_ALL,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.queryValidation(getAllWorkers),
  workerController.getAllWorkers
);

// Toggle block status for worker
workerRouter.patch(
  ROUTES.ADMIN.WORKER.TOGGLE_BLOCK,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.paramValidation(workerIdParamSchema, 'workerId'),
  adminController.toggleWorkerBlockStatus
);

export default workerRouter;
