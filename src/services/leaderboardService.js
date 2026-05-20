const User = require('../models/User');
const DailyCheckIn = require('../models/DailyCheckIn');
const Pledge = require('../models/Pledge');

/**
 * Helper to normalize a date to UTC midnight for consistent comparison.
 */
const getNormalizedDate = (date = new Date()) => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

/**
 * Calculates the current daily streak of the user based on normalized check-in dates.
 * @param {Array} checkIns - Array of user check-ins sorted by date descending.
 * @returns {Number} - The current streak count.
 */
const calculateStreak = (checkIns) => {
  if (!checkIns || checkIns.length === 0) return 0;

  let streak = 0;
  const today = getNormalizedDate();
  
  let lastDate = new Date(checkIns[0].date);
  const diffDaysFromToday = (today - lastDate) / (1000 * 60 * 60 * 24);
  
  if (diffDaysFromToday > 1) {
    return 0;
  }
  
  streak = 1;
  let currentDate = lastDate;

  for (let i = 1; i < checkIns.length; i++) {
    const nextDate = new Date(checkIns[i].date);
    const diffDays = (currentDate - nextDate) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
      currentDate = nextDate;
    } else if (diffDays === 0) {
      continue;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Calculates the dynamic leaderboard for all users.
 * @param {Object} filters - Optional query filters (e.g. city, country)
 * @param {Number} page - Pagination page
 * @param {Number} limit - Pagination limit
 */
exports.getLeaderboard = async (filters = {}, page = 1, limit = 10) => {
  // 1. Fetch all users matching filters
  const users = await User.find(filters).select('fullName avatar location');
  
  // 2. Fetch all related check-ins and pledges to calculate scores in memory
  const userIds = users.map(u => u._id);
  
  const allCheckIns = await DailyCheckIn.find({ user: { $in: userIds } }).sort({ date: -1 }).lean();
  const allPledges = await Pledge.find({ user: { $in: userIds } }).lean();
  
  // 3. Group data by userId for O(1) lookups
  const checkInsByUser = {};
  allCheckIns.forEach(c => {
    const uid = c.user.toString();
    if (!checkInsByUser[uid]) checkInsByUser[uid] = [];
    checkInsByUser[uid].push(c);
  });
  
  const pledgesByUser = {};
  allPledges.forEach(p => {
    const uid = p.user.toString();
    if (!pledgesByUser[uid]) pledgesByUser[uid] = 0;
    pledgesByUser[uid]++;
  });
  
  // 4. Compute analytics dynamically for each user
  const leaderboard = users.map(user => {
    const uid = user._id.toString();
    const checkIns = checkInsByUser[uid] || [];
    const pledgesCount = pledgesByUser[uid] || 0;
    
    const currentStreak = calculateStreak(checkIns);
    const totalActivitiesCompleted = checkIns.reduce((sum, c) => sum + (c.score || 0), 0);
    const characterScore = totalActivitiesCompleted + (pledgesCount * 10);
    
    return {
      userId: uid,
      fullName: user.fullName,
      avatar: user.avatar,
      characterScore,
      currentStreak,
      totalCheckIns: checkIns.length,
      pledgeCompleted: pledgesCount
    };
  });
  
  // 5. Apply ranking logic (Sort by characterScore DESC, then currentStreak DESC)
  leaderboard.sort((a, b) => {
    if (b.characterScore !== a.characterScore) {
      return b.characterScore - a.characterScore;
    }
    return b.currentStreak - a.currentStreak;
  });
  
  // Assign explicit ranks
  leaderboard.forEach((item, index) => {
    item.rank = index + 1;
  });
  
  // 6. Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  return {
    totalUsers: leaderboard.length,
    totalPages: Math.ceil(leaderboard.length / limit),
    currentPage: page,
    data: leaderboard.slice(startIndex, endIndex)
  };
};
