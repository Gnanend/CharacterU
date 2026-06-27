const ApiError = require('../utils/ApiError');

/**
 * Middleware to validate the profile update request payload.
 */
exports.validateProfileUpdate = (req, res, next) => {
  const { fullName, city, country, language, avatar } = req.body;
  const errors = [];

  // Check for unexpected fields
  const allowedFields = ['fullName', 'city', 'country', 'language', 'avatar'];
  const requestFields = Object.keys(req.body);
  const unexpectedFields = requestFields.filter(field => !allowedFields.includes(field));
  
  if (unexpectedFields.length > 0) {
    errors.push(`Unexpected fields not allowed: ${unexpectedFields.join(', ')}`);
  }

  // fullName: required, trimmed, min 2, max 100
  if (fullName !== undefined) {
    if (typeof fullName !== 'string') {
      errors.push('Full name must be a string');
    } else if (fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    } else if (fullName.trim().length > 100) {
      errors.push('Full name cannot exceed 100 characters');
    }
  } else {
    errors.push('Full name is required');
  }

  // city: optional, trimmed, max 100
  if (city !== undefined && city !== null) {
    if (typeof city !== 'string') {
      errors.push('City must be a string');
    } else if (city.trim() === '') {
      errors.push('City cannot be an empty string');
    } else if (city.trim().length > 100) {
      errors.push('City cannot exceed 100 characters');
    }
  }

  // country: optional, trimmed, max 100
  if (country !== undefined && country !== null) {
    if (typeof country !== 'string') {
      errors.push('Country must be a string');
    } else if (country.trim() === '') {
      errors.push('Country cannot be an empty string');
    } else if (country.trim().length > 100) {
      errors.push('Country cannot exceed 100 characters');
    }
  }

  // language: optional, trimmed, max 10
  if (language !== undefined && language !== null) {
    if (typeof language !== 'string') {
      errors.push('Language must be a string');
    } else if (language.trim() === '') {
      errors.push('Language cannot be an empty string');
    } else if (language.trim().length > 10) {
      errors.push('Language cannot exceed 10 characters');
    }
  }

  // avatar: optional, must be valid URL
  if (avatar !== undefined && avatar !== null) {
    if (typeof avatar !== 'string') {
      errors.push('Avatar must be a string');
    } else if (avatar.trim() === '') {
      errors.push('Avatar cannot be an empty string');
    } else {
      try {
        new URL(avatar.trim());
      } catch (e) {
        errors.push('Avatar must be a valid URL');
      }
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, errors.join('. ')));
  }

  // Trim the values on the request body so controllers receive clean data
  if (req.body.fullName) req.body.fullName = req.body.fullName.trim();
  if (req.body.city) req.body.city = req.body.city.trim();
  if (req.body.country) req.body.country = req.body.country.trim();
  if (req.body.language) req.body.language = req.body.language.trim();
  if (req.body.avatar) req.body.avatar = req.body.avatar.trim();

  next();
};
