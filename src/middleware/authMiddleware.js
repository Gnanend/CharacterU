const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Middleware to protect routes by verifying the JWT token.
 * It checks the Authorization header for a Bearer token, verifies it,
 * and attaches the authenticated user to the request object.
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if token exists in headers and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If there's no token, reject the request with 401 Unauthorized
  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }

  try {
    // 2. Verify token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user by decoded ID and attach to request object
    // Exclude password from the query results for security
    const user = await User.findById(decoded.id).select('-password');

    // If the user was deleted after the token was issued, reject
    if (!user) {
      return next(new ApiError(401, 'The user belonging to this token no longer exists.'));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors (expired, invalid signature, etc.) gracefully
    return next(new ApiError(401, 'Not authorized to access this route'));
  }
});

/**
 * Middleware to restrict access based on user roles.
 * Must be used AFTER the `protect` middleware.
 * 
 * @param {...string} roles - The roles allowed to access the route.
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Safety check in case it's used without protect middleware
    if (!req.user || !req.user.role) {
      return next(new ApiError(403, 'Forbidden access'));
    }

    // Check if the user's role is in the list of allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `User role '${req.user.role}' is not authorized to access this route`)
      );
    }
    next();
  };
};
