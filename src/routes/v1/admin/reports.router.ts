import { Role } from "@prisma/client";
import { Router } from "express";
import isAuthorized from "../../../middleware/isAuthorized";
import { ROUTES } from "../../../constants/routes.constants";
import * as reportController from '../../../controllers/v1/admin/report.controller';

const reportsRouter = Router();


reportsRouter.get(
    ROUTES.ADMIN.REPORT.GET_ALL,
    isAuthorized([Role.ADMIN]),
    reportController.getAllReports
);


export default reportsRouter;