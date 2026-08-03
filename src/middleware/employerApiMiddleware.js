const crypto = require('crypto');
const Employer = require('../models/Employer');
const EmployerApiLog = require('../models/EmployerApiLog');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.protectApiKey = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'No API key provided'));
  }

  const hashedKey = crypto.createHash('sha256').update(token).digest('hex');

  const employer = await Employer.findOne({ 'apiKeys.key': hashedKey });

  if (!employer) {
    return next(new ApiError(401, 'Invalid API key'));
  }

  const activeKey = employer.apiKeys.find(k => k.key === hashedKey);

  // Rate Limiting (1000 per day)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const usageToday = await EmployerApiLog.countDocuments({
    employer: employer._id,
    apiKeyId: activeKey._id,
    createdAt: { $gte: startOfDay }
  });

  if (usageToday >= 1000) {
    return next(new ApiError(429, 'Rate limit exceeded. Maximum 1000 requests per day.'));
  }

  activeKey.lastUsed = new Date();
  await employer.save();

  req.employer = employer;
  req.apiKeyId = activeKey._id;
  
  next();
});

exports.logApiUsage = (req, res, next) => {
  const originalSend = res.json;
  res.json = function(body) {
    res.locals.body = body;
    originalSend.call(this, body);
  };

  res.on('finish', async () => {
    try {
      if (req.employer && req.apiKeyId) {
        await EmployerApiLog.create({
          employer: req.employer._id,
          apiKeyId: req.apiKeyId,
          endpoint: req.originalUrl,
          responseStatus: res.statusCode,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });
      }
    } catch (err) {
      console.error('Failed to log API usage', err);
    }
  });
  
  next();
};
