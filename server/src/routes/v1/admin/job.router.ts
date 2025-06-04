import { Router } from 'express';
import { ROUTES } from '../../../constants/routes.constants';
import { Role } from '@prisma/client';
import isAuthorized from '../../../middleware/isAuthorized';
import * as jobController from '../../../controllers/v1/admin/job.controller';
import * as ValidationMiddleware from '../../../middleware/validation';
import {
  getAllJobs,
  getJobById,
  toggleJobBlock,
} from '../../../schema/v1/admin/job.validation';
import * as adminController from '../../../controllers/v1/admin/admin.controller';
import { jobIdParamSchema } from '../../../schema/v1/admin/admin.validation';

const jobRouter = Router();

jobRouter.get(
  ROUTES.ADMIN.JOB.GET_ALL,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.queryValidation(getAllJobs),
  jobController.getAllJobs
);

jobRouter.get(
  ROUTES.ADMIN.JOB.GET_By_ID,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.paramValidation(getJobById, 'jobId'),
  jobController.getJobById
);

// Toggle block status for job
jobRouter.patch(
  ROUTES.ADMIN.JOB.TOGGLE_BLOCK,
  isAuthorized([Role.ADMIN]),
  ValidationMiddleware.paramValidation(jobIdParamSchema, 'jobId'),
  adminController.toggleJobBlockStatus
);

export default jobRouter;
