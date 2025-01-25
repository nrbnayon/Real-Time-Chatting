import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PetProfileService } from './petProfile.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import getFilePath from '../../../shared/getFilePath';

const createPetProfileIntoDb = catchAsync(
  async (req: Request, res: Response) => {
    const users = req.user;

    let image = getFilePath(req.files, 'images');

    const value = {
      image,
      ...req.body,
      user: users.id,
    };

    const result = await PetProfileService.createPetProfileIntoDb(value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Pet profile created successfully',
      data: result,
    });
  }
);

const updatePetProfileIntoDb = catchAsync(
  async (req: Request, res: Response) => {
    let image;
    if (req.files && 'image' in req.files && req.files.image[0]) {
      image = `/images/${req.files.image[0].filename}`;
    }

    const petId = req.params.id;
    const value = {
      image,
      ...req.body,
    };

    const result = await PetProfileService.updatePetProfile(petId, value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Pet profile updated successfully',
      data: result,
    });
  }
);

const getAllPetProfile = catchAsync(async (req: Request, res: Response) => {
  const users = req.user.id;

  // const users = req.params.id;

  const result = await PetProfileService.getAllPetProfile(users);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Pet profile retrieved successfully',
    data: result,
  });
});

export const PetProfileController = {
  createPetProfileIntoDb,
  getAllPetProfile,
  updatePetProfileIntoDb,
};
