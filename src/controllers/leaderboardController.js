const leaderboardService = require('../services/leaderboardService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get global leaderboard rankings
 * @route   GET /api/v1/leaderboard/global
 * @access  Public
 */
exports.getGlobalLeaderboard = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  
  const result = await leaderboardService.getGlobalLeaderboard(page, limit);

  res.status(200).json({
    success: true,
    ...result
  });
});

/**
 * @desc    Get country leaderboard rankings
 * @route   GET /api/v1/leaderboard/country
 * @access  Private
 */
exports.getCountryLeaderboard = asyncHandler(async (req, res) => {
  if (!req.user.country) {
    throw new ApiError(400, 'Please update your profile with a valid country to view this leaderboard.');
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  
  const filters = { country: req.user.country };
  const result = await leaderboardService.getCountryLeaderboard(filters, page, limit);

  res.status(200).json({
    success: true,
    ...result
  });
});

/**
 * @desc    Get city leaderboard rankings
 * @route   GET /api/v1/leaderboard/city
 * @access  Private
 */
exports.getCityLeaderboard = asyncHandler(async (req, res) => {
  if (!req.user.city) {
    throw new ApiError(400, 'Please update your profile with a valid city to view this leaderboard.');
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  
  const filters = { city: req.user.city };
  const result = await leaderboardService.getCityLeaderboard(filters, page, limit);

  res.status(200).json({
    success: true,
    ...result
  });
});
