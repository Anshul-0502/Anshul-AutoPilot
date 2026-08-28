import { Router } from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/plannerController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

// Secure all planner endpoints
router.use(authenticate);

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/:id')
  .put(updateEvent)
  .delete(deleteEvent);

export default router;
