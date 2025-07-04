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
import educationRouter from "./educations.router";
import experienceRouter from "./experience.router";
import workerRouter from "./worker.router";
import jobsRouter from "./jobs.router";
import businessRouter from "./business.router";
import adminRouter from "./admin/admin.router";
import reportRouter from "./reports.router";
import certificateRouter from "./certificates.router";
import portfolioRouter from "./portfolio.router";
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

// experience routes
Api2.use(ROUTES.API.EXPERIENCE, experienceRouter);

// education rotes
Api2.use(ROUTES.API.EDUCATION, educationRouter);

// worker routes
Api2.use(ROUTES.API.WORKER, workerRouter);

// business routes
Api2.use(ROUTES.API.BUSINESS, businessRouter);

// jobs routes
Api2.use(ROUTES.API.JOBS, jobsRouter);

// reports routes
Api2.use(ROUTES.API.REPORTS, reportRouter);

Api2.use(ROUTES.API.USER, userRouter);

// health route for server status
//TODO : unit test.
Api2.use(ROUTES.API.HEALTH, healthRouter);

// admin routes
Api2.use(ROUTES.API.ADMIN, adminRouter);

// certificate routes
Api2.use(ROUTES.API.CERTIFICATE, certificateRouter);

// portfolio routes
Api2.use(ROUTES.API.PORTFOLIO, portfolioRouter);

// subscription routes
// Api2.use(ROUTES.API.SUBSCRIPTION, subscriptionRouter);

export default Api2;
