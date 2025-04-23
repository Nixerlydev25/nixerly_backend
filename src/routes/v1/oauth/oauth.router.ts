import { Router } from "express";
import GoogleAuthController from "../../../controllers/oauth/google.controller";
import { OAUTH_ROUTES } from "../../../constants/routes.constants";

const oAuthRouter = Router();

// // oAuth google
oAuthRouter.get(OAUTH_ROUTES.GOOGLE, (request, response) =>
  GoogleAuthController.redirectToGoogleAuth(request, response),
);

//callback
oAuthRouter.get("/google/callback", (request, response) =>
  GoogleAuthController.handleGoogleCallback(request, response),
);

export default oAuthRouter;
