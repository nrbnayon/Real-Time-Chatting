import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-review',
  auth(USER_ROLES.USER),
  validateRequest(ReviewValidation.createReviewSchema),
  ReviewController.createReviewToDB
);

export const ReviewRoutes = router;
