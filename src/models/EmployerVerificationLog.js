const mongoose = require('mongoose');

const employerVerificationLogSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true
    },
    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
      required: true
    },
    candidateName: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    },
    verificationResult: {
      type: String,
      enum: ['Valid', 'Invalid', 'Not Found'],
      required: true
    },
    blockchainVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('EmployerVerificationLog', employerVerificationLogSchema);
