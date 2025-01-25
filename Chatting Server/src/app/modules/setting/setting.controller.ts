import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SettingService } from './setting.service';

const createTermsAndCondition = catchAsync(async (req, res) => {
  const result = await SettingService.createTermsAndCondition(req.body);
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Terms-and-condition updated successfully',
    data: result,
  });
});

const getTermsAndCondition = catchAsync(async (req, res) => {
  const result = await SettingService.getTermsAndCondition();
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Terms-and-condition retrived successfully',
    data: result,
  });
});

const createReturnPolicy = catchAsync(async (req, res) => {
  const result = await SettingService.createReturnPolicy(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Return-policy updated successfully',
    data: result,
  });
});

const getReturnPolicy = catchAsync(async (req, res) => {
  const result = await SettingService.getReturnPolicy();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Return policy retrived successfully',
    data: result,
  });
});

export const SettingController = {
  createTermsAndCondition,
  createReturnPolicy,
  getTermsAndCondition,
  getReturnPolicy,
};
