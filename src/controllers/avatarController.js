const avatarService = require('../services/avatarService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Upload user avatar
 * @route   POST /api/v1/profile/avatar
 * @access  Private
 */
exports.uploadAvatar = asyncHandler(async (req, res) => {
  // Check if file was successfully uploaded by multer
  if (!req.file) {
    throw new ApiError(400, 'Please upload a valid image file');
  }

  // The cloudinary URL is returned by multer-storage-cloudinary in req.file.path
  const newAvatarUrl = req.file.path;

  const user = await avatarService.updateAvatar(req.user.id, newAvatarUrl);

  res.status(200).json({
    success: true,
    message: 'Avatar uploaded successfully',
    user,
  });
});
