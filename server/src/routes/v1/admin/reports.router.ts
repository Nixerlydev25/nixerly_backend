import { Router } from 'express';
import { ROUTES } from '../../../constants/routes.constants';
import * as reportController from '../../../controllers/v1/admin/report.controller';

const reportsRouter = Router();

reportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_ALL,
  // isAuthorized([Role.ADMIN]),
  reportController.getAllReports
);

reportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_BUSINESS_REPORTS,
  // isAuthorized([Role.ADMIN]),
  reportController.getBusinessReports
);

reportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_WORKER_REPORTS,
  // isAuthorized([Role.ADMIN]),
  reportController.getWorkerReports
);

reportsRouter.get(
  ROUTES.ADMIN.REPORT.GET_JOB_REPORTS,
  // isAuthorized([Role.ADMIN]),
  reportController.getJobReports
);

reportsRouter.post(
  ROUTES.ADMIN.REPORT.BLOCK_WORKER_BY_REPORT,
  // isAuthorized([Role.ADMIN]),
  reportController.blockWorkerByReport
);

reportsRouter.post(
  ROUTES.ADMIN.REPORT.UNBLOCK_WORKER_BY_REPORT,
  // isAuthorized([Role.ADMIN]),
  reportController.unblockWorkerByReport
);

reportsRouter.post(
  ROUTES.ADMIN.REPORT.BLOCK_JOB_BY_REPORT,
  // isAuthorized([Role.ADMIN]),
  reportController.blockJobByReport
);

reportsRouter.post(
  ROUTES.ADMIN.REPORT.UNBLOCK_JOB_BY_REPORT,
  // isAuthorized([Role.ADMIN]),
  reportController.unblockJobByReport
);

reportsRouter.post(
  ROUTES.ADMIN.REPORT.BLOCK_BUSINESS_BY_REPORT,
  // isAuthorized([Role.ADMIN]),
  reportController.blockBusinessByReport
);

reportsRouter.post(
  ROUTES.ADMIN.REPORT.UNBLOCK_BUSINESS_BY_REPORT,
  // isAuthorized([Role.ADMIN]),
  reportController.unblockBusinessByReport
);

export default reportsRouter;
