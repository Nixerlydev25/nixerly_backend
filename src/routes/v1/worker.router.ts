import { Router } from "express";
import * as workerController from "../../controllers/worker.controller";
import { ROUTES } from "../../constants/routes.constants";
import isAuthorized from "../../middleware/isAuthorized";
import * as ValidationMiddleware from "../../middleware/validation";
import { getWorkerDetailsSchema, wokerPagination } from "../../schema/v1/worker.validation";

import { Role } from "@prisma/client";
import { updateWorkerProfileSchema } from "../../schema/v1/auth.validation";
import { saveProfilePicture, getProfilePictureUploadUrl } from "../../schema/v1/worker.validation";

const workerRouter = Router();

workerRouter.get(
  ROUTES.WORKER_PROFILE.GET_ALL,
  isAuthorized([Role.ADMIN, Role.BUSINESS, Role.WORKER]),
  ValidationMiddleware.queryValidation(wokerPagination),
  workerController.getAllWorkers
);

workerRouter.get(
  ROUTES.WORKER_PROFILE.GET_DETAILS,
  isAuthorized([Role.ADMIN, Role.BUSINESS, Role.WORKER]),
  ValidationMiddleware.paramValidation(getWorkerDetailsSchema, 'workerId'),
  workerController.getWorkerDetails
);

workerRouter.patch(
  ROUTES.WORKER_PROFILE.UPDATE_WORKER_PROFILE,
  isAuthorized([Role.WORKER]),
  ValidationMiddleware.bodyValidation(updateWorkerProfileSchema),
  workerController.updateWorkerProfileHandler
);


// GET PROFILE PICTURE UPLOAD URL
workerRouter.post(
  ROUTES.WORKER_PROFILE.GET_PROFILE_PICTURE_UPLOAD_URL,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.SUPER_ADMIN]),
  ValidationMiddleware.bodyValidation(getProfilePictureUploadUrl),
  workerController.getProfilePictureUploadUrlHandler
);

// SAVE PROFILE PICTURE
workerRouter.put(
  ROUTES.WORKER_PROFILE.SAVE_PROFILE_PICTURE,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.SUPER_ADMIN]),
  ValidationMiddleware.bodyValidation(saveProfilePicture),
  workerController.saveProfilePictureHandler
);


export default workerRouter;
