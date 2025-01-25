import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IFaq } from './faq.interface';
import { Faq } from './faq.model';
import { SortOrder } from 'mongoose';

const createFaqToDB = async (payload: Partial<IFaq>) => {
  const result = await Faq.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Faq not created!');
  }
  return result;
};

const getAllFaq = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
    ...filterData
  } = query;

  // Build search conditions
  const conditions: Record<string, unknown> = {};

  if (searchTerm) {
    conditions.$or = [
      { answer: { $regex: searchTerm, $options: 'i' } },
      { question: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  if (Object.keys(filterData).length > 0) {
    conditions.$and = Object.entries(filterData).map(([field, value]) => ({
      [field]: value,
    }));
  }

  // Pagination setup
  const pageNumber = Math.max(1, parseInt(page as string, 10));
  const pageSize = Math.max(1, parseInt(limit as string, 10));
  const skip = (pageNumber - 1) * pageSize;

  // Sorting setup
  const sortOrder = order === 'desc' ? -1 : 1;

  const sortCondition: { [key: string]: SortOrder } = {
    [sortBy as string]: sortOrder,
  };

  // Query database
  const [result, count] = await Promise.all([
    Faq.find(conditions).sort(sortCondition).skip(skip).limit(pageSize),
    Faq.countDocuments(conditions),
  ]);

  // Prepare response
  return {
    result,
    meta: {
      page: pageNumber,
      limit: pageSize,
      total: count,
      totalPages: Math.ceil(count / pageSize),
    },
  };
};

const getSingleFaq = async (id: string) => {
  const result = await Faq.findById(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Faq not found!');
  }

  return result;
};

const updateFaq = async (id: string, payload: Partial<IFaq>) => {
  const result = await Faq.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Faq not found!');
  }

  return result;
};

const deleteFaq = async (id: string) => {
  const result = await Faq.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Faq not found!');
  }

  return result;
};

export const FaqService = {
  createFaqToDB,
  getAllFaq,
  getSingleFaq,
  updateFaq,
  deleteFaq,
};
