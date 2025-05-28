import { Router } from 'express';
import isAuthorized from '../../../middleware/isAuthorized';
import { ROUTES } from '../../../constants/routes.constants';
import { Role } from '@prisma/client';
import * as statisticsController from '../../../controllers/v1/admin/statistics.controller';
const statisticsRouter = Router();

statisticsRouter.get(
  ROUTES.ADMIN.STATISTICS.GET_ALL,
//   isAuthorized([Role.ADMIN]),
  statisticsController.getAllStatistics
);

export default statisticsRouter;
