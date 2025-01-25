import { INotification } from '../app/modules/notification/notification.interface';
import { Notification } from '../app/modules/notification/notification.model';

export const sendNotifications = async (data: any): Promise<INotification> => {
  const result = await Notification.create(data);

  //@ts-ignore
  const socketIo = global.io;

  if (data?.type === 'ADMIN') {
    socketIo.emit(`get-notification::${data?.type}`, result);
  } else {
    socketIo.emit(`get-notification::${data?.receiver}`, result);
  }

  // if (socketIo) {
  //   socketIo.emit(`get-notification::${data?.receiver}`, result);
  // }

  return result;
};
