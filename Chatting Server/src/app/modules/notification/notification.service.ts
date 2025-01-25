import { JwtPayload } from 'jsonwebtoken';
import { Notification } from './notification.model';
import { SortOrder } from 'mongoose';

const getNotificationToDb = async (user: JwtPayload) => {
  const result = await Notification.find({ receiver: user.id });

  const unredCount = await Notification.countDocuments({
    receiver: user.id,
    read: false,
  });

  const data = {
    result,
    unredCount,
  };

  return data;
};

const readNotification = async (user: JwtPayload) => {
  const result = await Notification.updateMany(
    { receiver: user.id },
    { read: true }
  );
  return result;
};

const adminNotification = async (query: Record<string, unknown>) => {
  const { page, limit } = query;

  // Apply filter conditions

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Set default sort order to show new data first

  const result = await Notification.find()

    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const total = await Notification.countDocuments();
  const unread = await Notification.countDocuments({ read: false });

  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
      unread,
    },
  };
  return data;
};

const adminReadNotification = async () => {
  const result = await Notification.updateMany(
    { type: 'ADMIN' },
    { read: true }
  );
  return result;
};

const deleteAllNotifications = async () => {
  const result = await Notification.deleteMany({});
  return result;
};

export const NotificationService = {
  getNotificationToDb,
  readNotification,
  adminNotification,
  adminReadNotification,
  deleteAllNotifications,
};
