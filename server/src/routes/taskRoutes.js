import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask, toggleTaskComplete } from '../controllers/taskController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

// Secure all task endpoints
router.use(authenticate);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/complete', toggleTaskComplete);

export default router;
