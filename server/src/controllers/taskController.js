import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all user tasks
// @route   GET /api/v1/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Tasks fetched successfully',
    data: { tasks }
  });
});

// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, category, priority, deadline, subtasks } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    throw new ApiError(400, 'Task title is required');
  }

  // Create new task owned by logged-in user
  const task = await Task.create({
    userId: req.user._id,
    title,
    description: description || '',
    category: category || 'Others',
    priority: priority || 'medium',
    deadline: deadline ? new Date(deadline) : undefined,
    subtasks: subtasks || [],
    completed: false,
    status: 'todo'
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task }
  });
});

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const { title, description, category, priority, deadline, status, completed, subtasks } = req.body;

  const task = await Task.findOne({ _id: taskId, userId: req.user._id });
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (category !== undefined) task.category = category;
  if (priority !== undefined) task.priority = priority;
  if (deadline !== undefined) task.deadline = deadline ? new Date(deadline) : null;
  if (subtasks !== undefined) task.subtasks = subtasks;

  // Sync completion and status logic
  if (completed !== undefined) {
    const isCompletedVal = !!completed;
    if (isCompletedVal !== task.completed) {
      task.completed = isCompletedVal;
      task.status = isCompletedVal ? 'done' : 'todo';
      task.completedAt = isCompletedVal ? new Date() : null;
    }
  } else if (status !== undefined) {
    task.status = status;
    task.completed = status === 'done';
    task.completedAt = status === 'done' ? new Date() : null;
  }

  await task.save();

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: { task }
  });
});

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  const task = await Task.findOneAndDelete({ _id: taskId, userId: req.user._id });
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: { id: taskId }
  });
});

// @desc    Toggle completion state of a task
// @route   PATCH /api/v1/tasks/:id/complete
// @access  Private
export const toggleTaskComplete = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  const task = await Task.findOne({ _id: taskId, userId: req.user._id });
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  const nextCompleted = !task.completed;
  task.completed = nextCompleted;
  task.status = nextCompleted ? 'done' : 'todo';
  task.completedAt = nextCompleted ? new Date() : null;

  await task.save();

  res.status(200).json({
    success: true,
    message: `Task marked as ${nextCompleted ? 'completed' : 'incomplete'}`,
    data: { task }
  });
});
