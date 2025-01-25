import express from 'express';
import { SettingController } from './setting.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-terms',
  auth(USER_ROLES.ADMIN),
  SettingController.createTermsAndCondition
);
router.get('/get-terms', SettingController.getTermsAndCondition);

router.post(
  '/create-return-policy',
  auth(USER_ROLES.ADMIN),
  SettingController.createReturnPolicy
);

router.get('/get-return-policy', SettingController.getReturnPolicy);

export const SettingRoutes = router;
