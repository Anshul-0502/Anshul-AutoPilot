import { processQueueInternal } from '../controllers/notificationController.js';

let intervalId = null;

/**
 * Starts the periodic background queue processor.
 * @param {number} intervalMs - Poll interval in milliseconds (default 30 seconds)
 */
export const startNotificationQueueWorker = (intervalMs = 30000) => {
  if (intervalId) {
    console.log('[Notification Queue Worker] Already running.');
    return;
  }

  console.log(`[Notification Queue Worker] Starting background worker with interval ${intervalMs}ms...`);

  intervalId = setInterval(async () => {
    try {
      const result = await processQueueInternal();
      if (result.processedCount > 0) {
        console.log(`[Notification Queue Worker] Processed ${result.processedCount} queued notifications.`);
      }
    } catch (error) {
      console.error('[Notification Queue Worker] Error processing queue:', error.message);
    }
  }, intervalMs);
};

/**
 * Stops the periodic background queue processor.
 */
export const stopNotificationQueueWorker = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[Notification Queue Worker] Background worker stopped.');
  }
};
