import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IColours } from './colours.interface';
import { Colour } from './colours.model';

const createColourToDB = async (payload: IColours) => {
  const result = await Colour.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Colour not created!');
  }

  return result;
};

const getAllColours = async () => {
  const result = await Colour.find().sort({ createdAt: -1 });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Colour not found!');
  }

  return result;
};

const getSingleColour = async (id: string) => {
  const result = await Colour.findById(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Colour not found!');
  }

  return result;
};

const updateColour = async (id: string, payload: Partial<IColours>) => {
  const isExist = await Colour.findOne({ colourName: payload.colourName });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Colour already exist!');
  }

  const result = await Colour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Colour not found!');
  }

  return result;
};

const deleteColour = async (id: string) => {
  const result = await Colour.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Colour not found!');
  }

  return result;
};

export const ColourService = {
  createColourToDB,
  getAllColours,
  getSingleColour,
  updateColour,
  deleteColour,
};
