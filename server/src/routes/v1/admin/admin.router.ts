import { Router } from "express";
import { ROUTES } from "../../../constants/routes.constants";
import businessRouter from "./business.router";
import workerRouter from "./worker.router";
import jobRouter from "./job.router";
const adminRouter = Router();

adminRouter.use(ROUTES.ADMIN.BUSINESS.ROOT, businessRouter);

adminRouter.use(ROUTES.ADMIN.WORKER.ROOT, workerRouter);

adminRouter.use(ROUTES.ADMIN.JOB.ROOT, jobRouter);

export default adminRouter;
