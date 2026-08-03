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

/**
 * Configure Cloudinary for Course Resources
 */
const resourceStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'characteru/resources',
    resource_type: 'raw', // important for docs/pdfs/zips
  },
});

const uploadResource = multer({
  storage: resourceStorage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword', // doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/vnd.ms-powerpoint', // ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
      'application/vnd.ms-excel', // xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/zip',
      'application/x-zip-compressed'
    ];
    
    // Check extension as fallback
    const allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip'];
    const ext = file.originalname.split('.').pop().toLowerCase();
    
    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Invalid file type. Supported formats: pdf, doc, docx, ppt, pptx, xls, xlsx, zip.'), false);
    }
  },
});

module.exports = {
  uploadVideo,
  uploadAvatar,
  uploadResource,
};
