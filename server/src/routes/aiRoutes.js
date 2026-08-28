import { Router } from 'express';
import { getChatHistory, saveChatMessage, clearChatHistory } from '../controllers/aiController.js';
import authenticate from '../middleware/authenticate.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticate);

const aiLimiter = rateLimiter({
  windowMs: 60000,
  max: 20,
  message: 'Too many messages sent. Please slow down and try again.',
  keyPrefix: 'ai'
});

router.route('/chat')
  .get(getChatHistory)
  .post(aiLimiter, saveChatMessage)
  .delete(clearChatHistory);

export default router;
