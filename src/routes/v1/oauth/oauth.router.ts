import { Router } from "express";
import GoogleAuthController from "../../../controllers/oauth/google.controller";

const oAuthRouter = Router();

// // oAuth google
oAuthRouter.get("/google", (request, response) =>
  GoogleAuthController.redirectToGoogleAuth(request, response),
);

//callback
oAuthRouter.get("/google/callback", (request, response) =>
  GoogleAuthController.handleGoogleCallback(request, response),
);

export default oAuthRouter;
