import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { DashboardService } from './dashboard.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const totalStatistics = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.totalStatistics();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Total-Statistics retrieved successfully',
    data: result,
  });
});

const getEarningChartData = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getEarningChartData();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Total earning retrieved successfully',
    data: result,
  });
});

const getRecentTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getRecentTransaction(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Recent transaction retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  totalStatistics,
  getEarningChartData,
  getRecentTransaction,
};
