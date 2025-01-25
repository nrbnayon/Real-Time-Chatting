import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

router.get('/get-total-statistics', DashboardController.totalStatistics);
router.get('/get-total-earning-chart', DashboardController.getEarningChartData);
router.get(
  '/get-total-recent-transaction',
  DashboardController.getRecentTransaction
);

export const DashboardRoutes = router;
