import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ReviewService } from './review.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createReviewToDB = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const value = {
    ...req.body,
    user: userId,
  };

  const result = await ReviewService.createReviewToDB(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Review&Ratings created successfully',
    data: result,
  });
});

export const ReviewController = {
  createReviewToDB,
};
