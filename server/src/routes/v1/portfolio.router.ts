import { Router } from "express";
import { ROUTES } from "../../constants/routes.constants";
import isAuthorized from "../../middleware/isAuthorized";
import { Role } from "@prisma/client";
import * as ValidationMiddleware from "../../middleware/validation";
import * as portfolioController from "../../controllers/v1/portfolio.controller";
import {
  createPortfolios,
  deletePortfolios,
  getAssetUploadUrl,
  saveAssets,
} from "../../schema/v1/portfolio.validation";

const portfolioRouter = Router();

// Create one or many portfolios
portfolioRouter.post(
  ROUTES.PORTFOLIO.CREATE,
  isAuthorized([Role.WORKER]),
  ValidationMiddleware.bodyValidation(createPortfolios),
  portfolioController.createPortfoliosHandler
);

// Delete one or many portfolios
portfolioRouter.delete(
  ROUTES.PORTFOLIO.DELETE,
  isAuthorized([Role.WORKER]),
  ValidationMiddleware.bodyValidation(deletePortfolios),
  portfolioController.deletePortfoliosHandler
);

// Get presigned URL for portfolio assets
portfolioRouter.post(
  ROUTES.PORTFOLIO.GET_ASSET_UPLOAD_URL,
  isAuthorized([Role.WORKER]),
  ValidationMiddleware.bodyValidation(getAssetUploadUrl),
  portfolioController.getAssetUploadUrlHandler
);

// Save portfolio assets
portfolioRouter.post(
  ROUTES.PORTFOLIO.SAVE_ASSETS,
  isAuthorized([Role.WORKER]),
  ValidationMiddleware.bodyValidation(saveAssets),
  portfolioController.saveAssetsHandler
);

export default portfolioRouter; 