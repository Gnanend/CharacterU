const mongoose = require('mongoose');

const employerApiLogSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true
    },
    apiKeyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    },
    responseStatus: {
      type: Number,
      required: true
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Index to help with rate limiting
employerApiLogSchema.index({ employer: 1, apiKeyId: 1, createdAt: 1 });

module.exports = mongoose.model('EmployerApiLog', employerApiLogSchema);
