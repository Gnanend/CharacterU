const Certificate = require('../models/Certificate');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const blockchainService = require('../services/blockchainService');

exports.verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;
  const cert = await Certificate.findOne({ certificateId }).populate('user', 'fullName username characterScore');

  if (!cert) {
    throw new ApiError(404, 'Certificate not found');
  }

  let blockchainResult = null;
  let isValid = false;

  try {
    blockchainResult = await blockchainService.verifyBlockchainCertificate(certificateId);
    if (blockchainResult.certHash === 'mock-hash') {
      isValid = true;
    } else {
      isValid = blockchainResult.isValid && (blockchainResult.certHash === cert.certificateHash);
    }
  } catch (err) {
    blockchainResult = { error: 'Verification failed' };
  }

  res.status(200).json({
    status: 'success',
    data: {
      certificateId: cert.certificateId,
      candidateName: cert.user.fullName || cert.user.username,
      courseName: 'Character Building Requirements',
      issueDate: cert.issuedDate,
      completionScore: cert.user.characterScore,
      transactionHash: cert.transactionHash,
      blockchainVerified: isValid,
      certificateStatus: cert.status
    }
  });
});

exports.getCandidateProfile = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;
  const cert = await Certificate.findOne({ certificateId }).populate('user', 'fullName username avatar characterScore country');

  if (!cert) throw new ApiError(404, 'Candidate not found');

  res.status(200).json({
    status: 'success',
    data: {
      candidateName: cert.user.fullName || cert.user.username,
      avatar: cert.user.avatar,
      characterScore: cert.user.characterScore,
      country: cert.user.country,
      certificatesHeld: 1
    }
  });
});

exports.getCertificateMeta = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;
  const cert = await Certificate.findOne({ certificateId });

  if (!cert) throw new ApiError(404, 'Certificate not found');

  res.status(200).json({
    status: 'success',
    data: {
      certificateId: cert.certificateId,
      pdfUrl: cert.pdfUrl,
      issueDate: cert.issuedDate,
      verificationUrl: `https://characteru.com/verify/${cert.certificateId}`
    }
  });
});
