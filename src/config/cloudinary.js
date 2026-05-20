const { v2: cloudinary } = require('cloudinary');

/**
 * Configure Cloudinary using environment variables.
 * Used for production-ready scalable video and image asset management.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
