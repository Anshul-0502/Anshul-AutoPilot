import mongoose from 'mongoose';
import config from './env.js';

// Monitor connection events
mongoose.connection.on('connected', () => {
  console.log('[Database] MongoDB connected successfully.');
  console.log(`[Database] Database Name: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  console.error('[Database] MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('[Database] MongoDB disconnected.');
});

export const connectDatabase = async () => {
  if (config.nodeEnv === 'test') {
    return;
  }

  try {
    console.log('[Database] Connecting to MongoDB...');
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
  } catch (error) {
    console.error('[Database] Connection failed. Please verify that MongoDB is running and MONGODB_URI is valid.');
    console.error(`[Database] Error: ${error.message}`);
    throw error;
  }
};

export const closeDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('[Database] MongoDB connection closed gracefully.');
    }
  } catch (error) {
    console.error('[Database] Error closing MongoDB connection:', error.message);
  }
};

export default connectDatabase;
