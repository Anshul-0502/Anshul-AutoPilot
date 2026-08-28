import { Router } from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getAlertRegisters,
  createAlertRegister,
  toggleAlertRegister,
  deleteAlertRegister,
  getQueuedNotifications,
  createQueuedNotification,
  deleteQueuedNotification,
  processNotificationQueue
} from '../controllers/notificationController.js';
import authenticate from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

// Notification Logs Routes
router.route('/')
  .get(getNotifications)
  .post(createNotification);

router.patch('/read-all', markAllAsRead);
router.delete('/clear-all', clearAllNotifications);

router.patch('/:id/read', markAsRead);
router.route('/:id')
  .delete(deleteNotification);

// Alert Registers Routes
router.route('/alerts')
  .get(getAlertRegisters)
  .post(createAlertRegister);

router.route('/alerts/:id')
  .patch(toggleAlertRegister)
  .delete(deleteAlertRegister);

// Notification Queue Routes
router.route('/queue')
  .get(getQueuedNotifications)
  .post(createQueuedNotification);

router.post('/queue/process', processNotificationQueue);

router.route('/queue/:id')
  .delete(deleteQueuedNotification);

export default router;
