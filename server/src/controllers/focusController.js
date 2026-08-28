import FocusSession from '../models/FocusSession.js';
import SkillProfile from '../models/SkillProfile.js';
import { getLevelInfo, evaluateAchievements } from './skillController.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all completed focus sessions
// @route   GET /api/v1/health/focus-sessions
// @access  Private
export const getFocusSessions = asyncHandler(async (req, res) => {
  const sessions = await FocusSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { focusSessions: sessions } });
});

// @desc    Create a completed focus session log & award XP/coins
// @route   POST /api/v1/health/focus-sessions
// @access  Private
export const createFocusSession = asyncHandler(async (req, res) => {
  const { type, duration, date } = req.body;
  if (!type || !duration || !date) {
    throw new ApiError(400, 'Session type, duration, and date are required');
  }

  // Idempotency check: prevent logging sessions with same start date/time block
  const durationNum = parseInt(duration, 10);
  if (durationNum <= 0 || isNaN(durationNum)) {
    throw new ApiError(400, 'Invalid duration. Must be positive integer');
  }

  // Calculate XP & coins rewards
  const xpEarned = type === 'Pomodoro' ? 50 : 30;
  const coinsEarned = type === 'Pomodoro' ? 10 : 5;

  const session = await FocusSession.create({
    userId: req.user._id,
    type,
    duration: durationNum,
    date,
    rewardProcessed: true,
    xpAwarded: xpEarned,
    coinsAwarded: coinsEarned
  });

  // Award rewards to user's SkillProfile directly in the database
  let profile = await SkillProfile.findOne({ userId: req.user._id });
  if (!profile) {
    profile = await SkillProfile.create({
      userId: req.user._id,
      lastActiveDate: date
    });
  }
  profile.xp += xpEarned;
  profile.coins += coinsEarned;
  profile.level = getLevelInfo(profile.xp).level;
  evaluateAchievements(profile);
  await profile.save();

  res.status(201).json({
    success: true,
    data: {
      session,
      xpEarned,
      coinsEarned
    }
  });
});
