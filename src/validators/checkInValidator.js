const ApiError = require('../utils/ApiError');

/**
 * Validates the daily check-in payload.
 * Ensures activities object exists and fields are strictly booleans.
 */
exports.validateCheckIn = (req, res, next) => {
  const { activities, notes } = req.body;

  if (!activities || typeof activities !== 'object') {
    return next(new ApiError(400, 'Activities object is required'));
  }

  // Define allowed fields to prevent injection of unexpected keys
  const allowedActivities = [
    'helpedSomeone',
    'avoidedConflict',
    'exercised',
    'learnedSomething',
    'caredForFamily',
    'plantedTree',
    'avoidedHate',
    'donated',
    'volunteered',
    'practicedHonesty',
    'respectedOthers',
    'avoidedWaste',
  ];

  // Validate that all provided activities are boolean
  for (const [key, value] of Object.entries(activities)) {
    if (allowedActivities.includes(key) && typeof value !== 'boolean') {
      return next(new ApiError(400, `Activity field '${key}' must be a boolean`));
    }
  }

  // Optional string validation
  if (notes && typeof notes !== 'string') {
    return next(new ApiError(400, 'Notes must be a string'));
  }

  if (notes && notes.length > 1000) {
    return next(new ApiError(400, 'Notes cannot exceed 1000 characters'));
  }

  next();
};
