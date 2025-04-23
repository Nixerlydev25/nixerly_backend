import { Router } from "express";
import authRouter from "./auth.router";
import otpRouter from "./opt.router";
import roleRouter from "./role.router";
import restrictionsRouter from "./restrictions.router";
import userRouter from "./user.router";
import healthRouter from "./health.router";
import subscriptionRouter from "./subscription.router";
import { API_ROUTES } from "../../constants/routes.constants";

const Api2 = Router();
// authentication. 
//TODO : unit test.
Api2.use(API_ROUTES.AUTH, authRouter);

// otp routes
//TODO : unit test.
Api2.use(API_ROUTES.OTP, otpRouter);

// roles routes
Api2.use(API_ROUTES.ROLES, roleRouter);

// Notification router for sending and saving notifications
Api2.use(API_ROUTES.RESTRICTIONS, restrictionsRouter);

Api2.use(API_ROUTES.USER, userRouter);

// health route for server status
//TODO : unit test.
Api2.use(API_ROUTES.HEALTH, healthRouter);

// subscription routes
Api2.use(API_ROUTES.SUBSCRIPTION, subscriptionRouter);

export default Api2;
