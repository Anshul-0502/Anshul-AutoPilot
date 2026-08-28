import UserProfile from '../models/UserProfile.js';
import UserPreferences from '../models/UserPreferences.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get user profile details
// @route   GET /api/v1/user/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  let profile = await UserProfile.findOne({ userId: req.user._id });
  
  if (!profile) {
    profile = await UserProfile.create({
      userId: req.user._id,
      fullName: req.user.name,
      username: req.user.email.split('@')[0]
    });
  }

  res.status(200).json({
    success: true,
    message: 'Profile fetched successfully',
    data: { profile }
  });
});

// @desc    Update user profile details
// @route   PUT /api/v1/user/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, username, photo, bio, college, skills, careerGoal } = req.body;

  let profile = await UserProfile.findOne({ userId: req.user._id });
  
  if (!profile) {
    profile = new UserProfile({ userId: req.user._id });
  }

  if (fullName !== undefined) profile.fullName = fullName;
  if (username !== undefined) profile.username = username;
  if (photo !== undefined) profile.photo = photo;
  if (bio !== undefined) profile.bio = bio;
  if (college !== undefined) profile.college = college;
  if (skills !== undefined) profile.skills = skills;
  if (careerGoal !== undefined) profile.careerGoal = careerGoal;

  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { profile }
  });
});

// @desc    Get user preferences settings
// @route   GET /api/v1/user/preferences
// @access  Private
export const getPreferences = asyncHandler(async (req, res) => {
  let preferences = await UserPreferences.findOne({ userId: req.user._id });

  if (!preferences) {
    preferences = await UserPreferences.create({
      userId: req.user._id
    });
  }

  res.status(200).json({
    success: true,
    message: 'Preferences fetched successfully',
    data: { preferences }
  });
});

// @desc    Update user preferences settings
// @route   PUT /api/v1/user/preferences
// @access  Private
export const updatePreferences = asyncHandler(async (req, res) => {
  let preferences = await UserPreferences.findOne({ userId: req.user._id });

  if (!preferences) {
    preferences = new UserPreferences({ userId: req.user._id });
  }

  // Merge updates safely
  const categories = ['appearance', 'dashboard', 'notifications', 'study', 'coding', 'timer', 'security'];
  for (const cat of categories) {
    if (req.body[cat] && typeof req.body[cat] === 'object') {
      preferences[cat] = {
        ...preferences[cat]?.toObject(),
        ...req.body[cat]
      };
    }
  }

  await preferences.save();

  res.status(200).json({
    success: true,
    message: 'Preferences updated successfully',
    data: { preferences }
  });
});
