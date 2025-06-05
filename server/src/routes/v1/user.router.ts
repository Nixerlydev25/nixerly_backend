import { Router } from "express";
import * as userController from "../../controllers/v1/user.controller";
import isAuthorized from "../../middleware/isAuthorized";
import { Role } from "@prisma/client";
import * as ValidationMiddleware from "../../middleware/validation";
import {
  forgotPassword,
  resetPassword,
  verifyOtp,
  getAppliedJobsQuerySchema,
  userIdSchema
} from "../../schema/v1/user.valdiation";
import {
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

userRouter.get(
  ROUTES.USER.GET_WORKER_APPLIED_JOBS,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.SUPER_ADMIN]),
  ValidationMiddleware.userValidation(userIdSchema as any),
  ValidationMiddleware.queryValidation(getAppliedJobsQuerySchema),
  userController.getWorkerAppliedJobsHandler
);

export default userRouter;
