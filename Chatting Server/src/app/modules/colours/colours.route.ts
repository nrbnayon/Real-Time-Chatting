import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ColourController } from './colours.controller';

const router = express.Router();

router.post(
  '/create-colour',
  auth(USER_ROLES.ADMIN),
  ColourController.createColourToDB
);

router.get(
  '/get-colours',
  // auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  ColourController.getAllColours
);

router.get(
  '/:id',
  // auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  ColourController.getSingleColour
);

router.patch('/:id', auth(USER_ROLES.ADMIN), ColourController.updateColourToDB);

router.delete('/:id', auth(USER_ROLES.ADMIN), ColourController.deleteColour);

export const ColourRoutes = router;
