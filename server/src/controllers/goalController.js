import Goal from '../models/Goal.js';
import { calculateGoalProgress } from '../services/goalProgressService.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Helper to calculate date boundaries based on period type
const calculatePeriodDates = (period, startInput, endInput) => {
  const now = new Date();
  let startDate = startInput ? new Date(startInput) : new Date(now);
  let endDate = endInput ? new Date(endInput) : new Date(now);

  if (!startInput || !endInput) {
    if (period === 'daily') {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === 'weekly') {
      // Find Monday
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'lifetime') {
      startDate = new Date(2020, 0, 1, 0, 0, 0, 0);
      endDate = new Date(2035, 11, 31, 23, 59, 59, 999);
    }
  }

  return { startDate, endDate };
};

// @desc    Get all user goals with current progress evaluation
// @route   GET /api/v1/goals
// @access  Private
export const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ userId: req.user._id });

  // Evaluate progress for each goal dynamically
  const evaluated = await Promise.all(goals.map(async (goal) => {
    const progress = await calculateGoalProgress(goal);
    return {
      ...goal.toJSON(),
      currentValue: progress.currentValue,
      progressPercent: progress.progressPercent,
      completed: progress.completed
    };
  }));

  res.status(200).json({ success: true, data: { goals: evaluated } });
});

// @desc    Get dashboard goals stats summary
// @route   GET /api/v1/goals/summary
// @access  Private
export const getGoalSummary = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ userId: req.user._id, status: { $ne: 'archived' } });

  const evaluated = await Promise.all(goals.map(async (goal) => {
    const progress = await calculateGoalProgress(goal);
    return {
      ...goal.toJSON(),
      currentValue: progress.currentValue,
      progressPercent: progress.progressPercent,
      completed: progress.completed
    };
  }));

  const active = evaluated.filter(g => g.status === 'active');
  const completed = evaluated.filter(g => g.completed);
  const completionRate = evaluated.length > 0 
    ? Math.round((completed.length / evaluated.length) * 100) 
    : 0;

  res.status(200).json({
    success: true,
    data: {
      goals: evaluated,
      activeCount: active.length,
      completedCount: completed.length,
      overallCompletionRate: completionRate
    }
  });
});

// @desc    Create a new goal
// @route   POST /api/v1/goals
// @access  Private
export const createGoal = asyncHandler(async (req, res) => {
  const { title, description, category, metric, targetValue, period, startDateInput, endDateInput, sourceFilter } = req.body;
  if (!title) throw new ApiError(400, 'Goal title is required');

  const target = parseInt(targetValue, 10);
  if (isNaN(target) || target <= 0) throw new ApiError(400, 'Target value must be a positive integer');

  const goalPeriod = period || 'daily';
  const { startDate, endDate } = calculatePeriodDates(goalPeriod, startDateInput, endDateInput);

  // Exclude arbitrary sourceFilter keys for security
  const safeFilter = {};
  if (sourceFilter) {
    const allowed = ['topic', 'platform', 'subjectId', 'projectId', 'type'];
    allowed.forEach(k => {
      if (sourceFilter[k] !== undefined) safeFilter[k] = sourceFilter[k];
    });
  }

  const goal = await Goal.create({
    userId: req.user._id,
    title,
    description: description || '',
    category: category || 'custom',
    metric: metric || 'custom',
    targetValue: target,
    period: goalPeriod,
    startDate,
    endDate,
    sourceFilter: safeFilter,
    status: 'active'
  });

  const progress = await calculateGoalProgress(goal);

  res.status(201).json({
    success: true,
    data: {
      ...goal.toJSON(),
      currentValue: progress.currentValue,
      progressPercent: progress.progressPercent,
      completed: progress.completed
    }
  });
});

// @desc    Update goal details
// @route   PUT /api/v1/goals/:id
// @access  Private
export const updateGoal = asyncHandler(async (req, res) => {
  const { title, description, status, targetValue, period, startDateInput, endDateInput } = req.body;
  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
  if (!goal) throw new ApiError(404, 'Goal not found');

  if (title) goal.title = title;
  if (description !== undefined) goal.description = description;
  if (status) goal.status = status;
  if (targetValue) {
    const target = parseInt(targetValue, 10);
    if (target > 0) goal.targetValue = target;
  }
  if (period) goal.period = period;
  if (startDateInput && endDateInput) {
    goal.startDate = new Date(startDateInput);
    goal.endDate = new Date(endDateInput);
  }

  await goal.save();
  const progress = await calculateGoalProgress(goal);

  res.status(200).json({
    success: true,
    data: {
      ...goal.toJSON(),
      currentValue: progress.currentValue,
      progressPercent: progress.progressPercent,
      completed: progress.completed
    }
  });
});

// @desc    Update progress manually (for custom metrics only)
// @route   PATCH /api/v1/goals/:id/progress
// @access  Private
export const updateManualProgress = asyncHandler(async (req, res) => {
  const { currentValue } = req.body;
  if (currentValue === undefined) throw new ApiError(400, 'Current value is required');

  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user._id });
  if (!goal) throw new ApiError(404, 'Goal not found');

  // Enforce validation: reject updates for automatic source-derived goals
  if (goal.metric !== 'custom') {
    throw new ApiError(400, 'Cannot manually update progress for source-derived automatic goals');
  }

  goal.manualCurrentValue = Math.max(0, parseInt(currentValue, 10));
  await goal.save();

  const progress = await calculateGoalProgress(goal);

  res.status(200).json({
    success: true,
    data: {
      ...goal.toJSON(),
      currentValue: progress.currentValue,
      progressPercent: progress.progressPercent,
      completed: progress.completed
    }
  });
});

// @desc    Delete a goal
// @route   DELETE /api/v1/goals/:id
// @access  Private
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!goal) throw new ApiError(404, 'Goal not found');
  res.status(200).json({ success: true, message: 'Goal deleted successfully' });
});
