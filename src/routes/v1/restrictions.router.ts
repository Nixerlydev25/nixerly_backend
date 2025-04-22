import { Router } from "express";
import * as restrictionController from "../../controllers/v1/restrictions.controller";
import isAuthorized from "../../middleware/isAuthorized";
import { Roles } from "@prisma/client";

const restrictionsRouter = Router();

// Add a new restriction
restrictionsRouter.post(
  "/",
  isAuthorized([Roles.SUPER_ADMIN, Roles.ADMIN, Roles.DEVELOPER]),
  restrictionController.addRestriction
);

// Get all restrictions
restrictionsRouter.get(
  "/",
  isAuthorized([Roles.SUPER_ADMIN, Roles.ADMIN]),
  restrictionController.getAllRestrictions
);

// Get restrictions for a specific user by userId
restrictionsRouter.get(
  "/:userId",
  isAuthorized([Roles.SUPER_ADMIN, Roles.ADMIN]),
  restrictionController.getUserRestrictions
);

// Remove a restriction
restrictionsRouter.delete(
  "/",
  isAuthorized([Roles.SUPER_ADMIN, Roles.ADMIN, Roles.DEVELOPER]),
  restrictionController.removeRestriction
);

export default restrictionsRouter;
