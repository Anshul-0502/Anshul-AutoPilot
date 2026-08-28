import { Router } from 'express';
import { getFocusSessions, createFocusSession } from '../controllers/focusController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.route('/')
  .get(getFocusSessions)
  .post(createFocusSession);

export default router;
