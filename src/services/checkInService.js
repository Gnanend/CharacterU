const DailyCheckIn = require('../models/DailyCheckIn');
const ApiError = require('../utils/ApiError');

/**
 * Normalizes the current date to UTC midnight to ensure daily uniqueness.
 */
const getNormalizedDate = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

/**
 * Calculates the user's score based on completed activities.
 * Every true boolean value counts as 1 point.
 * @param {Object} activities 
 * @returns {Number} Total score
 */
const calculateScore = (activities) => {
  if (!activities) return 0;
  // Convert object values to an array and count the 'true' ones
  return Object.values(activities).filter((val) => val === true).length;
};

/**
 * Creates a daily check-in for a user if they haven't done one today.
 */
exports.createCheckIn = async (userId, activities, notes) => {
  const normalizedDate = getNormalizedDate();

  // Prevent duplicate submissions for the same user on the same normalized UTC day
  const existingCheckIn = await DailyCheckIn.findOne({ user: userId, date: normalizedDate });
  if (existingCheckIn) {
    throw new ApiError(400, 'You have already submitted your daily check-in for today.');
  }

  const score = calculateScore(activities);

  const checkIn = await DailyCheckIn.create({
    user: userId,
    date: normalizedDate,
    activities,
    notes,
    score,
  });

  // Automatically update the user's characterScore
  if (score > 0) {
    const User = require('../models/User');
    await User.findByIdAndUpdate(userId, { $inc: { characterScore: score } });
  }

  return checkIn;
};

/**
 * Retrieves the check-in history for a user.
 */
exports.getUserCheckIns = async (userId) => {
  // Fetch all check-ins and sort them in descending order (latest first)
  return await DailyCheckIn.find({ user: userId }).sort({ date: -1 });
};
