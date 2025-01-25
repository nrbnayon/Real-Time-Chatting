import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SizeService } from './size.service';

const createColourToDB = catchAsync(async (req, res) => {
  const result = await SizeService.createColourToDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'size created successfully',
    data: result,
  });
});

const getAllColours = catchAsync(async (req, res) => {
  const result = await SizeService.getAllColours(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'size retrived successfully',
    data: result,
  });
});

const getSingleColour = catchAsync(async (req, res) => {
  const result = await SizeService.getSingleColour(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'size retrived successfully',
    data: result,
  });
});

const updateColourToDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SizeService.updateColour(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'size updated successfully',
    data: result,
  });
});

const deleteColour = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SizeService.deleteColour(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'size deleted successfully',
    data: result,
  });
});

export const SizeController = {
  createColourToDB,
  getAllColours,
  getSingleColour,
  updateColourToDB,
  deleteColour,
};
