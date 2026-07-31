const certificateService = require('../services/certificateService');
const asyncHandler = require('../utils/asyncHandler');

exports.getCertificateStatus = asyncHandler(async (req, res) => {
  const status = await certificateService.checkEligibilityAndStatus(req.user.id);
  res.status(200).json({ success: true, ...status });
});

exports.generateCertificate = asyncHandler(async (req, res) => {
  const certificate = await certificateService.issueNewCertificate(req.user.id);
  res.status(201).json({ success: true, certificate });
});

exports.verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await certificateService.verifyByToken(req.params.token);
  res.status(200).json({ success: true, certificate });
});
