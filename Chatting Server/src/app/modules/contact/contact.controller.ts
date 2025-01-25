import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ContactService } from './contact.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createContactInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.createContactInfo(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your message has been sent successfully. Thank you!',
    data: result,
  });
});

export const ContactController = {
  createContactInfo,
};
