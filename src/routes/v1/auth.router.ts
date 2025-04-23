import express from "express";
import * as authController from "../../controllers/v1/auth.controller";
import oAuthRouter from "./oauth/oauth.router";
import { validateSchema } from "../../middleware/validation";
import {
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
} from "../../schema/v1/auth.validation";
import { AUTH_ROUTES } from "../../constants/routes.constants";

const authRouter = express();

// sign up & login handler
authRouter.post(
  AUTH_ROUTES.SIGNUP,
  validateSchema(signUpSchema),
  authController.signupHandler
);
authRouter.post(
  AUTH_ROUTES.SIGNIN,
  validateSchema(loginSchema),
  authController.signinHandler
);

//Forget Password Routes
authRouter.post(
  AUTH_ROUTES.RESET_PASSWORD,
  validateSchema(resetPasswordSchema),
  authController.resetPasswordHandler
);

//Delete Account API
authRouter.get(AUTH_ROUTES.DELETE_ACCOUNT, authController.deleteMyAccount);

// refresh accessToken ( only for mobile apps )
authRouter.put(AUTH_ROUTES.REFRESH, authController.refreshAccessToken);

// reset password
authRouter.put(
  AUTH_ROUTES.PASSWORD_RECOVERY,
  validateSchema(loginSchema),
  authController.passwordRecoveryHandler
);

// logout handler ( only for web app )
authRouter.get(AUTH_ROUTES.LOGOUT, authController.logoutHandler);

// auth check
authRouter.get(AUTH_ROUTES.IS_AUTHENTICATED, authController.isAuthenticated);

authRouter.use(AUTH_ROUTES.OAUTH, oAuthRouter);

export default authRouter;
