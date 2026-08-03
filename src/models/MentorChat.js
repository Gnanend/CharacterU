const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const mentorChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [messageSchema],
  dailyMotivationalMessage: { type: String, default: '' },
  lastMotivationalUpdate: { type: Date, default: null }
}, { timestamps: true });

// Ensure one chat history per user
mentorChatSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('MentorChat', mentorChatSchema);
