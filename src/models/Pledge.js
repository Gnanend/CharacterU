const mongoose = require('mongoose');

/**
 * Pledge Schema defining the structure of a user's character pledge
 * Includes fields for text, optional video, verification workflow, and associated metadata.
 */
const pledgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A pledge must be associated with a user'],
      index: true, // Single index for quick lookups by user ID
    },
    pledgeText: {
      type: String,
      required: [true, 'Pledge text is required'],
      trim: true,
      minlength: [10, 'Pledge text must be at least 10 characters long'],
      maxlength: [2000, 'Pledge text cannot exceed 2000 characters']
    },
    videoUrl: {
      type: String,
      trim: true,
      // Basic URL validation pattern
      match: [/^https?:\/\/.+/, 'Please provide a valid URL for the video']
    },
    language: {
      type: String,
      default: 'en',
      trim: true,
      minlength: [2, 'Language code must be at least 2 characters (e.g. "en")'],
      maxlength: [10, 'Language code is too long']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'submitted', 'approved', 'rejected'],
        message: '{VALUE} is not a valid pledge status'
      },
      default: 'pending',
      index: true // Single index to quickly filter pledges by approval status
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    signedAt: {
      type: Date,
      default: Date.now
    },
    verificationNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Verification notes cannot exceed 1000 characters']
    }
  },
  {
    timestamps: true, // Automatically manages `createdAt` and `updatedAt` properties
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Compound index optimized for querying a specific user's pledges based on their status
 * Useful for dashboards displaying "My Approved Pledges" or "My Pending Pledges"
 */
pledgeSchema.index({ user: 1, status: 1 });

const Pledge = mongoose.model('Pledge', pledgeSchema);

module.exports = Pledge;
