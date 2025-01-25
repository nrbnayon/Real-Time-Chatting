import { SortOrder } from 'mongoose';
import { ISize } from './size.interface';
import { Size } from './size.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const createColourToDB = async (payload: ISize) => {
  const result = await Size.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Colour not created!');
  }

  return result;
};

const getAllColours = async (query: Record<string, unknown>) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;
  const result = await Size.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Size.countDocuments();

  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total: count,
      totalPages: Math.ceil(count / size),
      currentPage: pages,
    },
  };
  return data;
};

const getSingleColour = async (id: string) => {
  const result = await Size.findById(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Colour not found!');
  }

  return result;
};

const updateColour = async (id: string, payload: Partial<ISize>) => {
  const result = await Size.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Colour not found!');
  }

  return result;
};

const deleteColour = async (id: string) => {
  const result = await Size.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Colour not found!');
  }

  return result;
};

export const SizeService = {
  createColourToDB,
  getAllColours,
  getSingleColour,
  updateColour,
  deleteColour,
};
