const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  // Extract user data from request body. 
  // It has already been validated by the authValidator middleware.
  const { fullName, email, password, role } = req.body;

  // Call the service layer to handle business logic
  const { token, user } = await authService.registerUser({
    fullName,
    email,
    password,
    role
  });

  // Respond with standardized success format and 201 Created status
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user
  });
});

/**
 * @desc    Login a user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Call the service layer to handle business logic
  const { token, user } = await authService.loginUser(email, password);

  // Respond with standardized success format
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user
  });
});
