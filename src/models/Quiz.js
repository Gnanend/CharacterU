const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  titleKey: {
    type: String,
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  passingScore: {
    type: Number,
    required: true,
    default: 70
  },
  retryLimit: {
    type: Number,
    default: 3
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  timeLimit: {
    type: Number,
    default: 0
  },
  shuffleQuestions: {
    type: Boolean,
    default: false
  },
  allowRetry: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
