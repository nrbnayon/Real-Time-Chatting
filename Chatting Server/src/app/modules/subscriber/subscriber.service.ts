import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ISubscriber } from './subscriber.interface';
import { Subscriber } from './subscriber.model';

const subscriberIntoDb = async (payload: Partial<ISubscriber>) => {
  const isExistSubscriber = await Subscriber.findOne({
    email: payload.email,
  });
  if (isExistSubscriber) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Subscriber already exist');
  }

  const result = await Subscriber.create(payload);
  return result;
};

export const SubscriberService = {
  subscriberIntoDb,
};
