import express from 'express';

import validateRequest from '../../middlewares/validateRequest';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { FaqValidation } from './faq.validation';
import { FaqController } from './faq.controller';

const router = express.Router();

router.post(
  '/create-faq',
  //   auth(USER_ROLES.ADMIN),
  validateRequest(FaqValidation.createFaqSchema),
  FaqController.createFaqToDB
);

router.patch(
  '/:id',
  //   auth(USER_ROLES.ADMIN),
  validateRequest(FaqValidation.updatedFaqSchema),
  FaqController.updatedFaq
);

router.get('/', FaqController.getAllFaq);

router.get('/:id', FaqController.getSingleFaq);

router.delete(
  '/:id',
  //  auth(USER_ROLES.ADMIN),
  FaqController.deletedFaq
);

export const FaqRoutes = router;
