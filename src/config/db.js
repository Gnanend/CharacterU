const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using Mongoose.
 * This function is separated to keep the server entry point clean.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected`);
    console.log(`MONGO_URI Loaded: ${!!process.env.MONGO_URI}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
