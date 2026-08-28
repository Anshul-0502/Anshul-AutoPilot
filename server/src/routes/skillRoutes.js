import { Router } from 'express';
import { getSkillProfile, completeChallenge, recordActivity, completeMissionNode, claimAchievement } from '../controllers/skillController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/profile', getSkillProfile);
router.post('/challenges/complete', completeChallenge);
router.post('/activities', recordActivity);
router.post('/missions/complete', completeMissionNode);
router.post('/achievements/:id/claim', claimAchievement);

export default router;
