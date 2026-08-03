const Employer = require('../models/Employer');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
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

  // Hardcode 100% completion for now, or calculate if data exists
  res.status(200).json({ success: true, certificate: cert });
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
