const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  titleKey: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  descriptionKey: {
    type: String,
    default: '',
  },
  shortDescription: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  banner: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'Uncategorized',
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  tags: [{
    type: String,
  }],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  language: {
    type: String,
    default: 'en',
  },
  duration: {
    type: Number,
    default: 0,
  },
  estimatedHours: {
    type: Number,
    default: 0,
  },
  estimatedMinutes: {
    type: Number,
    default: 0,
  },
  learningOutcomes: [{
    type: String,
  }],
  prerequisites: [{
    type: String,
  }],
  xpReward: {
    type: Number,
    default: 0,
  },
  characterPointsReward: {
    type: Number,
    default: 0,
  },
  certificateEligible: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  publishedAt: {
    type: Date,
  },
  version: {
    type: Number,
    default: 1,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);
