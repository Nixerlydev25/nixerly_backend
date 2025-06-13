import { Role } from "@prisma/client";
import { Router } from "express";
import { ROUTES } from "../../constants/routes.constants";
import isAuthorized from "../../middleware/isAuthorized";
import { updateBusinessProfileSchema } from "../../schema/v1/auth.validation";
import * as ValidationMiddleware from "../../middleware/validation";
import * as businessController from "../../controllers/v1/business.controller";
import {
  saveProfilePicture,
  getProfilePictureUploadUrl,
  getBusinessProfileDetailsSchema,
  businessPagination,
  getBusinessAssetUploadUrl,
  saveBusinessAssets,
  deleteBusinessAssets,
} from "../../schema/v1/business.validation";
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
  ValidationMiddleware.paramValidation(getBusinessProfileDetailsSchema, "businessId"),
  businessController.getBusinessProfileDetailsHandler
);

businessRouter.get(
  ROUTES.BUSINESS_PROFILE.GET_ALL_BUSINESS_JOBS,
  isAuthorized([Role.BUSINESS]),
  ValidationMiddleware.queryValidation(businessPagination),
  businessController.getMyBusinessJobsHandler
);

businessRouter.get(
  ROUTES.BUSINESS_PROFILE.GET_JOB_DETAILS,
  isAuthorized([Role.BUSINESS]),
  ValidationMiddleware.paramValidation(getJobDetailsSchema, "jobId"),
  businessController.getJobDetailsHandler
);

// TOGGLE JOB STATUS
businessRouter.patch(
  ROUTES.BUSINESS_PROFILE.TOGGLE_JOB_STATUS,
  isAuthorized([Role.BUSINESS]),
  ValidationMiddleware.paramValidation(getJobDetailsSchema, "jobId"),
  businessController.toggleJobStatusHandler
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

// GET BUSINESS ASSET UPLOAD URL
businessRouter.post(
  ROUTES.BUSINESS_PROFILE.GET_ASSET_UPLOAD_URL,
  isAuthorized([Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(getBusinessAssetUploadUrl),
  businessController.getBusinessAssetUploadUrlHandler
);

// SAVE BUSINESS ASSETS
businessRouter.post(
  ROUTES.BUSINESS_PROFILE.SAVE_ASSETS,
  isAuthorized([Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(saveBusinessAssets),
  businessController.saveBusinessAssetsHandler
);

// DELETE BUSINESS ASSETS
businessRouter.delete(
  ROUTES.BUSINESS_PROFILE.DELETE_ASSETS,
  isAuthorized([Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(deleteBusinessAssets),
  businessController.deleteBusinessAssetsHandler
);

export default businessRouter;
