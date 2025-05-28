import { Router } from 'express';
import { ROUTES } from '../../../constants/routes.constants';
import { Role } from '@prisma/client';
import isAuthorized from '../../../middleware/isAuthorized';
import * as jobController from '../../../controllers/v1/admin/job.controller';

const jobRouter = Router();

jobRouter.get(
  ROUTES.ADMIN.JOB.GET_ALL,
  // isAuthorized([Role.ADMIN]),
  jobController.getAllJobs
);

jobRouter.get(
  ROUTES.ADMIN.JOB.GET_BY_ID,
  // isAuthorized([Role.ADMIN]),
  jobController.getJobById
);

jobRouter.post(
  ROUTES.ADMIN.JOB.BLOCK,
  // isAuthorized([Role.ADMIN]),
  jobController.blockJob
);

jobRouter.post(
  ROUTES.ADMIN.JOB.UNBLOCK,
  // isAuthorized([Role.ADMIN]),
  jobController.unblockJob
);

export default jobRouter;
