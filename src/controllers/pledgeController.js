const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Upload a video to Cloudinary for a pledge
 * @route   POST /api/v1/pledges/upload-video
 * @access  Private
 */
exports.uploadVideo = asyncHandler(async (req, res) => {
  // The multer-storage-cloudinary middleware handles the actual streaming and upload.
  // If the request reaches this controller, the upload succeeded.
  
  if (!req.file) {
    throw new ApiError(400, 'Please upload a valid video file');
  }

  // Cloudinary populates req.file.path with the secure, hosted URL of the uploaded asset
  res.status(200).json({
    success: true,
    videoUrl: req.file.path,
  });
});
