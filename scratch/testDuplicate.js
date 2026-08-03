
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const { Course, Module, Lesson, Quiz, Question } = require('./src/models/Course'); // or wherever they are

// I'll just use the controller directly, but I need to mock req and res
const adminController = require('./src/controllers/adminController');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  
  // Find a course
  // Wait, I don't need to actually run it if I can't easily mock the req/res.
}

