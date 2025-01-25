import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IRetrun, ITerms } from './setting.interface';
import { Return, TermsAndCondition } from './setting.model';

const createTermsAndCondition = async (payload: Partial<ITerms>) => {
  try {
    const existingTerm = await TermsAndCondition.findOne();

    if (existingTerm) {
      Object.assign(existingTerm, payload);
      const updatedTerm = await existingTerm.save();
      return updatedTerm;
    } else {
      const newTerm = await TermsAndCondition.create(payload);
      return newTerm;
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Unable to create or update terms and condition.'
    );
  }
};

const getTermsAndCondition = async () => {
  const term = await TermsAndCondition.findOne();
  if (!term) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Terms and condition not found.');
  }
  return term;
};

const createReturnPolicy = async (payload: Partial<IRetrun>) => {
  try {
    const existingTerm = await Return.findOne();

    if (existingTerm) {
      Object.assign(existingTerm, payload);
      const updatedTerm = await existingTerm.save();
      return updatedTerm;
    } else {
      const newTerm = await Return.create(payload);
      return newTerm;
    }
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Unable to create or update return policy.'
    );
  }
};

const getReturnPolicy = async () => {
  const term = await Return.findOne();

  if (!term) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Return policy not found.');
  }

  return term;
};

export const SettingService = {
  createTermsAndCondition,
  createReturnPolicy,
  getTermsAndCondition,
  getReturnPolicy,
};
