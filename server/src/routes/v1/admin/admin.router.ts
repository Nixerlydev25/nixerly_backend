import { Router } from 'express';
import { ROUTES } from '../../../constants/routes.constants';
import businessRouter from './business.router';
import workerRouter from './worker.router';
import jobRouter from './job.router';
import statisticsRouter from './statistics.router';
const adminRouter = Router();

adminRouter.use(ROUTES.ADMIN.BUSINESS.ROOT, businessRouter);

adminRouter.use(ROUTES.ADMIN.WORKER.ROOT, workerRouter);

adminRouter.use(ROUTES.ADMIN.JOB.ROOT, jobRouter);

adminRouter.use(ROUTES.ADMIN.STATISTICS.ROOT, statisticsRouter);

export default adminRouter;
