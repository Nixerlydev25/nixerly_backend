import express from "express";
import * as optController from "../../controllers/v1/otp.controller";
import isAuthorized from "../../middleware/isAuthorized";
import { Role } from "@prisma/client";
import { ROUTES } from "../../constants/routes.constants";

const otpRouter = express();

// Private Routes
otpRouter.post(
  ROUTES.OTP.SEND_OTP,
  isAuthorized([
    Role.WORKER,
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.DEVELOPER,
  ]),
  optController.sendOtpHandler
);

otpRouter.put(
  ROUTES.OTP.VERIFY_OTP,
  isAuthorized([
    Role.WORKER,
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.DEVELOPER,
  ]),
  optController.verifyOtpHandler
);

export default otpRouter;
