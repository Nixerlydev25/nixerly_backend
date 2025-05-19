import { Role } from "@prisma/client";
import { Router } from "express";
import { ROUTES } from "../../constants/routes.constants";
import isAuthorized from "../../middleware/isAuthorized";
import { updateBusinessProfileSchema } from "../../schema/v1/auth.validation";
import * as ValidationMiddleware from "../../middleware/validation";
import * as businessController from "../../controllers/v1/business.controller";
const businessRouter = Router();

businessRouter.patch(
  ROUTES.BUSINESS_PROFILE.UPDATE_BUSINESS_PROFILE,
  isAuthorized([Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(updateBusinessProfileSchema),
  businessController.updateBusinessProfileHandler
);

export default businessRouter;
