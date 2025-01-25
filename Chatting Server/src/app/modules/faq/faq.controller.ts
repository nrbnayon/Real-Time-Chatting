import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';

import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { FaqService } from './faq.service';

const createFaqToDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqService.createFaqToDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Faq created successfully',
    data: result,
  });
});

const getAllFaq = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqService.getAllFaq(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Faq retrived successfully',
    data: result,
  });
});

const getSingleFaq = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqService.getSingleFaq(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Single Faq retrived successfully',
    data: result,
  });
});

const updatedFaq = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqService.updateFaq(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Faq updated successfully',
    data: result,
  });
});

const deletedFaq = catchAsync(async (req: Request, res: Response) => {
  const result = await FaqService.deleteFaq(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Faq deleted successfully',
    data: result,
  });
});

export const FaqController = {
  createFaqToDB,
  getAllFaq,
  getSingleFaq,
  updatedFaq,
  deletedFaq,
};
