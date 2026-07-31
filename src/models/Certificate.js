const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  certificateId: { type: String, required: true, unique: true },
  verificationToken: { type: String, required: true, unique: true },
  characterScore: { type: Number, required: true },
  issuedDate: { type: Date, default: Date.now },
  blockchainNetwork: { type: String, default: 'Polygon Amoy' },
  transactionHash: { type: String, required: true },
  blockNumber: { type: Number, required: true },
  certificateHash: { type: String, required: true },
  qrCodeUrl: { type: String },
  pdfUrl: { type: String },
  status: { type: String, enum: ['Issued', 'Revoked'], default: 'Issued' }
}, { timestamps: true });

certificateSchema.index({ user: 1, status: 1 });
module.exports = mongoose.model('Certificate', certificateSchema);
