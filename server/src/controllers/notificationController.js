import Notification from '../models/Notification.js';
import AlertRegister from '../models/AlertRegister.js';
import NotificationQueue from '../models/NotificationQueue.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Helper to seed default alerts
const seedDefaultAlerts = async (userId) => {
  const defaults = [
    { label: 'Water Hydration Alarm', time: 'Every 2 Hours', enabled: true, type: 'water' },
    { label: 'Revision Study Session Alert', time: '10 Mins Before Slot', enabled: true, type: 'study' },
    { label: 'Habit Recap Checklist', time: 'Daily, 9:00 PM', enabled: false, type: 'habit' },
    { label: 'Screen Rest Eye Exercises', time: 'Every 1 Hour', enabled: false, type: 'eye' }
  ];
  const items = defaults.map(d => ({ ...d, userId }));
  return await AlertRegister.insertMany(items);
};

// Internal queue processing function (shared with background worker)
export const processQueueInternal = async () => {
  const now = new Date();
  // Find all pending notifications whose schedule time has passed
  const pendingJobs = await NotificationQueue.find({
    status: 'pending',
    scheduledFor: { $lte: now }
  });

  const processedCount = pendingJobs.length;
  const processedJobs = [];

  for (const job of pendingJobs) {
    try {
      // 1. Create a live Notification log for the user
      await Notification.create({
        userId: job.userId,
        title: job.title,
        message: job.message,
        desc: job.message,
        type: job.type,
        read: false,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // 2. Mark the queued job as sent
      job.status = 'sent';
      job.sentAt = new Date();
      await job.save();
      processedJobs.push(job);
    } catch (err) {
      job.status = 'failed';
      job.error = err.message;
      await job.save();
    }
  }

  return { processedCount, processedJobs };
};

// ==========================================
// Notifications CRUD
// ==========================================

// @desc    Get user's notification history
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: notifications });
});

// @desc    Create a new notification log
// @route   POST /api/v1/notifications
// @access  Private
export const createNotification = asyncHandler(async (req, res) => {
  const { title, message, type } = req.body;
  if (!title || !message) {
    throw new ApiError(400, 'Title and message are required');
  }

  const notification = await Notification.create({
    userId: req.user._id,
    title,
    message,
    desc: message,
    type: type || 'info',
    read: false,
    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  res.status(201).json({ success: true, data: notification });
});

// @desc    Mark a notification as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  res.status(200).json({ success: true, data: notification });
});

// @desc    Mark all user's notifications as read
// @route   PATCH /api/v1/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, read: false },
    { read: true }
  );

  res.status(200).json({ success: true, message: 'All notifications marked as read' });
});

// @desc    Delete a specific notification log
// @route   DELETE /api/v1/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  res.status(200).json({ success: true, message: 'Notification deleted' });
});

// @desc    Clear all notifications for user
// @route   DELETE /api/v1/notifications/clear-all
// @access  Private
export const clearAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ userId: req.user._id });
  res.status(200).json({ success: true, message: 'All notifications cleared' });
});

// ==========================================
// Alert Registers CRUD
// ==========================================

// @desc    Get user's active alert registers
// @route   GET /api/v1/notifications/alerts
// @access  Private
export const getAlertRegisters = asyncHandler(async (req, res) => {
  let alerts = await AlertRegister.find({ userId: req.user._id });

  // If no alerts registered yet, seed defaults
  if (alerts.length === 0) {
    alerts = await seedDefaultAlerts(req.user._id);
  }

  res.status(200).json({ success: true, data: alerts });
});

// @desc    Create a new alert register
// @route   POST /api/v1/notifications/alerts
// @access  Private
export const createAlertRegister = asyncHandler(async (req, res) => {
  const { label, time, enabled, type } = req.body;
  if (!label || !time) {
    throw new ApiError(400, 'Label and time are required');
  }

  const alert = await AlertRegister.create({
    userId: req.user._id,
    label,
    time,
    enabled: enabled || false,
    type: type || 'other'
  });

  res.status(201).json({ success: true, data: alert });
});

// @desc    Toggle/Update an alert register
// @route   PATCH /api/v1/notifications/alerts/:id
// @access  Private
export const toggleAlertRegister = asyncHandler(async (req, res) => {
  const alert = await AlertRegister.findOne({ _id: req.params.id, userId: req.user._id });
  if (!alert) {
    throw new ApiError(404, 'Alert register not found');
  }

  // Support direct boolean toggle, or full request body update
  if (req.body.enabled !== undefined) {
    alert.enabled = req.body.enabled;
  }
  if (req.body.label !== undefined) {
    alert.label = req.body.label;
  }
  if (req.body.time !== undefined) {
    alert.time = req.body.time;
  }
  if (req.body.type !== undefined) {
    alert.type = req.body.type;
  }

  await alert.save();
  res.status(200).json({ success: true, data: alert });
});

// @desc    Delete an alert register
// @route   DELETE /api/v1/notifications/alerts/:id
// @access  Private
export const deleteAlertRegister = asyncHandler(async (req, res) => {
  const alert = await AlertRegister.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!alert) {
    throw new ApiError(404, 'Alert register not found');
  }
  res.status(200).json({ success: true, message: 'Alert register deleted' });
});

// ==========================================
// Notifications Queue Configuration
// ==========================================

// @desc    Get user's background queued notifications
// @route   GET /api/v1/notifications/queue
// @access  Private
export const getQueuedNotifications = asyncHandler(async (req, res) => {
  const queued = await NotificationQueue.find({ userId: req.user._id }).sort({ scheduledFor: 1 });
  res.status(200).json({ success: true, data: queued });
});

// @desc    Schedule a new background notification
// @route   POST /api/v1/notifications/queue
// @access  Private
export const createQueuedNotification = asyncHandler(async (req, res) => {
  const { title, message, type, scheduledFor } = req.body;
  if (!title || !message || !scheduledFor) {
    throw new ApiError(400, 'Title, message, and scheduledFor date are required');
  }

  const job = await NotificationQueue.create({
    userId: req.user._id,
    title,
    message,
    type: type || 'info',
    scheduledFor: new Date(scheduledFor),
    status: 'pending'
  });

  res.status(201).json({ success: true, data: job });
});

// @desc    Cancel/Delete a queued notification
// @route   DELETE /api/v1/notifications/queue/:id
// @access  Private
export const deleteQueuedNotification = asyncHandler(async (req, res) => {
  const job = await NotificationQueue.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!job) {
    throw new ApiError(404, 'Queued job not found');
  }
  res.status(200).json({ success: true, message: 'Queued notification deleted' });
});

// @desc    Manually process the background notifications queue
// @route   POST /api/v1/notifications/queue/process
// @access  Private
export const processNotificationQueue = asyncHandler(async (req, res) => {
  const result = await processQueueInternal();
  res.status(200).json({ success: true, data: result });
});
