import { Router } from "express";
import { Role } from "@prisma/client";
import { 
  createUserLanguageSchema, 
  updateUserLanguageSchema, 
  deleteUserLanguageSchema,
  updateAllLanguagesSchema
} from "../../schema/v1/languagues.validation";
import { ROUTES } from "../../constants/routes.constants";
import * as userLanguageController from "../../controllers/v1/language.controller";
import isAuthorized from "../../middleware/isAuthorized";
import * as ValidationMiddleware from "../../middleware/validation";

const userLanguageRouter = Router();

userLanguageRouter.post(
  ROUTES.LANGUAGE.CREATE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(createUserLanguageSchema),
  userLanguageController.createUserLanguageHandler
);

userLanguageRouter.patch(
  ROUTES.LANGUAGE.UPDATE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(updateUserLanguageSchema),
  userLanguageController.updateUserLanguageHandler
);

userLanguageRouter.delete(
  ROUTES.LANGUAGE.DELETE,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(deleteUserLanguageSchema),
  userLanguageController.deleteUserLanguageHandler
);

userLanguageRouter.put(
  ROUTES.LANGUAGE.UPDATE_ALL,
  isAuthorized([Role.WORKER, Role.ADMIN]),
  ValidationMiddleware.bodyValidation(updateAllLanguagesSchema),
  userLanguageController.updateAllUserLanguagesHandler
);

export default userLanguageRouter;