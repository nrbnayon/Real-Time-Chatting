import express from 'express';

import validateRequest from '../../middlewares/validateRequest';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { CategoryValidation } from './category.validation';
import { CategoryController } from './category.controller';

const router = express.Router();

router.post(
  '/create-category',
  auth(USER_ROLES.ADMIN),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategoryToDB
);

router.get(
  '/',
  // auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  CategoryController.getAllCategory
);

router.get(
  '/:id',
  // auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  CategoryController.getSingleCategory
);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  validateRequest(CategoryValidation.updatedCategorySchema),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
  auth(USER_ROLES.ADMIN),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
