const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

// Helper to extract Cloudinary public_id from a full URL
const extractPublicId = (url) => {
  if (!url) return null;
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return null;
  const pathPart = url.substring(uploadIndex + 8);
  const pathParts = pathPart.split('/');
  if (pathParts[0].match(/^v\d+$/)) {
    pathParts.shift(); // Remove version string like v12345678
  }
  const publicIdWithExtension = pathParts.join('/');
  const lastDot = publicIdWithExtension.lastIndexOf('.');
  return lastDot !== -1 ? publicIdWithExtension.substring(0, lastDot) : publicIdWithExtension;
};

/**
 * Update the user's avatar in the database and clean up the old one in Cloudinary.
 * @param {string} userId - The user's ID
 * @param {string} newAvatarUrl - The new Cloudinary URL uploaded via Multer
 * @returns {Promise<Object>} The updated User document
 */
exports.updateAvatar = async (userId, newAvatarUrl) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Delete previous avatar from Cloudinary to prevent orphaned files
  if (user.avatar) {
    const oldPublicId = extractPublicId(user.avatar);
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (error) {
        console.error('Failed to delete old avatar from Cloudinary:', error.message);
        // Continue saving the new one even if cleanup fails
      }
    }
  }

  user.avatar = newAvatarUrl;
  await user.save();

  return user;
};
