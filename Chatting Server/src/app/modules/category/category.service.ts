import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategoryToDB = async (payload: Partial<ICategory>) => {
  const result = await Category.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category not created!');
  }

  return result;
};

const getAllCategory = async () => {
  const result = await Category.find({ status: 'active' }).sort({
    createdAt: -1,
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found!');
  }

  return result;
};

const getSingleCategory = async (id: string) => {
  const result = await Category.findById(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found!');
  }

  return result;
};

const updateCategory = async (id: string, payload: Partial<ICategory>) => {
  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found!');
  }

  return result;
};

const deleteCategory = async (id: string) => {
  const result = await Category.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found!');
  }

  return result;
};

export const CategoryService = {
  createCategoryToDB,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
