const Employer = require('../models/Employer');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const EmployerVerificationLog = require('../models/EmployerVerificationLog');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

exports.register = asyncHandler(async (req, res) => {
  const { companyName, companyEmail, password, industry, companySize } = req.body;

  const existingEmployer = await Employer.findOne({ companyEmail: companyEmail.toLowerCase() });
  if (existingEmployer) {
    throw new ApiError(409, 'Company email address is already in use');
  }

  const employer = await Employer.create({
    companyName,
    companyEmail,
    password,
    industry,
    companySize
  });

  const token = generateToken(employer._id);
  const sanitizedEmployer = employer.toObject();
  delete sanitizedEmployer.password;

  res.status(201).json({
    success: true,
    message: 'Employer registered successfully',
    token,
    employer: sanitizedEmployer
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { companyEmail, password } = req.body;

  const employer = await Employer.findOne({ companyEmail: companyEmail.toLowerCase() }).select('+password');
  
  if (!employer) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await employer.matchPassword(password);
  
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  employer.lastLogin = new Date();
  await employer.save();

  const token = generateToken(employer._id);
  const sanitizedEmployer = employer.toObject();
  delete sanitizedEmployer.password;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    employer: sanitizedEmployer
  });
});

exports.logout = asyncHandler(async (req, res) => {
  // Assuming frontend simply deletes token, we just return success
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

exports.getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    employer: req.employer
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { companyName, website, contactPerson, phone, industry, companySize, country } = req.body;

  const updatedEmployer = await Employer.findByIdAndUpdate(
    req.employer._id,
    { companyName, website, contactPerson, phone, industry, companySize, country },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    employer: updatedEmployer
  });
});

exports.getCandidate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;
  const cert = await Certificate.findOne({ certificateId }).populate('user', 'fullName email characterScore avatar');
  if (!cert) throw new ApiError(404, 'Certificate not found');

  // Log verification
  await EmployerVerificationLog.create({
    employer: req.employer._id,
    certificate: cert._id,
    candidateName: cert.user?.fullName || 'Unknown',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    verificationResult: 'Valid',
    blockchainVerified: !!cert.transactionHash
  });

  res.status(200).json({ success: true, certificate: cert });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { companyName, website, phone, industry, companySize, country } = req.body;
  
  const employer = req.employer;
  if (companyName) employer.companyName = companyName;
  if (website !== undefined) employer.website = website;
  if (phone !== undefined) employer.phone = phone;
  if (industry !== undefined) employer.industry = industry;
  if (companySize !== undefined) employer.companySize = companySize;
  if (country !== undefined) employer.country = country;

  await employer.save();

  res.status(200).json({ success: true, employer: employer.toObject() });
});

exports.searchCandidates = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(200).json({ success: true, results: [] });

  const users = await User.find({
    $or: [
      { fullName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ]
  }).select('_id');

  const userIds = users.map(u => u._id);

  const certificates = await Certificate.find({
    $or: [
      { certificateId: { $regex: query, $options: 'i' } },
      { user: { $in: userIds } }
    ]
  }).populate('user', 'fullName email characterScore avatar').sort({ issuedDate: -1 });

  res.status(200).json({ success: true, results: certificates });
});

exports.getAnalytics = asyncHandler(async (req, res) => {
  const employerId = req.employer._id;
  const totalLogs = await EmployerVerificationLog.countDocuments({ employer: employerId });
  const validLogs = await EmployerVerificationLog.countDocuments({ employer: employerId, verificationResult: 'Valid' });
  const recentLogs = await EmployerVerificationLog.find({ employer: employerId }).sort({ createdAt: -1 }).limit(1);
  const lastVerification = recentLogs.length ? recentLogs[0].createdAt : null;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const trend = await EmployerVerificationLog.countDocuments({ employer: employerId, createdAt: { $gte: sevenDaysAgo } });

  res.status(200).json({
    success: true,
    data: {
      totalSearches: totalLogs,
      totalVerified: validLogs,
      activeApiKeys: req.employer.apiKeys.length,
      lastVerification,
      trend7Days: trend,
    }
  });
});

exports.getHistory = asyncHandler(async (req, res) => {
  const history = await EmployerVerificationLog.find({ employer: req.employer._id })
    .populate('certificate', 'certificateId issuedDate')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: history
  });
});

exports.createApiKey = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const rawKey = crypto.randomBytes(32).toString('hex');
  const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');

  req.employer.apiKeys.push({ name, key: hashedKey });
  await req.employer.save();

  res.status(201).json({
    success: true,
    apiKey: rawKey,
    message: 'Store this key securely. It will not be shown again.'
  });
});

exports.revokeApiKey = asyncHandler(async (req, res) => {
  const { keyId } = req.params;
  req.employer.apiKeys = req.employer.apiKeys.filter(k => k._id.toString() !== keyId);
  await req.employer.save();
  res.status(200).json({ success: true, message: 'API key revoked' });
});
