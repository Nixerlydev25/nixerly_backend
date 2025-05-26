import { Router } from "express";
import * as restrictionController from "../../controllers/v1/restrictions.controller";
import isAuthorized from "../../middleware/isAuthorized";
import { Role } from "@prisma/client";
import { ROUTES } from "../../constants/routes.constants";

const restrictionsRouter = Router();

// Add a new restriction
restrictionsRouter.post(
  ROUTES.RESTRICTION.ROOT,
  isAuthorized([Role.SUPER_ADMIN, Role.ADMIN, Role.DEVELOPER]),
  restrictionController.addRestriction
);

// Get all restrictions
restrictionsRouter.get(
  ROUTES.RESTRICTION.ROOT,
  isAuthorized([Role.SUPER_ADMIN, Role.ADMIN]),
  restrictionController.getAllRestrictions
);

// Get restrictions for a specific user by userId
restrictionsRouter.get(
  ROUTES.RESTRICTION.USER_RESTRICTIONS,
  isAuthorized([Role.SUPER_ADMIN, Role.ADMIN]),
  restrictionController.getUserRestrictions
);

// Remove a restriction
restrictionsRouter.delete(
  ROUTES.RESTRICTION.ROOT,
  isAuthorized([Role.SUPER_ADMIN, Role.ADMIN, Role.DEVELOPER]),
  restrictionController.removeRestriction
);

export default restrictionsRouter;
