import { Router } from "express";
import { ROUTES } from "../../constants/routes.constants";
import isAuthorized from "../../middleware/isAuthorized";
import { Role } from "@prisma/client";
import * as ValidationMiddleware from "../../middleware/validation";
import * as certificateController from "../../controllers/v1/certificate.controller";
import {
  createCertificates,
  deleteCertificates,
  getAssetUploadUrl,
  saveAssets,
} from "../../schema/v1/certificate.validation";

const certificateRouter = Router();

// Create one or many certificates
certificateRouter.post(
  ROUTES.CERTIFICATE.CREATE,
  isAuthorized([Role.WORKER]),
  ValidationMiddleware.bodyValidation(createCertificates),
  certificateController.createCertificatesHandler
);

// Delete one or many certificates
certificateRouter.delete(
  ROUTES.CERTIFICATE.DELETE,
  isAuthorized([Role.WORKER]),
  ValidationMiddleware.bodyValidation(deleteCertificates),
  certificateController.deleteCertificatesHandler
);

// Get presigned URL for certificate assets
certificateRouter.post(
  ROUTES.CERTIFICATE.GET_ASSET_UPLOAD_URL,
  isAuthorized([Role.WORKER]),
  ValidationMiddleware.bodyValidation(getAssetUploadUrl),
  certificateController.getAssetUploadUrlHandler
);

// Save certificate assets
certificateRouter.post(
  ROUTES.CERTIFICATE.SAVE_ASSETS,
  isAuthorized([Role.WORKER]),
  ValidationMiddleware.bodyValidation(saveAssets),
  certificateController.saveAssetsHandler
);

export default certificateRouter;
