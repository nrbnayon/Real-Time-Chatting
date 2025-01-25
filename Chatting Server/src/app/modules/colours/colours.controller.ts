import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ColourService } from './colours.service';

const createColourToDB = catchAsync(async (req, res) => {
  const result = await ColourService.createColourToDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Colour created successfully',
    data: result,
  });
});

const getAllColours = catchAsync(async (req, res) => {
  const result = await ColourService.getAllColours();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Colours retrived successfully',
    data: result,
  });
});

const getSingleColour = catchAsync(async (req, res) => {
  const result = await ColourService.getSingleColour(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Colour retrived successfully',
    data: result,
  });
});

const updateColourToDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ColourService.updateColour(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Colour updated successfully',
    data: result,
  });
});

const deleteColour = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ColourService.deleteColour(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Colour deleted successfully',
    data: result,
  });
});

export const ColourController = {
  createColourToDB,
  getAllColours,
  getSingleColour,
  updateColourToDB,
  deleteColour,
};
