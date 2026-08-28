import ApiError from '../utils/ApiError.js';

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw new ApiError(400, 'Invalid name. Name must be at least 2 characters.');
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    throw new ApiError(400, 'Invalid email address.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new ApiError(400, 'Invalid password. Password must be at least 6 characters.');
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    throw new ApiError(400, 'Invalid email address.');
  }

  if (!password || typeof password !== 'string' || !password) {
    throw new ApiError(400, 'Password is required.');
  }

  next();
};
