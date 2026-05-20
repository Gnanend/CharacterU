/**
 * Async handler to wrap async route controllers and eliminate the need for try-catch blocks.
 * It automatically passes errors to the centralized error handling middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
