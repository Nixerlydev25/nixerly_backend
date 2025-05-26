import { Router } from "express";
import { ROUTES } from "../../../constants/routes.constants";

const adminRouter = Router();

adminRouter.use(ROUTES.ADMIN.BUSINESS.ROOT, adminController.getAllAdmins);

export default adminRouter;