const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  question: {
    type: String,
    trim: true,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'multiple_select'],
    default: 'multiple_choice'
  },
  questionKey: {
    type: String,
  },
  options: [{
    type: String
  }],
  optionKeys: [{
    type: String,
  }],
  correctAnswer: {
    type: Number, // Index of the correct option for single choice
  },
  correctAnswers: [{
    type: Number // Indices for multiple select
  }],
  explanation: {
    type: String
  },
  explanationKey: {
    type: String,
  },
  points: {
    type: Number,
    default: 1
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
