const jwt = require('jsonwebtoken');
const Employer = require('../models/Employer');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.protectEmployer = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const employer = await Employer.findById(decoded.id).select('-password');

    if (!employer) {
      return next(new ApiError(401, 'The employer belonging to this token no longer exists.'));
    }

    req.employer = employer;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }
});
