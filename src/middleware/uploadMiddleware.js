const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

/**
 * Configure the Cloudinary storage engine for Multer.
 * This instructs Cloudinary to expect a video resource and restricts formats.
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'characteru/pledges', // Organize videos in this Cloudinary folder
    resource_type: 'video', // Must be set to 'video' for Cloudinary to process video files
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'], // Strict format validation
  },
});

/**
 * Multer upload middleware configured specifically for video files.
 * Validates the mimetype and limits the file size to prevent abuse.
 */
const uploadVideo = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Set file size limit to 50 MB
  },
  fileFilter: (req, file, cb) => {
    // Double check the mimetype natively in Node before pushing to Cloudinary
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Invalid file type. Only video files are allowed.'), false);
    }
  },
});

/**
 * Configure the Cloudinary storage engine for Avatar images.
 */
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'characteru/avatars', // Save avatars in this specific folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Allowed image formats
  },
});

/**
 * Multer upload middleware configured specifically for avatar images.
 * Limit file size to 5MB.
 */
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Invalid file type. Only image files (JPG, PNG, WEBP) are allowed.'), false);
    }
  },
});

module.exports = {
  uploadVideo,
  uploadAvatar,
};
