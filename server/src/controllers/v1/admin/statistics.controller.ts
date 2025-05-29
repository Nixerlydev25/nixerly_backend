import { Request, Response } from 'express';
import * as statisticsModel from '../../../model/v1/admin/statistics.model';
import { ResponseStatus } from '../../../types/response.enums';

export const getAllStatistics = async (req: Request, res: Response) => {
  try {
    const { statistics } = await statisticsModel.getAllStatistics();

    return res.status(ResponseStatus.OK).json({
      message: 'Statistics fetched successfully',
      statistics: statistics,
    });
  } catch (error) {
    return res.status(ResponseStatus.BadRequest).json({
      message: 'Error fetching statistics',
      error: error,
    });
  }
};
