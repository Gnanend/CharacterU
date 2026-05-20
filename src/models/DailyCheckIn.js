const mongoose = require('mongoose');

/**
 * DailyCheckIn Schema defining the structure of a user's daily character activity tracking.
 * Used to track positive actions and calculate their character score.
 */
const dailyCheckInSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A daily check-in must be associated with a user'],
      index: true, // For quickly fetching a user's history
    },
    date: {
      type: Date,
      required: [true, 'A daily check-in must have a date'],
      // Note: The date should be normalized to UTC midnight in the controller 
      // before saving to ensure the compound unique index works correctly per day.
    },
    activities: {
      // Nested boolean fields representing daily positive actions
      helpedSomeone: { type: Boolean, default: false },
      avoidedConflict: { type: Boolean, default: false },
      exercised: { type: Boolean, default: false },
      learnedSomething: { type: Boolean, default: false },
      caredForFamily: { type: Boolean, default: false },
      plantedTree: { type: Boolean, default: false },
      avoidedHate: { type: Boolean, default: false },
      donated: { type: Boolean, default: false },
      volunteered: { type: Boolean, default: false },
      practicedHonesty: { type: Boolean, default: false },
      respectedOthers: { type: Boolean, default: false },
      avoidedWaste: { type: Boolean, default: false },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    score: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative'],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Compound Unique Index
 * Ensures that a specific user can only have exactly one check-in for a given normalized date.
 */
dailyCheckInSchema.index({ user: 1, date: 1 }, { unique: true });

const DailyCheckIn = mongoose.model('DailyCheckIn', dailyCheckInSchema);

module.exports = DailyCheckIn;
