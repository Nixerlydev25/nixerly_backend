import express from "express";
import * as authController from "../../controllers/v1/auth.controller";
import oAuthRouter from "./oauth/oauth.router";
import * as ValidationMiddleware from "../../middleware/validation";
import {
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
} from "../../schema/v1/auth.validation";
import { ROUTES } from "../../constants/routes.constants";

const authRouter = express();

// sign up & login handler
authRouter.post(
  ROUTES.AUTH.SIGNUP,
  ValidationMiddleware.bodyValidation(signUpSchema),
  authController.signupHandler
);

authRouter.post(
  ROUTES.AUTH.SIGNIN,
  ValidationMiddleware.bodyValidation(loginSchema),
  authController.signinHandler
);

//Forget Password Routes
authRouter.post(
  ROUTES.AUTH.RESET_PASSWORD,
  ValidationMiddleware.bodyValidation(resetPasswordSchema),
  authController.resetPasswordHandler
);

//Delete Account API
authRouter.get(ROUTES.AUTH.DELETE_ACCOUNT, authController.deleteMyAccount);

// refresh accessToken ( only for mobile apps )
authRouter.put(ROUTES.AUTH.REFRESH, authController.refreshAccessToken);

// reset password
authRouter.put(
  ROUTES.AUTH.PASSWORD_RECOVERY,
  ValidationMiddleware.bodyValidation(loginSchema),
  authController.passwordRecoveryHandler
);

// logout handler ( only for web app )
authRouter.get(ROUTES.AUTH.LOGOUT, authController.logoutHandler);

// auth check
authRouter.get(ROUTES.AUTH.IS_AUTHENTICATED, authController.isAuthenticated);

authRouter.use(ROUTES.AUTH.OAUTH, oAuthRouter);

export default authRouter;
