import { Router } from "express";
import authRouter from "./auth.router";
import otpRouter from "./opt.router";
import roleRouter from "./role.router";
import restrictionsRouter from "./restrictions.router";
import userRouter from "./user.router";
import healthRouter from "./health.router";
import { ROUTES } from "../../constants/routes.constants";
import languageRouter from "./language.router";
import skillsRouter from "./skills.router";

// import subscriptionRouter from "./subscription.router";

const Api2 = Router();
// authentication. 
//TODO : unit test.
Api2.use(ROUTES.API.AUTH, authRouter);

// otp routes
//TODO : unit test.
Api2.use(ROUTES.API.OTP, otpRouter);

// roles routes
Api2.use(ROUTES.API.ROLES, roleRouter);

// Notification router for sending and saving notifications
Api2.use(ROUTES.API.RESTRICTIONS, restrictionsRouter);

// language routes
Api2.use(ROUTES.API.LANGUAGE, languageRouter);

// skills routes
Api2.use(ROUTES.API.SKILLS, skillsRouter);

Api2.use(ROUTES.API.USER, userRouter);

// health route for server status
//TODO : unit test.
Api2.use(ROUTES.API.HEALTH, healthRouter);

// subscription routes
// Api2.use(ROUTES.API.SUBSCRIPTION, subscriptionRouter);

export default Api2;
