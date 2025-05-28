import { Router } from 'express';
import { ROUTES } from '../../../constants/routes.constants';
import { Role } from '@prisma/client';
import isAuthorized from '../../../middleware/isAuthorized';
import * as businessController from '../../../controllers/v1/admin/business.controller';
const businessRouter = Router();

businessRouter.get(
  ROUTES.ADMIN.BUSINESS.GET_ALL,
  // isAuthorized([Role.ADMIN]),
  businessController.getAllBusinessUsersAdmins
);

businessRouter.get(
  ROUTES.ADMIN.BUSINESS.GET_BY_ID,
  // isAuthorized([Role.ADMIN]),
  businessController.getBusinessById
);

businessRouter.post(
  ROUTES.ADMIN.BUSINESS.BLOCK,
  // isAuthorized([Role.ADMIN]),
  businessController.blockBusiness
);

businessRouter.post(
  ROUTES.ADMIN.BUSINESS.UNBLOCK,
  // // // isAuthorized([Role.ADIN),
  businessController.unblockBusiness
);

export default businessRouter;
