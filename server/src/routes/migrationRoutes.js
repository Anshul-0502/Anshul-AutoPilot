import { Router } from 'express';
import { getMigrationStatus, importLegacyData } from '../controllers/migrationController.js';
import authenticate from '../middleware/authenticate.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticate);

const migrationLimiter = rateLimiter({
  windowMs: 60000,
  max: 5,
  message: 'Too many migration attempts. Please try again later.',
  keyPrefix: 'migration'
});

router.get('/status', getMigrationStatus);
router.post('/import', migrationLimiter, importLegacyData);

export default router;
