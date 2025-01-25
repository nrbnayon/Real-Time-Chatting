import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { SizeController } from './size.controller';

const router = express.Router();

router.post(
  '/create-size',
  auth(USER_ROLES.ADMIN),
  SizeController.createColourToDB
);

router.get(
  '/get-size',
  //   auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  SizeController.getAllColours
);

router.get(
  '/:id',
  //   auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  SizeController.getSingleColour
);

router.patch('/:id', auth(USER_ROLES.ADMIN), SizeController.updateColourToDB);

router.delete('/:id', auth(USER_ROLES.ADMIN), SizeController.deleteColour);

export const SizeRoutes = router;
