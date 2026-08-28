import { Router } from 'express';
import { getAnalyticsSummary } from '../controllers/analyticsController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/summary', getAnalyticsSummary);

export default router;
