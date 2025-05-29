import { Router } from 'express';
import { ROUTES } from '../../../constants/routes.constants';
import { Role } from '@prisma/client';
import isAuthorized from '../../../middleware/isAuthorized';
import * as businessController from '../../../controllers/v1/admin/business.controller';
import * as ValidationMiddleware from '../../../middleware/validation';
import {
  getAllBusinesses,
  toggleBusinessBlock,
} from '../../../schema/v1/admin/business.validation';
const businessRouter = Router();

businessRouter.get(
  ROUTES.ADMIN.BUSINESS.GET_ALL,
  // isAuthorized([Role.ADMIN]),
  ValidationMiddleware.queryValidation(getAllBusinesses),
  businessController.getAllBusinessUsersAdmins
);

businessRouter.post(
  ROUTES.ADMIN.BUSINESS.TOGGLE_BLOCK,
  // isAuthorized([Role.ADMIN]),
  ValidationMiddleware.paramValidation(toggleBusinessBlock, 'businessId'),
  businessController.toggleBusinessBlock
);

export default businessRouter;
