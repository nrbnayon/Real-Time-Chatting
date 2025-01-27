// src\app\modules\user\user.route.ts
import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.post(
  '/create-user',
  fileUploadHandler(),

  (req: Request, res: Response, next: NextFunction) => {
    const userData =
      typeof req.body.data === 'string'
        ? JSON.parse(req.body.data)
        : req.body.data;

    req.body = UserValidation.createUserZodSchema.parse(userData);
    return UserController.createUser(req, res, next);
  }
);

router.patch(
  '/update-profile',
  fileUploadHandler(),
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the body if it contains data in stringified JSON format
      let validatedData;
      if (req.body.data) {
        validatedData = UserValidation.updateZodSchema.parse(
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
      await UserController.updateProfile(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/user',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  UserController.getUserProfile
);

router.get('/get-all-users', auth(USER_ROLES.ADMIN, USER_ROLES.USER), UserController.getAllUser);

router.get(
  '/get-all-users/:id',
  auth(USER_ROLES.ADMIN),
  UserController.getSingleUser
);

router.get(
  '/profile',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  UserController.getUserProfile
);

// Get online users route
router.get(
  '/online-users',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  UserController.getOnlineUsers
);

// Update online status route
router.patch(
  '/online-status',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  UserController.updateOnlineStatus
);

export const UserRoutes = router;
