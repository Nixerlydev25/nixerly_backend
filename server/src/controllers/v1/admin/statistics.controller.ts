import { Request, Response } from 'express';
import * as statisticsModel from '../../../model/v1/admin/statistics.model';

export const getAllStatistics = async (req: Request, res: Response) => {
  try {
    const { statistics } = await statisticsModel.getAllStatistics();

    return res.status(200).json({
      message: 'Statistics fetched successfully',
      statistics: statistics,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching statistics',
      error: error,
    });
  }
};
