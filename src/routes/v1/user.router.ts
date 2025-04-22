import { Router } from "express";
import * as userController from "../../controllers/v1/user.controller";
import isAuthorized from "../../middleware/isAuthorized";
import { Role } from "@prisma/client";

const userRouter = Router();

userRouter.get(
  "/current-user",
  isAuthorized(),
  userController.getCurrentUserDetails
);

userRouter.patch(
  "/update-user-details",
  isAuthorized([Role.USER, Role.ADMIN, Role.SUPER_ADMIN]),
  userController.updateUserDetailsHandler
);

userRouter.put(
  "/toggle-first-time-login",
  isAuthorized([
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.DEVELOPER,
    Role.MODERATOR,
    Role.USER,
    Role.GUEST
  ]),
  userController.toggleFirstTimeLogin
);

userRouter.delete(
  "/delete-account",
  isAuthorized(),
  userController.deleteUserAccount
);

userRouter.post("/forgot-password", userController.forgotPasswordHandler);

userRouter.post("/verify-otp", userController.verifyOtpHandler);

userRouter.post("/reset-password", userController.resetPasswordHandler);

export default userRouter;