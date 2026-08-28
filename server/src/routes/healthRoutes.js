import { Router } from 'express';
import { 
  getHealthData, 
  updateWaterIntake, 
  updateWaterGoal, 
  addWorkout, 
  logSleep, 
  logMeditation, 
  toggleHabit, 
  addHabit, 
  toggleReminder 
} from '../controllers/healthController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/profile', getHealthData);
router.post('/water', updateWaterIntake);
router.put('/water/goal', updateWaterGoal);
router.post('/workouts', addWorkout);
router.post('/sleep', logSleep);
router.post('/meditation', logMeditation);
router.post('/habits', addHabit);
router.patch('/habits/:id/toggle', toggleHabit);
router.patch('/reminders', toggleReminder);

export default router;
