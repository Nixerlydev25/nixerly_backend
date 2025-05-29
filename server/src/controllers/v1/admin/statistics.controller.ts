import { Request, Response } from 'express';
import * as statisticsModel from '../../../model/v1/admin/statistics.model';
import { ResponseStatus } from '../../../types/response.enums';

export const getAllStatistics = async (request: Request, response: Response) => {
  try {
    const { statistics } = await statisticsModel.getAllStatistics();

    return response.status(ResponseStatus.OK).json({
      message: 'Statistics fetched successfully',
      statistics: statistics,
    });
  } catch (error) {
    return response.status(ResponseStatus.BadRequest).json({
      message: 'Error fetching statistics',
      error: error,
    });
  }
};
