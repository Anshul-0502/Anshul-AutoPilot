import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from server root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || (isProduction ? undefined : 'mongodb://127.0.0.1:27017/anshul_autopilot'),
  clientUrl: process.env.CLIENT_URL || (isProduction ? undefined : 'http://localhost:5173'),
  jwtSecret: process.env.JWT_SECRET || (isProduction ? undefined : 'fallback-secret-for-jwt-development-only'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

// Validation
const requiredKeys = ['MONGODB_URI', 'CLIENT_URL', 'JWT_SECRET'];
const missingKeys = requiredKeys.filter((key) => !process.env[key]);

if (missingKeys.length > 0) {
  if (isProduction) {
    console.error(`[CRITICAL] Missing required environment variables in production: ${missingKeys.join(', ')}`);
    throw new Error(`CRITICAL: Missing required environment variables in production: ${missingKeys.join(', ')}`);
  } else {
    console.warn(`[WARNING] Missing environment variables: ${missingKeys.join(', ')}. Server might run with defaults.`);
  }
}

export default config;
