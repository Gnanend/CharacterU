const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using Mongoose.
 * This function is separated to keep the server entry point clean.
 */
const connectDB = async () => {
  try {
    console.log("MONGODB_URI:", process.env.MONGODB_URI);
    console.log("MONGO_URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || process.env.MONGO_URI
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
