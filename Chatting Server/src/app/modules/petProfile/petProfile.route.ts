import express, { NextFunction, Request, Response } from 'express';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { PetProfileValidation } from './petProfile.validation';
import { PetProfileController } from './petProfile.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-profile',
  fileUploadHandler(),
  auth(USER_ROLES.USER),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = PetProfileValidation.createPetProfileSchema.parse(
      JSON.parse(req.body.data)
    );
    return PetProfileController.createPetProfileIntoDb(req, res, next);
  }
);

router.get(
  '/get-profile',
  auth(USER_ROLES.USER),
  PetProfileController.getAllPetProfile
);

router.patch(
  '/:id',
  fileUploadHandler(),
  auth(USER_ROLES.USER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the body if it contains data in stringified JSON format
      let validatedData;
      if (req.body.data) {
        validatedData = PetProfileValidation.updatePetProfileSchema.parse(
          JSON.parse(req.body.data)
        );
      }

      // Handle image updates if files are uploaded
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // Assuming `fileUploadHandler` stores files in req.files
        const uploadedFiles = req.files.map((file: any) => file.path);
        validatedData = {
          ...validatedData,
          image: uploadedFiles[0], // Update the specific image field
        };
      }

      // Pass the validated data to the controller
      req.body = validatedData;
      await PetProfileController.updatePetProfileIntoDb(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

export const PetProfileRoutes = router;
