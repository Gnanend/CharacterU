const mongoose = require('mongoose');

const verificationLogSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['verified', 'invalid', 'not_found', 'error'],
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VerificationLog', verificationLogSchema);
