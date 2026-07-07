const User = require('../models/User');

/**
 * Calculates the dynamic leaderboard using MongoDB native queries.
 * @param {Object} filters - Query filters (e.g. city, country)
 * @param {Number} page - Pagination page
 * @param {Number} limit - Pagination limit
 */
const getLeaderboardData = async (filters = {}, page = 1, limit = 20) => {
  const startIndex = (page - 1) * limit;

  // Optimized MongoDB native querying and sorting
  const totalUsers = await User.countDocuments(filters);
  
  // Sort by Character Score DESC, then fallback to createdAt ASC
  const users = await User.find(filters)
    .sort({ characterScore: -1, createdAt: 1 })
    .skip(startIndex)
    .limit(limit)
    .select('fullName avatar city country characterScore')
    .lean();

  const data = users.map((user, index) => ({
    rank: startIndex + index + 1,
    userId: user._id,
    fullName: user.fullName,
    avatar: user.avatar,
    city: user.city,
    country: user.country,
    characterScore: user.characterScore,
  }));

  return {
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
    data
  };
};

exports.getGlobalLeaderboard = async (page = 1, limit = 20) => {
  return await getLeaderboardData({}, page, limit);
};

exports.getCountryLeaderboard = async (filters, page = 1, limit = 20) => {
  return await getLeaderboardData(filters, page, limit);
};

exports.getCityLeaderboard = async (filters, page = 1, limit = 20) => {
  return await getLeaderboardData(filters, page, limit);
};
