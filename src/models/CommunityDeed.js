const mongoose = require('mongoose');

const communityDeedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A community deed must be associated with a user'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    imageUrl: {
      type: String,
      required: [true, 'An image proof is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: '{VALUE} is not a valid status'
      },
      default: 'pending',
      index: true
    },
    pointsAwarded: {
      type: Number,
      default: 0
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    },
    rejectionReason: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CommunityDeed', communityDeedSchema);
