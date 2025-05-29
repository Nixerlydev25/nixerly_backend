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

export const toggleBusinessBlock = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try { 
    const { businessId } = request.params;
    await businessModel.toggleBusinessBlock(businessId);
    response.status(ResponseStatus.OK).json({
      message: 'Business blocked successfully',
    });
  } catch (error) {
    next(error);
  }
};
