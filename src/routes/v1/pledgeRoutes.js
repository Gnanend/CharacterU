const express = require('express');
const router = express.Router();
const pledgeController = require('../../controllers/pledgeController');
const { protect } = require('../../middleware/authMiddleware');
const { uploadVideo } = require('../../middleware/uploadMiddleware');

/**
 * @route   POST /api/v1/pledges/upload-video
 * @desc    Upload a video to Cloudinary securely
 * @access  Private (Requires valid JWT token)
 */
// 1. Authenticate user (protect)
// 2. Stream and upload the 'video' field to Cloudinary via Multer (uploadVideo.single('video'))
// 3. Handle response in controller
router.post('/upload-video', protect, uploadVideo.single('video'), pledgeController.uploadVideo);

module.exports = router;
