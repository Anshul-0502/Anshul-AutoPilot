import PlannerEvent from '../models/PlannerEvent.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all user planner events
// @route   GET /api/v1/planner
// @access  Private
export const getEvents = asyncHandler(async (req, res) => {
  const events = await PlannerEvent.find({ userId: req.user._id }).sort({ date: 1, startTime: 1 });

  res.status(200).json({
    success: true,
    message: 'Planner events fetched successfully',
    data: { events }
  });
});

// @desc    Create a new planner event
// @route   POST /api/v1/planner
// @access  Private
export const createEvent = asyncHandler(async (req, res) => {
  const { title, startTime, endTime, category, duration, date } = req.body;

  if (!title || !startTime || !endTime || !duration || !date) {
    throw new ApiError(400, 'Title, startTime, endTime, duration, and date are required fields');
  }

  const event = await PlannerEvent.create({
    userId: req.user._id,
    title,
    startTime,
    endTime,
    category: category || 'other',
    duration: parseInt(duration, 10),
    date: new Date(date)
  });

  res.status(201).json({
    success: true,
    message: 'Planner event created successfully',
    data: { event }
  });
});

// @desc    Update a planner event
// @route   PUT /api/v1/planner/:id
// @access  Private
export const updateEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const { title, startTime, endTime, category, duration, date } = req.body;

  const event = await PlannerEvent.findOne({ _id: eventId, userId: req.user._id });
  if (!event) {
    throw new ApiError(404, 'Planner event not found');
  }

  if (title !== undefined) event.title = title;
  if (startTime !== undefined) event.startTime = startTime;
  if (endTime !== undefined) event.endTime = endTime;
  if (category !== undefined) event.category = category;
  if (duration !== undefined) event.duration = parseInt(duration, 10);
  if (date !== undefined) event.date = new Date(date);

  await event.save();

  res.status(200).json({
    success: true,
    message: 'Planner event updated successfully',
    data: { event }
  });
});

// @desc    Delete a planner event
// @route   DELETE /api/v1/planner/:id
// @access  Private
export const deleteEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;

  const event = await PlannerEvent.findOneAndDelete({ _id: eventId, userId: req.user._id });
  if (!event) {
    throw new ApiError(404, 'Planner event not found');
  }

  res.status(200).json({
    success: true,
    message: 'Planner event deleted successfully',
    data: { id: eventId }
  });
});
