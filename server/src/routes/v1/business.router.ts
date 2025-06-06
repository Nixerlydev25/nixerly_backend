import { Role } from "@prisma/client";
import { Router } from "express";
import { ROUTES } from "../../constants/routes.constants";
import isAuthorized from "../../middleware/isAuthorized";
import { updateBusinessProfileSchema } from "../../schema/v1/auth.validation";
import * as ValidationMiddleware from "../../middleware/validation";
import * as businessController from "../../controllers/v1/business.controller";
import {
  getJobsByBusiness,
  getWorkerDetailsSchema,
  saveProfilePicture,
  getProfilePictureUploadUrl,
} from "../../schema/v1/worker.validation";
import { getJobDetailsSchema } from "../../schema/v1/jobs.validation";

const businessRouter = Router();

businessRouter.patch(
  ROUTES.BUSINESS_PROFILE.UPDATE_BUSINESS_PROFILE,
  isAuthorized([Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(updateBusinessProfileSchema),
  businessController.updateBusinessProfileHandler
);

businessRouter.get(
  ROUTES.BUSINESS_PROFILE.GET_BUSINESS_PROFILE_DETAILS,
  isAuthorized([Role.BUSINESS, Role.ADMIN, Role.SUPER_ADMIN, Role.WORKER]),
  ValidationMiddleware.paramValidation(getWorkerDetailsSchema, "businessId"),
  businessController.getBusinessProfileDetailsHandler
);

businessRouter.get(
  ROUTES.BUSINESS_PROFILE.GET_ALL_BUSINESS_JOBS,
  isAuthorized([Role.BUSINESS]),
  ValidationMiddleware.queryValidation(getJobsByBusiness),
  businessController.getMyBusinessJobsHandler
);

businessRouter.get(
  ROUTES.BUSINESS_PROFILE.GET_JOB_DETAILS,
  isAuthorized([Role.BUSINESS]),
  ValidationMiddleware.paramValidation(getJobDetailsSchema, "jobId"),
  businessController.getJobDetailsHandler
);

// GET PROFILE PICTURE UPLOAD URL
businessRouter.post(
  ROUTES.BUSINESS_PROFILE.GET_PROFILE_PICTURE_UPLOAD_URL,
  isAuthorized([Role.BUSINESS, Role.ADMIN, Role.SUPER_ADMIN]),
  ValidationMiddleware.bodyValidation(getProfilePictureUploadUrl),
  businessController.getProfilePictureUploadUrlHandler
);

// SAVE PROFILE PICTURE
businessRouter.put(
  ROUTES.BUSINESS_PROFILE.SAVE_PROFILE_PICTURE,
  isAuthorized([Role.BUSINESS, Role.ADMIN, Role.SUPER_ADMIN]),
  ValidationMiddleware.bodyValidation(saveProfilePicture),
  businessController.saveProfilePictureHandler
);

export default businessRouter;
