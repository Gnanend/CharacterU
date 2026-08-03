const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Resource must belong to a course']
  },
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['file', 'link'],
    required: [true, 'Resource type must be either file or link']
  },
  url: {
    type: String
  },
  fileName: {
    type: String
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
