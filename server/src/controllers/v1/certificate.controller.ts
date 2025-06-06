import { Request, Response, NextFunction } from "express";
import { ResponseStatus, ResponseMessages } from "../../types/response.enums";
import * as certificateModel from "../../model/v1/certificate.model";
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from "../../services/s3.service";

export const createCertificatesHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { certificates } = request.body;

    const createdCertificates = await certificateModel.createCertificates(userId, certificates);

    return response.status(ResponseStatus.Created).json({
      message: ResponseMessages.Success,
      certificates: createdCertificates,
    });
  } catch (error: any) {
    return next(error);
  }
};

export const deleteCertificatesHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { certificateIds } = request.body;

    await certificateModel.deleteCertificates(userId, certificateIds);

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
    const { certificateId, files } = request.body;

    // Generate presigned URLs for each file
    const urlPromises = files.map(async (file: { fileName: string; contentType: string }) => {
      const fileExtension = file.fileName.split('.').pop();
      const s3Key = `certificates/${userId}/${certificateId}/${uuidv4()}.${fileExtension}`;
      const presignedUrl = await S3Service.generatePresignedUrl(s3Key, file.contentType);
      
      return {
        fileName: file.fileName,
        presignedUrl,
        s3Key,
      };
    });

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
    const { certificateId, assets } = request.body;

    const savedAssets = await certificateModel.saveAssets(userId, certificateId, assets);

    return response.status(ResponseStatus.OK).json({
      message: ResponseMessages.Success,
      assets: savedAssets,
    });
  } catch (error: any) {
    return next(error);
  }
};
