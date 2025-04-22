import { Router } from "express";
import * as routesController from "../../controllers/v1/role.controller";
import isAuthorized from "../../middleware/isAuthorized";
import { Roles } from "@prisma/client";

const router = Router();

router.put(
  "/:id",
  isAuthorized(
    [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.DEVELOPER]
  ),
  routesController.updateUserRole
);

export default router;
