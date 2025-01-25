import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { IPetProfile } from './petProfile.intertface';
import { PetProfile } from './petProfile.model';
import unlinkFile from '../../../shared/unlinkFile';

const createPetProfileIntoDb = async (payload: IPetProfile) => {
  const isExistUser = await User.findById(payload.user);

  if (!isExistUser) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'User does not exist, please register first'
    );
  }

  const isExistPet = await PetProfile.findOne({
    user: payload.user,
    name: payload.name,
  });

  if (isExistPet) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Pet is already exist!');
  }

  const result = await PetProfile.create(payload);
  return result;
};

const getAllPetProfile = async (userId: string) => {
  const result = await PetProfile.find({ user: userId }).populate({
    path: 'user',
    select: 'name',
  });

  return result;
};

const updatePetProfile = async (id: string, payload: IPetProfile) => {
  const isExistProfile = await PetProfile.findById(id);

  if (!isExistProfile) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'pet-profile not found');
  }

  if (payload.image && isExistProfile.image) {
    unlinkFile(isExistProfile.image);
  }
  const result = await PetProfile.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const PetProfileService = {
  createPetProfileIntoDb,
  getAllPetProfile,
  updatePetProfile,
};
