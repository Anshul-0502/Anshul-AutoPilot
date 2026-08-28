import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import config from './config/env.js';
import requestLogger from './middleware/requestLogger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(rateLimiter({ windowMs: 60000, max: 200, keyPrefix: 'global' }));

// CORS configuration
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging middleware
app.use(requestLogger);

// API Versioning and Routing
app.use('/api/v1', apiRouter);

// Base route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Anshul AutoPilot API server. Use /api/v1/health for health check.'
  });
});

// Fallback handlers
app.use(notFound);
app.use(errorHandler);

export default app;
