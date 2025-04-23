import { Router } from "express";
import * as userController from "../../controllers/v1/user.controller";
import isAuthorized from "../../middleware/isAuthorized";
import { Role } from "@prisma/client";
import { validateSchema } from "../../middleware/validation";
import { forgotPassword, resetPassword, verifyOtp } from "../../schema/v1/user.valdiation";
import { updateUserDetailsSchema } from "../../schema/v1/auth.validation";
import { USER_ROUTES } from "../../constants/routes.constants";

const userRouter = Router();

userRouter.get(
  USER_ROUTES.CURRENT_USER,
  isAuthorized([Role.WORKER, Role.ADMIN, Role.SUPER_ADMIN]),
  userController.getCurrentUserDetails
);

userRouter.patch(
  "/update-user-details",
  isAuthorized([Role.WORKER, Role.ADMIN, Role.SUPER_ADMIN]),
  validateSchema(updateUserDetailsSchema),
  userController.updateUserDetailsHandler
);

userRouter.put(
  USER_ROUTES.TOGGLE_FIRST_TIME_LOGIN,
  isAuthorized([
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.DEVELOPER,
    Role.WORKER,
  ]),
  userController.toggleFirstTimeLogin
);

userRouter.delete(
  USER_ROUTES.DELETE_ACCOUNT,
  isAuthorized([Role.SUPER_ADMIN, Role.ADMIN, Role.DEVELOPER]),
  userController.deleteUserAccount
);

userRouter.post(
  USER_ROUTES.FORGOT_PASSWORD,
  validateSchema(forgotPassword),
  userController.forgotPasswordHandler
);

userRouter.post(
  USER_ROUTES.VERIFY_OTP,
  validateSchema(verifyOtp),
  userController.verifyOtpHandler
);

userRouter.post(
  USER_ROUTES.RESET_PASSWORD,
  validateSchema(resetPassword),
  userController.resetPasswordHandler
);

export default userRouter;