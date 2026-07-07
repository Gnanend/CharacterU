const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/profileController');
const avatarController = require('../../controllers/avatarController');
const { validateProfileUpdate } = require('../../validators/profileValidator');
const { protect } = require('../../middleware/authMiddleware');
const { uploadAvatar } = require('../../middleware/uploadMiddleware');

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

/**
 * @route   POST /api/v1/profile/avatar
 * @desc    Upload and update user avatar
 * @access  Private
 */
router.post('/avatar', protect, uploadAvatar.single('avatar'), avatarController.uploadAvatar);

module.exports = router;
