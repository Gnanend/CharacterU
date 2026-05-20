const analyticsService = require('../services/analyticsService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get dashboard analytics data for the authenticated user
 * @route   GET /api/v1/analytics/dashboard
 * @access  Private
 */
exports.getDashboardAnalytics = asyncHandler(async (req, res) => {
  // Leverage the analytics service to fetch and calculate the user's dashboard data
  const data = await analyticsService.getDashboardAnalytics(req.user.id);

  res.status(200).json({
    success: true,
    data,
  });
});
