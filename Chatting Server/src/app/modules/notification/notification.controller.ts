import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { NotificationService } from './notification.service';
import { Request, Response } from 'express';

const getNotificationToDb = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await NotificationService.getNotificationToDb(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Notification retrived successfully',
    data: result,
  });
});

const adminNotificationFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationService.adminNotification(req.query);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Notifications Retrieved Successfully',
      data: result,
    });
  }
);

const readNotification = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await NotificationService.readNotification(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Notification Read Successfully',
    data: result,
  });
});

const adminReadNotification = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationService.adminReadNotification();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Notification Read Successfully',
      data: result,
    });
  }
);

const deleteAllNotifications = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationService.deleteAllNotifications();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Notification Deleted Successfully',
      data: result,
    });
  }
);

export const NotificationController = {
  getNotificationToDb,
  adminNotificationFromDB,
  readNotification,
  adminReadNotification,
  deleteAllNotifications,
};
