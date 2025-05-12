import { Request, Response, NextFunction } from "express";
import { ResponseStatus } from "../../types/response.enums";
import * as certificateModel from "../../model/v1/certificate.model";

export const createCertificateHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const data = request.body;
    const created = await certificateModel.createCertificate(userId, data);
    response.status(ResponseStatus.Created).json({
      success: true,
      message: "Certificate created successfully",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerCertificatesHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { workerId } = request.params;
    const certificates = await certificateModel.getWorkerCertificates(workerId);
    response.status(ResponseStatus.OK).json({
      success: true,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCertificateHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const data = request.body;
    const updated = await certificateModel.updateCertificate(userId, data);
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Certificate updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCertificateHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userId } = request.user;
    const { id } = request.body;
    await certificateModel.deleteCertificate(userId, id);
    response.status(ResponseStatus.OK).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
