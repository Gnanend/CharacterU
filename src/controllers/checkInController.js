const checkInService = require('../services/checkInService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Submit a daily check-in
 * @route   POST /api/v1/checkins
 * @access  Private
 */
exports.createCheckIn = asyncHandler(async (req, res) => {
  const { activities, notes } = req.body;
  
  // Delegate business logic securely to the service layer.
  // We strictly pass req.user.id to prevent any manual user injection from the request body.
  const checkIn = await checkInService.createCheckIn(req.user.id, activities, notes);

  res.status(201).json({
    success: true,
    message: 'Daily check-in submitted successfully',
    data: checkIn,
  });
});

/**
 * @desc    Get current user's check-in history
 * @route   GET /api/v1/checkins/me
 * @access  Private
 */
exports.getMyCheckIns = asyncHandler(async (req, res) => {
  const checkIns = await checkInService.getUserCheckIns(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Retrieved check-in history successfully',
    data: checkIns,
  });
});
