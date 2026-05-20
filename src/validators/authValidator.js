const ApiError = require('../utils/ApiError');

/**
 * Middleware to validate the registration request payload.
 */
exports.validateRegister = (req, res, next) => {
  const { fullName, email, password, role } = req.body;
  const errors = [];

  // 1. fullName required
  if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
    errors.push('Full name is required');
  }

  // 2. valid email required
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required');
  }

  // 3. password minimum 8 characters
  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // 4. role validation
  const validRoles = ['student', 'admin', 'employer', 'family', 'moderator'];
  if (role && !validRoles.includes(role)) {
    errors.push(`Role must be one of: ${validRoles.join(', ')}`);
  }

  // If there are validation errors, return a 400 Bad Request
  if (errors.length > 0) {
    return next(new ApiError(400, errors.join('. ')));
  }

  next();
};

/**
 * Middleware to validate the login request payload.
 */
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('Email is required');
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, errors.join('. ')));
  }

  next();
};
