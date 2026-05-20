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
  
  // Start from the most recent check-in
  let lastDate = checkIns[0].date;
  
  // Calculate difference in days from today to the most recent check-in
  const diffDaysFromToday = (today - lastDate) / (1000 * 60 * 60 * 24);
  
  // If the last check-in was more than 1 day ago (not today or yesterday), the streak is broken (0)
  if (diffDaysFromToday > 1) {
    return 0;
  }
  
  // We have an active streak. Initialize it.
  streak = 1;
  let currentDate = lastDate;

  // Iterate backwards through remaining check-ins
  for (let i = 1; i < checkIns.length; i++) {
    const nextDate = checkIns[i].date;
    const diffDays = (currentDate - nextDate) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      // Consecutive day found
      streak++;
      currentDate = nextDate;
    } else if (diffDays === 0) {
      // Duplicate entry on the same day (should be prevented by DB, but just in case)
      continue;
    } else {
      // Streak broken
      break;
    }
  }

  return streak;
};

/**
 * Get comprehensive dashboard analytics for a specific user.
 * @param {String} userId - The ID of the authenticated user.
 * @returns {Object} - The computed analytics payload.
 */
exports.getDashboardAnalytics = async (userId) => {
  // Fetch all user check-ins sorted descending (newest first)
  const checkIns = await DailyCheckIn.find({ user: userId }).sort({ date: -1 });
  
  // Calculate Streak
  const currentStreak = calculateStreak(checkIns);
  
  // Calculate total activities completed from check-ins
  const totalActivitiesCompleted = checkIns.reduce((sum, checkIn) => sum + (checkIn.score || 0), 0);
  
  // Fetch approved pledges
  // Depending on business logic, we can count 'submitted' or 'approved'. Let's count 'submitted' for now 
  // since the user is completing them immediately on the frontend.
  const pledgesCount = await Pledge.countDocuments({ user: userId }); // Or status: 'approved'
  
  // Calculate Character Score: +1 per activity, +10 per pledge
  const characterScore = totalActivitiesCompleted + (pledgesCount * 10);

  // Get recent 5 check-ins
  const recentCheckIns = checkIns.slice(0, 5);

  return {
    totalCheckIns: checkIns.length,
    currentStreak,
    characterScore,
    pledgeCompleted: pledgesCount,
    totalActivitiesCompleted,
    recentCheckIns,
  };
};
