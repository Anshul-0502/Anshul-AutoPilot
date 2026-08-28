import app from './app.js';
import config from './config/env.js';
import { connectDatabase, closeDatabase } from './config/database.js';
import { startNotificationQueueWorker, stopNotificationQueueWorker } from './services/notificationQueueWorker.js';


let server;

const startServer = async () => {
  try {
    // Database connection step
    await connectDatabase();

    // Start background notification queue worker
    startNotificationQueueWorker();

    // Start Express server
    server = app.listen(config.port, () => {
      console.log(`[Server] running in ${config.nodeEnv} mode on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`[Server] ${signal} signal received. Starting graceful shutdown...`);
  stopNotificationQueueWorker();
  
  if (server) {
    server.close(async () => {
      console.log('[Server] HTTP server closed.');
      await closeDatabase();
      console.log('[Server] Shutdown complete.');
      process.exit(0);
    });
  } else {
    await closeDatabase();
    console.log('[Server] Shutdown complete.');
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();
