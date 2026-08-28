import { Router } from 'express';
import mongoose from 'mongoose';
import config from '../config/env.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import taskRoutes from './taskRoutes.js';
import plannerRoutes from './plannerRoutes.js';
import studyRoutes from './studyRoutes.js';
import codingRoutes from './codingRoutes.js';
import focusRoutes from './focusRoutes.js';
import projectRoutes from './projectRoutes.js';
import skillRoutes from './skillRoutes.js';
import healthRoutes from './healthRoutes.js';
import goalRoutes from './goalRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import aiRoutes from './aiRoutes.js';
import migrationRoutes from './migrationRoutes.js';

const router = Router();


// Health Check Endpoint
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? 'Anshul AutoPilot API is running' : 'Database connection error',
    data: {
      api: 'connected',
      database: states[dbState] || 'unknown',
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

// Auth endpoints (prefix will be /api/v1/auth)
router.use('/auth', authRoutes);

// User Profile/Preferences endpoints (prefix will be /api/v1/user)
router.use('/user', userRoutes);

// Tasks endpoints (prefix will be /api/v1/tasks)
router.use('/tasks', taskRoutes);

// Planner endpoints (prefix will be /api/v1/planner)
router.use('/planner', plannerRoutes);

// Study Hub endpoints (prefix will be /api/v1/study)
router.use('/study', studyRoutes);

// Coding Workspace endpoints (prefix will be /api/v1/coding)
router.use('/coding', codingRoutes);

// Health Focus Session endpoints (prefix will be /api/v1/health/focus-sessions)
router.use('/health/focus-sessions', focusRoutes);

// Health Wellness endpoints (prefix will be /api/v1/health)
router.use('/health', healthRoutes);

// Project Manager Workspace endpoints (prefix will be /api/v1/projects)
router.use('/projects', projectRoutes);

// Skill Arena endpoints (prefix will be /api/v1/skills)
router.use('/skills', skillRoutes);

// Goals endpoints (prefix will be /api/v1/goals)
router.use('/goals', goalRoutes);

// Notifications endpoints (prefix will be /api/v1/notifications)
router.use('/notifications', notificationRoutes);

// Dashboard endpoints (prefix will be /api/v1/dashboard)
router.use('/dashboard', dashboardRoutes);

// Analytics endpoints (prefix will be /api/v1/analytics)
router.use('/analytics', analyticsRoutes);

// AI endpoints (prefix will be /api/v1/ai)
router.use('/ai', aiRoutes);

// Migration endpoints (prefix will be /api/v1/migration)
router.use('/migration', migrationRoutes);

export default router;

