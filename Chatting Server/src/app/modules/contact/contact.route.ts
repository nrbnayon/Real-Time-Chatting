import express from 'express';

import { ContactController } from './contact.controller';

const router = express.Router();

router.post('/send', ContactController.createContactInfo);

export const ContactRoutes = router;
