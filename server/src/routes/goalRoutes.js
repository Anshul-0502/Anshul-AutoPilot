import { Router } from 'express';
import { 
  getGoals, 
  getGoalSummary, 
  createGoal, 
  updateGoal, 
  updateManualProgress, 
  deleteGoal 
} from '../controllers/goalController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getGoals);
router.get('/summary', getGoalSummary);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.patch('/:id/progress', updateManualProgress);
router.delete('/:id', deleteGoal);

export default router;
