import HealthProfile from '../models/HealthProfile.js';
import WaterLog from '../models/WaterLog.js';
import SleepLog from '../models/SleepLog.js';
import Workout from '../models/Workout.js';
import MeditationSession from '../models/MeditationSession.js';
import Habit from '../models/Habit.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Default starter habits
const defaultHabits = [
  { id: 1, title: 'Read a book', category: 'Reading', streak: 0, history: {} },
  { id: 2, title: 'Drink 8 glasses of water', category: 'Hydration', streak: 0, history: {} },
  { id: 3, title: 'Physical Workout', category: 'Fitness', streak: 0, history: {} },
  { id: 4, title: 'Meditate', category: 'Mindfulness', streak: 0, history: {} }
];

// Helper to compile final healthData object expected by the frontend
const compileHealthData = async (userId, todayStr) => {
  let profile = await HealthProfile.findOne({ userId });
  if (!profile) {
    profile = await HealthProfile.create({ userId });
  }

  let todayWater = await WaterLog.findOne({ userId, date: todayStr });
  if (!todayWater) {
    todayWater = await WaterLog.create({ userId, date: todayStr, goal: profile.waterGoal });
  }

  const sleepHistory = await SleepLog.find({ userId }).sort({ createdAt: 1 });
  const workouts = await Workout.find({ userId }).sort({ createdAt: -1 });
  const meditations = await MeditationSession.find({ userId });
  let habits = await Habit.find({ userId });

  // Seeding default habits if user has none
  if (habits.length === 0) {
    const seedPromises = defaultHabits.map(h => Habit.create({
      userId,
      id: h.id,
      title: h.title,
      category: h.category,
      streak: h.streak,
      history: {}
    }));
    habits = await Promise.all(seedPromises);
  }

  const totalMeditationTime = meditations.reduce((sum, m) => sum + m.duration, 0);

  // Group meditation sessions by date for display
  const meditationHistoryMap = {};
  meditations.forEach(m => {
    meditationHistoryMap[m.date] = (meditationHistoryMap[m.date] || 0) + m.duration;
  });
  const meditationHistory = Object.entries(meditationHistoryMap).map(([date, duration]) => ({
    date,
    duration
  }));

  return {
    waterGoal: profile.waterGoal,
    waterIntake: todayWater.intake,
    sleepTime: profile.sleepTime,
    wakeTime: profile.wakeTime,
    sleepQuality: profile.sleepQuality,
    sleepHistory: sleepHistory.map(s => ({ id: s.id, day: s.day, hours: s.hours, date: s.date })),
    workouts: workouts.map(w => ({ id: w.id, type: w.type, duration: w.duration, calories: w.calories, status: w.status, notes: w.notes, date: w.date })),
    meditationTime: totalMeditationTime,
    meditationHistory,
    habits,
    reminders: profile.reminders
  };
};

// @desc    Get user wellness and habits summary
// @route   GET /api/v1/health/profile
// @access  Private
export const getHealthData = asyncHandler(async (req, res) => {
  const todayStr = req.query.today || new Date().toISOString().split('T')[0];
  const compiled = await compileHealthData(req.user._id, todayStr);
  res.status(200).json({ success: true, data: compiled });
});

// @desc    Update hydration level and check goals
// @route   POST /api/v1/health/water
// @access  Private
export const updateWaterIntake = asyncHandler(async (req, res) => {
  const { amount, today } = req.body;
  if (amount === undefined) throw new ApiError(400, 'Water amount delta is required');

  const todayStr = today || new Date().toISOString().split('T')[0];
  const userId = req.user._id;

  let profile = await HealthProfile.findOne({ userId });
  if (!profile) profile = await HealthProfile.create({ userId });

  let todayWater = await WaterLog.findOne({ userId, date: todayStr });
  if (!todayWater) {
    todayWater = await WaterLog.create({ userId, date: todayStr, goal: profile.waterGoal });
  }

  todayWater.intake = Math.max(0, todayWater.intake + parseInt(amount, 10));
  await todayWater.save();

  // Sync hydration habit
  const habit = await Habit.findOne({ userId, category: 'Hydration' });
  if (habit) {
    const isCompleted = todayWater.intake >= todayWater.goal;
    const wasCompleted = !!habit.history.get(todayStr);

    if (isCompleted && !wasCompleted) {
      habit.streak += 1;
      habit.history.set(todayStr, true);
      await habit.save();
    } else if (!isCompleted && wasCompleted) {
      habit.streak = Math.max(0, habit.streak - 1);
      habit.history.set(todayStr, false);
      await habit.save();
    }
  }

  const compiled = await compileHealthData(userId, todayStr);
  res.status(200).json({ success: true, data: compiled });
});

// @desc    Update hydration target preference
// @route   PUT /api/v1/health/water/goal
// @access  Private
export const updateWaterGoal = asyncHandler(async (req, res) => {
  const { goal, today } = req.body;
  if (goal === undefined) throw new ApiError(400, 'Water target goal is required');

  const todayStr = today || new Date().toISOString().split('T')[0];
  const userId = req.user._id;

  const profile = await HealthProfile.findOneAndUpdate(
    { userId },
    { waterGoal: Math.max(1, parseInt(goal, 10)) },
    { new: true, upsert: true }
  );

  await WaterLog.findOneAndUpdate(
    { userId, date: todayStr },
    { goal: profile.waterGoal },
    { upsert: true }
  );

  const compiled = await compileHealthData(userId, todayStr);
  res.status(200).json({ success: true, data: compiled });
});

