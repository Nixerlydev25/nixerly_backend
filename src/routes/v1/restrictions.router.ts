import { Router } from "express";
import * as restrictionController from "../../controllers/v1/restrictions.controller";
import isAuthorized from "../../middleware/isAuthorized";
import { Role } from "@prisma/client";
import { RESTRICTION_ROUTES } from "../../constants/routes.constants";

const restrictionsRouter = Router();

// Add a new restriction
restrictionsRouter.post(
  RESTRICTION_ROUTES.ROOT,
  isAuthorized([Role.SUPER_ADMIN, Role.ADMIN, Role.DEVELOPER]),
  restrictionController.addRestriction
);

// Get all restrictions
restrictionsRouter.get(
  RESTRICTION_ROUTES.ROOT,
  isAuthorized([Role.SUPER_ADMIN, Role.ADMIN]),
  restrictionController.getAllRestrictions
);

// Get restrictions for a specific user by userId
restrictionsRouter.get(
  "/:userId",
  isAuthorized([Role.SUPER_ADMIN, Role.ADMIN]),
  restrictionController.getUserRestrictions
);

// Remove a restriction
restrictionsRouter.delete(
  "/",
  isAuthorized([Role.SUPER_ADMIN, Role.ADMIN, Role.DEVELOPER]),
  restrictionController.removeRestriction
);

export default restrictionsRouter;
