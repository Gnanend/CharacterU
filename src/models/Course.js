const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  titleKey: {
    type: String,
    required: [true, 'Course title key is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Course slug is required'],
    unique: true,
    trim: true,
  },
  descriptionKey: {
    type: String,
    required: [true, 'Course description key is required'],
  },
  thumbnail: {
    type: String,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  estimatedMinutes: {
    type: Number,
    default: 0,
  },
  xpReward: {
    type: Number,
    default: 0,
  },
  order: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);
