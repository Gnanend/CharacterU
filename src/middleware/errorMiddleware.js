const ApiError = require('../utils/ApiError');

/**
 * Handle 404 Not Found errors for unmatched routes
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

/**
 * Centralized error handler middleware.
 * Formats all errors into a standard JSON response.
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Default to 500 if status code is not set or not an ApiError
  if (!statusCode) statusCode = 500;
  if (!message) message = 'Internal Server Error';

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
