const leaderboardService = require('../services/leaderboardService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get dynamic leaderboard rankings
 * @route   GET /api/v1/leaderboard
 * @access  Private
 */
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  
  // Optional filters
  const filters = {};
  if (req.query.city) filters['location.city'] = req.query.city;
  if (req.query.country) filters['location.country'] = req.query.country;

  const result = await leaderboardService.getLeaderboard(filters, page, limit);

  res.status(200).json({
    success: true,
    ...result
  });
});
