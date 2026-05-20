const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { validateRegister, validateLogin } = require('../../validators/authValidator');
const { protect } = require('../../middleware/authMiddleware');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegister, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);
/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, authController.getMe);

module.exports = router;
