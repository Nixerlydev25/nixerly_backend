import { Router } from "express";
import * as userController from "../../controllers/v1/user.controller";
import isAuthorized from "../../middleware/isAuthorized";
import { Role } from "@prisma/client";
import * as ValidationMiddleware from "../../middleware/validation";
import {
  forgotPassword,
  resetPassword,
  verifyOtp,
  getProfilePictureUploadUrl,
  saveProfilePicture,
} from "../../schema/v1/user.valdiation";
import { 
  updateWorkerProfileSchema, 
  updateBusinessProfileSchema, 
  updateUserSchema 
} from "../../schema/v1/auth.validation";
import { ROUTES } from "../../constants/routes.constants";

const userRouter = Router();

userRouter.get(
  ROUTES.USER.CURRENT_USER,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.SUPER_ADMIN, Role.BUSINESS]),
  userController.getCurrentUserDetails
);


userRouter.get(
  ROUTES.USER.GET_WORKER_PROFILE_DETAILS,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.SUPER_ADMIN]),
  userController.getWorkerProfileDetailsHandler
);

userRouter.get(
  ROUTES.USER.GET_BUSINESS_PROFILE_DETAILS,
  isAuthorized([Role.BUSINESS, Role.ADMIN, Role.SUPER_ADMIN]),
  userController.getBusinessProfileDetailsHandler
);


// GET PROFILE PICTURE UPLOAD URL
userRouter.post(
  ROUTES.USER.GET_PROFILE_PICTURE_UPLOAD_URL,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.SUPER_ADMIN]),
  ValidationMiddleware.bodyValidation(getProfilePictureUploadUrl),
  userController.getProfilePictureUploadUrlHandler
);

// SAVE PROFILE PICTURE
userRouter.post(
  ROUTES.USER.SAVE_PROFILE_PICTURE,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.SUPER_ADMIN]),
  ValidationMiddleware.bodyValidation(saveProfilePicture),
  userController.saveProfilePictureHandler
);

userRouter.patch(
  ROUTES.USER.UPDATE_BUSINESS_PROFILE,
  isAuthorized([Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(updateBusinessProfileSchema),
  userController.updateBusinessProfileHandler
);

userRouter.patch(
  ROUTES.USER.UPDATE_USER,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.SUPER_ADMIN, Role.BUSINESS]),
  ValidationMiddleware.bodyValidation(updateUserSchema),
  userController.updateUserHandler
);

userRouter.put(
  ROUTES.USER.TOGGLE_FIRST_TIME_LOGIN,
  isAuthorized([Role.SUPER_ADMIN, Role.ADMIN, Role.DEVELOPER, Role.WORKER, Role.BUSINESS]),
  userController.toggleFirstTimeLogin
);

userRouter.delete(
  ROUTES.USER.DELETE_ACCOUNT,
  isAuthorized([Role.SUPER_ADMIN, Role.ADMIN, Role.DEVELOPER, Role.BUSINESS]),
  userController.deleteUserAccount
);

userRouter.post(
  ROUTES.USER.FORGOT_PASSWORD,
  ValidationMiddleware.bodyValidation(forgotPassword),
  userController.forgotPasswordHandler
);

userRouter.post(
  ROUTES.USER.VERIFY_OTP,
  ValidationMiddleware.bodyValidation(verifyOtp),
  userController.verifyOtpHandler
);

userRouter.post(
  ROUTES.USER.RESET_PASSWORD,
  ValidationMiddleware.bodyValidation(resetPassword),
  userController.resetPasswordHandler
);

export default userRouter;
