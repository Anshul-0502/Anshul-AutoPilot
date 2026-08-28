import ApiError from '../utils/ApiError.js';
import config from '../config/env.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, err.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(config.nodeEnv === 'development' && { stack: error.stack })
  };

  res.status(error.statusCode).json(response);
};

export default errorHandler;
