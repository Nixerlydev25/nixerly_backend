import express from "express";
import * as authController from "../../controllers/v1/auth.controller";
import oAuthRouter from "./oauth/oauth.router";

const authRouter = express();

// sign up & login handler
authRouter.post("/signup", authController.signupHandler);
authRouter.post("/signin", authController.signinHandler);

//Forget Password Routes
authRouter.post("/reset-password", authController.resetPasswordHandler);

//Delete Account API
authRouter.get("/deleteMyAccount", authController.deleteMyAccount);

// refresh accessToken ( only for mobile apps )
authRouter.put("/refresh", authController.refreshAccessToken); 

// reset password
authRouter.put("/passwordRecovery", authController.passwordRecoveryHandler);

// logout handler ( only for web app )
authRouter.get("/logout", authController.logoutHandler);

// auth check
authRouter.get("/isauthenticated", authController.isAuthenticated);

authRouter.use("/oauth", oAuthRouter);

export default authRouter;
 