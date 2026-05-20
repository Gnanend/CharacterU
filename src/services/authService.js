const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Helper function to generate a secure JWT token.
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @returns {string} Signed JWT.
 */
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
  }
  
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * Registers a new user in the system.
 * 
 * @param {Object} userData - The data to create the user with.
 * @returns {Object} An object containing the generated token and the sanitized user document.
 */
exports.registerUser = async (userData) => {
  // 1. Prevent duplicate email registration
  const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'Email address is already in use');
  }

  // 2. Create the user
  // The User model has a pre('save') hook that will automatically hash the password.
  const user = await User.create(userData);

  // 3. Generate JWT token
  const token = generateToken(user._id);

  // 4. Return sanitized user response
  // We use .toObject() to convert the Mongoose document to a plain JS object,
  // then delete the password field to ensure it is not returned in the response.
  const sanitizedUser = user.toObject();
  delete sanitizedUser.password;

  return { token, user: sanitizedUser };
};
