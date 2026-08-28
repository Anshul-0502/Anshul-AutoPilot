import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import config from '../config/env.js';
import User from '../models/User.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  // Fallback to Authorization Bearer header
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Authentication token missing or invalid');
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      throw new ApiError(401, 'User associated with this token no longer exists');
    }

    if (user.accountStatus !== 'active') {
      throw new ApiError(403, 'Your account is currently disabled');
    }

    // Attach authenticated user info to request
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Authentication failed or token expired');
  }
});

export default authenticate;
