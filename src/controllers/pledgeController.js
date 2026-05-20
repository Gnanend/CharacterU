const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Pledge = require('../models/Pledge');

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

/**
 * @desc    Create a new pledge
 * @route   POST /api/v1/pledges
 * @access  Private
 */
exports.createPledge = asyncHandler(async (req, res) => {
  const { pledgeText, language, videoUrl } = req.body;

  if (!pledgeText) {
    throw new ApiError(400, 'Pledge text is required');
  }

  if (!videoUrl) {
    throw new ApiError(400, 'A video pledge is mandatory. Please upload a video URL.');
  }

  const pledge = await Pledge.create({
    user: req.user.id,
    pledgeText,
    language: language || 'en',
    videoUrl,
    status: 'submitted', // Setting status to submitted since they are submitting it now
  });

  res.status(201).json({
    success: true,
    pledge,
  });
});

/**
 * @desc    Get current user's pledges
 * @route   GET /api/v1/pledges/me
 * @access  Private
 */
exports.getMyPledges = asyncHandler(async (req, res) => {
  const pledges = await Pledge.find({ user: req.user.id }).sort('-createdAt');

  res.status(200).json({
    success: true,
    pledges,
  });
});
