import express, { NextFunction, Request, Response } from 'express';

import fileUploadHandler from '../../middlewares/fileUploadHandler';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BlogsValidation } from './blog.validation';
import { BlogController } from './blog.controller';

const router = express.Router();

router.post(
  '/create-blog',
  fileUploadHandler(),
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = BlogsValidation.createBlogsSchema.parse(
      JSON.parse(req.body.data)
    );
    return BlogController.createBlogIntoDb(req, res, next);
  }
);

router.get('/', BlogController.getAllBlogs);
router.get('/:id', BlogController.getSingleblog);

router.patch(
  '/:id',
  fileUploadHandler(),
  auth(USER_ROLES.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the body if it contains data in stringified JSON format
      let validatedData;
      if (req.body.data) {
        validatedData = BlogsValidation.updateBlogsSchema.parse(
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
      await BlogController.updateBlog(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', auth(USER_ROLES.ADMIN), BlogController.deleteBlog);

export const BlogRoutes = router;
