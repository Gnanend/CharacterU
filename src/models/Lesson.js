const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: [true, 'Lesson must belong to a Module'],
  },
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  pdfUrl: {
    type: String,
    default: '',
  },
  externalLinks: [{
    title: String,
    url: String,
  }],
  downloads: [{
    title: String,
    fileUrl: String,
  }],
  image: {
    type: String,
    default: '',
  },
  lessonType: { type: String, enum: ['Video', 'Reading', 'Assignment', 'Exercise'], default: 'Video' },
  freePreview: { type: Boolean, default: false },
  duration: { type: Number, default: 0 },
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

module.exports = mongoose.model('Lesson', lessonSchema);
