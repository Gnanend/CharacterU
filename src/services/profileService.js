const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Retrieves the profile of a user by their ID
 * @param {string} userId - The ID of the authenticated user
 * @returns {Promise<Object>} - The user document
 */
exports.getProfile = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }
  
  return user;
};

/**
 * Updates the profile of a user
 * @param {string} userId - The ID of the authenticated user
 * @param {Object} updateData - Validated fields to update
 * @returns {Promise<Object>} - The updated user document
 */
exports.updateProfile = async (userId, updateData) => {
  // Construct the object with only allowed fields
  const allowedUpdates = {};
  
  if (updateData.fullName !== undefined) allowedUpdates.fullName = updateData.fullName;
  if (updateData.city !== undefined) allowedUpdates.city = updateData.city;
  if (updateData.country !== undefined) allowedUpdates.country = updateData.country;
  if (updateData.language !== undefined) allowedUpdates.language = updateData.language;
  if (updateData.avatar !== undefined) allowedUpdates.avatar = updateData.avatar;

  // Perform the update
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: allowedUpdates },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, 'User profile not found');
  }

  return updatedUser;
};
