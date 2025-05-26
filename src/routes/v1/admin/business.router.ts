import { Router } from "express";
import { ROUTES } from "../../../constants/routes.constants";
import { Role } from "@prisma/client";
import isAuthorized from "../../../middleware/isAuthorized";

const businessRouter = Router();

businessRouter.get(ROUTES.ADMIN.BUSINESS.GET_ALL, isAuthorized([Role.ADMIN]), adminController.getAllAdmins);

export default businessRouter;