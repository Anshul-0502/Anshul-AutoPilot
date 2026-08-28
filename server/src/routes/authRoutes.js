import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getMe } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';
import authenticate from '../middleware/authenticate.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const authLimiter = rateLimiter({
  windowMs: 60000,
  max: 10,
  message: 'Too many login or registration attempts. Please try again in a minute.',
  keyPrefix: 'auth'
});

router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/logout', authenticate, logoutUser);
router.get('/me', authenticate, getMe);

export default router;
