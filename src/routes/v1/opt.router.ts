import express from "express";
import * as optController from "../../controllers/v1/otp.controller";
import isAuthorized from "../../middleware/isAuthorized";
import { Roles } from "@prisma/client";

const otpRouter = express();

// Private Routes
otpRouter.post(
  "/send-otp",
  isAuthorized([
    Roles.USER,
    Roles.SUPER_ADMIN,
    Roles.ADMIN,
    Roles.ANALYST,
    Roles.DEVELOPER,
  ]),
  optController.sendOtpHandler
);

otpRouter.put(
  "/verify-otp",
  isAuthorized([
    Roles.USER,
    Roles.SUPER_ADMIN,
    Roles.ADMIN,
    Roles.ANALYST,
    Roles.DEVELOPER,
  ]),
  optController.verifyOtpHandler
);

export default otpRouter;
