import { Router } from "express";
import GoogleAuthController from "../../../controllers/oauth/google.controller";
import { ROUTES } from "../../../constants/routes.constants";

const oAuthRouter = Router();

// // oAuth google
oAuthRouter.get(ROUTES.OAUTH.GOOGLE, (request, response) =>
  GoogleAuthController.redirectToGoogleAuth(request, response),
);

//callback
oAuthRouter.get(ROUTES.OAUTH.GOOGLE_CALLBACK, (request, response) =>
  GoogleAuthController.handleGoogleCallback(request, response),
);

export default oAuthRouter;
