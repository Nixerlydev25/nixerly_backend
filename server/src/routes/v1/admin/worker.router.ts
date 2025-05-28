import { Role } from '@prisma/client';
import { Router } from 'express';
import isAuthorized from '../../../middleware/isAuthorized';
import { ROUTES } from '../../../constants/routes.constants';
import * as workerController from '../../../controllers/v1/admin/worker.controller';

const workerRouter = Router();

workerRouter.get(
  ROUTES.ADMIN.WORKER.GET_ALL,
  // isAuthorized([Role.ADMIN]),
  workerController.getAllWorkers
);

workerRouter.get(
  ROUTES.ADMIN.WORKER.GET_BY_ID,
  // isAuthorized([Role.ADMIN]),
  workerController.getWorkerById
);

workerRouter.post(
  ROUTES.ADMIN.WORKER.BLOCK,
  // isAuthorized([Role.ADMIN]),
  workerController.blockWorker
);

workerRouter.post(
  ROUTES.ADMIN.WORKER.UNBLOCK,
  // isAuthorized([Role.ADMIN]),
  workerController.unblockWorker
);

export default workerRouter;
