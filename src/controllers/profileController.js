const profileService = require('../services/profileService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/v1/profile/me
 * @access  Private
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await profileService.getProfile(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * @desc    Update current logged in user profile
 * @route   PUT /api/v1/profile/me
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await profileService.updateProfile(req.user.id, req.body);

  res.status(200).json({
    success: true,
    user,
  });
});
