import { NextFunction, Request, Response } from 'express';
import * as businessModel from '../../../model/v1/admin/business.model';
import { ResponseStatus } from '../../../types/response.enums';

export const getAllBusinessUsersAdmins = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const filters = request.query;
    const {
      businesses,
      pagination: { totalCount, totalPages, currentPage, hasMore },
    } = await businessModel.getAllBusinesses(filters as any);

    response.status(ResponseStatus.OK).json({
      pagination: {
        totalCount,
        totalPages,
        currentPage,
        hasMore,
      },
      businesses: businesses,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { businessId } = request.params;
    const business = await businessModel.getBusinessById(businessId);
    return response.status(ResponseStatus.OK).json({
      message: 'Business fetched successfully',
      data: business,
    });
  } catch (error: any) {
    next(error);
  }
};

export const blockBusiness = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { businessId } = request.params;

    await businessModel.blockBusiness(businessId);

    response.status(ResponseStatus.OK).json({
      message: 'Business blocked successfully',
    });
  } catch (error: any) {
    next(error);
  }
};

export const unblockBusiness = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { businessId } = request.params;
    await businessModel.unblockBusiness(businessId);

    response.status(ResponseStatus.OK).json({
      message: 'Business unblocked successfully',
    });
  } catch (error: any) {
    next(error);
  }
};
