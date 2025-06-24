import { Request, Response, NextFunction } from "express";
import { ResponseStatus, ResponseMessages } from "../../types/response.enums";
import * as portfolioModel from "../../model/v1/portfolio.model";
import { v4 as uuidv4 } from "uuid";
import { S3Service } from "../../services/s3.service";

export const createPortfoliosHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { portfolios } = request.body;

    const createdPortfolios = await portfolioModel.createPortfolios(
      userId,
      portfolios
    );

    return response.status(ResponseStatus.Created).json({
      message: ResponseMessages.Success,
      portfolios: createdPortfolios,
    });
  } catch (error: any) {
    return next(error);
  }
};

export const deletePortfoliosHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { portfolioIds } = request.body;

    await portfolioModel.deletePortfolios(userId, portfolioIds);

    return response.status(ResponseStatus.OK).json({
      message: ResponseMessages.Success,
    });
  } catch (error: any) {
    return next(error);
  }
};

export const getAssetUploadUrlHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { portfolioId, files } = request.body;

    // Generate presigned URLs for each file
    const urlPromises = files.map(
      async (file: { fileName: string; contentType: string }) => {
        const fileExtension = file.fileName.split(".").pop();
        const s3Key = `portfolios/${userId}/${portfolioId}/${uuidv4()}.${fileExtension}`;
        const presignedUrl = await S3Service.generatePresignedUrl(
          s3Key,
          file.contentType
        );

        return {
          fileName: file.fileName,
          presignedUrl,
          s3Key,
        };
      }
    );

    const urls = await Promise.all(urlPromises);

    return response.status(ResponseStatus.OK).json({
      urls,
    });
  } catch (error: any) {
    return next(error);
  }
};

export const saveAssetsHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { portfolioId, assets } = request.body;

    const savedAssets = await portfolioModel.saveAssets(
      userId,
      portfolioId,
      assets
    );

    return response.status(ResponseStatus.OK).json({
      message: ResponseMessages.Success,
      assets: savedAssets,
    });
  } catch (error: any) {
    return next(error);
  }
};
