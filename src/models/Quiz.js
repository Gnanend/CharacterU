const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  titleKey: {
    type: String,
    required: true
  },
  passingScore: {
    type: Number,
    required: true,
    default: 70
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
