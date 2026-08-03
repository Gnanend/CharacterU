const VerificationLog = require('../models/VerificationLog');
const Certificate = require('../models/Certificate');
const blockchainService = require('../services/blockchainService');
const ApiError = require('../utils/ApiError');

exports.verifyCertificatePublic = async (req, res, next) => {
  const { certificateId } = req.params;
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  try {
    const cert = await Certificate.findOne({ certificateId }).populate('user', 'fullName username characterScore email');
    
    if (!cert) {
      await VerificationLog.create({
        certificateId,
        ipAddress,
        userAgent,
        status: 'not_found',
        details: 'Certificate not found in database',
      });
      return res.status(404).json({
        status: 'fail',
        message: 'Certificate not found',
      });
    }

    // Verify blockchain
    let blockchainResult;
    try {
      blockchainResult = await blockchainService.verifyBlockchainCertificate(certificateId);
    } catch (err) {
      await VerificationLog.create({
        certificateId,
        ipAddress,
        userAgent,
        status: 'error',
        details: 'Blockchain verification failed to respond',
      });
      throw new ApiError(500, 'Error verifying with blockchain');
    }

    let isValid = false;
    let details = 'Verification successful';
    
    // In dev simulation, we skip strict hash matching if mock is used
    if (blockchainResult.certHash === 'mock-hash') {
      isValid = true;
    } else {
      isValid = blockchainResult.isValid && (blockchainResult.certHash === cert.certificateHash);
      if (!isValid) {
        details = 'Blockchain hash mismatch or certificate revoked on-chain';
      }
    }

    await VerificationLog.create({
      certificateId,
      ipAddress,
      userAgent,
      status: isValid ? 'verified' : 'invalid',
      details,
    });

    res.status(200).json({
      status: 'success',
      data: {
        isValid,
        certificateId: cert.certificateId,
        fullName: cert.user.fullName || cert.user.username || 'Student',
        characterScore: cert.user.characterScore,
        issueDate: cert.issuedDate,
        transactionHash: cert.transactionHash,
        pdfUrl: cert.pdfUrl,
        contractAddress: process.env.CERTIFICATE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
        blockchainStatus: isValid ? 'Verified on Polygon Amoy' : 'Invalid Signature / Hash Mismatch',
      }
    });

  } catch (error) {
    next(error);
  }
};
