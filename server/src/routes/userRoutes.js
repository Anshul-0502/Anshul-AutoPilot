import { Router } from 'express';
import { getProfile, updateProfile, getPreferences, updatePreferences } from '../controllers/userController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

// Secure all user profile and preference endpoints
router.use(authenticate);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.route('/preferences')
  .get(getPreferences)
  .put(updatePreferences);

export default router;
