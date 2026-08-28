import ChatMessage from '../models/ChatMessage.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get AI Chat history logs
// @route   GET /api/v1/ai/chat
// @access  Private
export const getChatHistory = asyncHandler(async (req, res) => {
  const messages = await ChatMessage.find({ userId: req.user._id }).sort({ createdAt: 1 });
  
  res.status(200).json({
    success: true,
    data: messages
  });
});

// @desc    Save a single AI Chat message
// @route   POST /api/v1/ai/chat
// @access  Private
export const saveChatMessage = asyncHandler(async (req, res) => {
  const { sender, text, timestamp } = req.body;

  if (!sender || !text || !timestamp) {
    res.status(400);
    throw new Error('Sender, text, and timestamp are required fields.');
  }

  const message = await ChatMessage.create({
    userId: req.user._id,
    sender,
    text,
    timestamp
  });

  res.status(201).json({
    success: true,
    data: message
  });
});

// @desc    Clear AI Chat history
// @route   DELETE /api/v1/ai/chat
// @access  Private
export const clearChatHistory = asyncHandler(async (req, res) => {
  await ChatMessage.deleteMany({ userId: req.user._id });

  res.status(200).json({
    success: true,
    message: 'Chat history cleared successfully.'
  });
});
