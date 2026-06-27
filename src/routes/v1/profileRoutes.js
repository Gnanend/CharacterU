const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/profileController');
const { validateProfileUpdate } = require('../../validators/profileValidator');
const { protect } = require('../../middleware/authMiddleware');

/**
 * @route   GET /api/v1/profile/me
 * @desc    Get current logged in user profile
 * @access  Private
 */
router.get('/me', protect, profileController.getProfile);

/**
 * @route   PUT /api/v1/profile/me
 * @desc    Update current logged in user profile
 * @access  Private
 */
router.put('/me', protect, validateProfileUpdate, profileController.updateProfile);

module.exports = router;
