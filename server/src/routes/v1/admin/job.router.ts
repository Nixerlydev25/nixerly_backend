import { Router } from 'express';
import { ROUTES } from '../../../constants/routes.constants';
import { Role } from '@prisma/client';
import isAuthorized from '../../../middleware/isAuthorized';
import * as jobController from '../../../controllers/v1/admin/job.controller';
import * as ValidationMiddleware from '../../../middleware/validation';
import {
  getAllJobs,
  toggleJobBlock,
} from '../../../schema/v1/admin/job.validation';

const jobRouter = Router();

jobRouter.get(
  ROUTES.ADMIN.JOB.GET_ALL,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.queryValidation(getAllJobs),
  jobController.getAllJobs
);

jobRouter.post(
  ROUTES.ADMIN.JOB.TOGGLE_BLOCK,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.paramValidation(toggleJobBlock, 'jobId'),
  jobController.toggleJobBlock
);

export default jobRouter;
