import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SubscriberService } from './subscriber.service';

const SubscriberIntoDb = catchAsync(async (req, res) => {
  const subscriber = await SubscriberService.subscriberIntoDb(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscriber created successfully',
    data: subscriber,
  });
});

export const SubscriberController = {
  SubscriberIntoDb,
};
