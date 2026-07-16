/**
 * Standardized API Error class for predictable error responses
 */
class ApiError extends Error {
  constructor(statusCode, message, errorKey = null, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.errorKey = errorKey;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
