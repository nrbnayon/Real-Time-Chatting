import express from 'express';
import { SubscriberController } from './subscriber.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-subscriber',
  auth(USER_ROLES.USER),
  SubscriberController.SubscriberIntoDb
);

export const SubscriberRoutes = router;
