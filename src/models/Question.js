const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  questionKey: {
    type: String,
    required: true
  },
  optionKeys: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number, // Index of the correct option in optionKeys
    required: true
  },
  explanationKey: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
