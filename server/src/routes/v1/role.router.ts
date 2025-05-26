import { Router } from "express";
import * as routesController from "../../controllers/v1/role.controller";
import isAuthorized from "../../middleware/isAuthorized";
import { Role } from "@prisma/client";

const router = Router();

router.put(
  "/:id",
  isAuthorized(
    [Role.SUPER_ADMIN, Role.ADMIN, Role.DEVELOPER]
  ),
  routesController.updateUserRole
);

export default router;
