const express = require('express');
const router = express.Router();
const checkInController = require('../../controllers/checkInController');
const { protect } = require('../../middleware/authMiddleware');
const { validateCheckIn } = require('../../validators/checkInValidator');

/**
 * @route   POST /api/v1/checkins
 * @desc    Submit a daily check-in
 * @access  Private (Requires valid JWT token)
 */
// 1. protect middleware verifies JWT and injects req.user
// 2. validateCheckIn ensures payload integrity
// 3. Controller processes request
router.post('/', protect, validateCheckIn, checkInController.createCheckIn);

/**
 * @route   GET /api/v1/checkins/me
 * @desc    Get current user's check-in history
 * @access  Private (Requires valid JWT token)
 */
router.get('/me', protect, checkInController.getMyCheckIns);

module.exports = router;