// @desc    Create workout log entry and complete Fitness habit
// @route   POST /api/v1/health/workouts
// @access  Private
export const addWorkout = asyncHandler(async (req, res) => {
  const { type, duration, calories, notes, today } = req.body;
  if (!type || !duration) throw new ApiError(400, 'Workout type and duration are required');

  const todayStr = today || new Date().toISOString().split('T')[0];
  const userId = req.user._id;

  await Workout.create({
    userId,
    id: Date.now(),
    type,
    duration: parseInt(duration, 10),
    calories: parseInt(calories, 10) || 0,
    notes: notes || '',
    status: 'Completed',
    date: todayStr
  });

  // Complete Fitness habit
  const habit = await Habit.findOne({ userId, category: 'Fitness' });
  if (habit) {
    const wasCompleted = !!habit.history.get(todayStr);
    if (!wasCompleted) {
      habit.streak += 1;
      habit.history.set(todayStr, true);
      await habit.save();
    }
  }

  const compiled = await compileHealthData(userId, todayStr);
  res.status(201).json({ success: true, data: compiled });
});

// @desc    Log sleep parameters and history charts
// @route   POST /api/v1/health/sleep
// @access  Private
export const logSleep = asyncHandler(async (req, res) => {
  const { sleepTime, wakeTime, quality, hours, today } = req.body;
  if (quality === undefined || hours === undefined) {
    throw new ApiError(400, 'Sleep quality and hours slept are required');
  }

  const todayStr = today || new Date().toISOString().split('T')[0];
  const userId = req.user._id;

  await HealthProfile.findOneAndUpdate(
    { userId },
    {
      sleepTime: sleepTime || '23:00',
      wakeTime: wakeTime || '07:00',
      sleepQuality: Math.min(100, Math.max(0, parseInt(quality, 10)))
    },
    { upsert: true }
  );

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDay = days[new Date(todayStr).getDay()];

  await SleepLog.findOneAndUpdate(
    { userId, date: todayStr },
    { id: Date.now(), day: todayDay, hours: parseFloat(hours) },
    { upsert: true, new: true }
  );

  const compiled = await compileHealthData(userId, todayStr);
  res.status(200).json({ success: true, data: compiled });
});

// @desc    Log meditation mindfulness timer logs
// @route   POST /api/v1/health/meditation
// @access  Private
export const logMeditation = asyncHandler(async (req, res) => {
  const { duration, today } = req.body;
  if (!duration) throw new ApiError(400, 'Meditation duration is required');

  const todayStr = today || new Date().toISOString().split('T')[0];
  const userId = req.user._id;

  await MeditationSession.create({
    userId,
    duration: parseInt(duration, 10),
    date: todayStr
  });

  // Complete Mindfulness habit
  const habit = await Habit.findOne({ userId, category: 'Mindfulness' });
  if (habit) {
    const wasCompleted = !!habit.history.get(todayStr);
    if (!wasCompleted) {
      habit.streak += 1;
      habit.history.set(todayStr, true);
      await habit.save();
    }
  }

  const compiled = await compileHealthData(userId, todayStr);
  res.status(200).json({ success: true, data: compiled });
});

// @desc    Toggle habit status checks
// @route   PATCH /api/v1/health/habits/:id/toggle
// @access  Private
export const toggleHabit = asyncHandler(async (req, res) => {
  const habitId = req.params.id;
  const { today } = req.body;
  const todayStr = today || new Date().toISOString().split('T')[0];
  const userId = req.user._id;

  // Query habit by string ID or numeric ID equivalent
  const parsedId = parseInt(habitId, 10);
  const habit = await Habit.findOne({
    userId,
    $or: [{ id: habitId }, { id: isNaN(parsedId) ? -1 : parsedId }]
  });

  if (!habit) throw new ApiError(404, 'Habit not found');

  const isCompleted = !!habit.history.get(todayStr);
  const nextCompleted = !isCompleted;

  if (nextCompleted) {
    habit.streak += 1;
  } else {
    habit.streak = Math.max(0, habit.streak - 1);
  }

  habit.history.set(todayStr, nextCompleted);
  await habit.save();

  const compiled = await compileHealthData(userId, todayStr);
  res.status(200).json({ success: true, data: compiled });
});

// @desc    Add custom habit Checklist
// @route   POST /api/v1/health/habits
// @access  Private
export const addHabit = asyncHandler(async (req, res) => {
  const { title, category, today } = req.body;
  if (!title || !category) throw new ApiError(400, 'Habit title and category are required');

  const todayStr = today || new Date().toISOString().split('T')[0];
  const userId = req.user._id;

  await Habit.create({
    userId,
    id: Date.now(),
    title,
    category,
    streak: 0,
    history: {}
  });

  const compiled = await compileHealthData(userId, todayStr);
  res.status(201).json({ success: true, data: compiled });
});

// @desc    Toggle Reminder Preferences
// @route   PATCH /api/v1/health/reminders
// @access  Private
export const toggleReminder = asyncHandler(async (req, res) => {
  const { key, today } = req.body;
  if (!key) throw new ApiError(400, 'Reminder preference toggle key is required');

  const todayStr = today || new Date().toISOString().split('T')[0];
  const userId = req.user._id;

  const profile = await HealthProfile.findOne({ userId });
  if (!profile) throw new ApiError(404, 'Health profile not found');

  profile.reminders[key] = !profile.reminders[key];
  // Force Mongoose to save nested mixed object changes
  profile.markModified('reminders');
  await profile.save();

  const compiled = await compileHealthData(userId, todayStr);
  res.status(200).json({ success: true, data: compiled });
});
