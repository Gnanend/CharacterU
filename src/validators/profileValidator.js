const ApiError = require('../utils/ApiError');

/**
 * Middleware to validate the profile update request payload.
 */
exports.validateProfileUpdate = (req, res, next) => {
  const { fullName, city, country, language, avatar } = req.body;
  const errors = [];
  const hasXSS = (str) => typeof str === 'string' && /<[^>]*>/g.test(str);

  // Check for unexpected fields
  const allowedFields = ['fullName', 'city', 'country', 'language', 'avatar'];
  const requestFields = Object.keys(req.body);
  const unexpectedFields = requestFields.filter(field => !allowedFields.includes(field));
  
  if (unexpectedFields.length > 0) {
    errors.push('validation.unexpectedFields');
  }

  // fullName: optional (for partial updates), trimmed, min 2, max 100
  if (fullName !== undefined) {
    if (typeof fullName !== 'string') {
      errors.push('validation.fullName.invalid');
    } else if (hasXSS(fullName)) {
      errors.push('validation.fullName.invalidChars');
    } else if (fullName.trim().length < 2) {
      errors.push('validation.fullName.minLength');
    } else if (fullName.trim().length > 100) {
      errors.push('validation.fullName.maxLength');
    }
  }

  // city: optional, trimmed, max 100
  if (city !== undefined && city !== null) {
    if (typeof city !== 'string') {
      errors.push('validation.city.invalid');
    } else if (hasXSS(city)) {
      errors.push('validation.city.invalidChars');
    } else if (city.trim() === '') {
      errors.push('validation.city.empty');
    } else if (city.trim().length > 100) {
      errors.push('validation.city.maxLength');
    }
  }

  // country: optional, trimmed, max 100
  if (country !== undefined && country !== null) {
    if (typeof country !== 'string') {
      errors.push('validation.country.invalid');
    } else if (hasXSS(country)) {
      errors.push('validation.country.invalidChars');
    } else if (country.trim() === '') {
      errors.push('validation.country.empty');
    } else if (country.trim().length > 100) {
      errors.push('validation.country.maxLength');
    }
  }

  // language: optional, trimmed, max 10
  if (language !== undefined && language !== null) {
    if (typeof language !== 'string') {
      errors.push('validation.language.invalid');
    } else if (language.trim() === '') {
      errors.push('validation.language.empty');
    } else if (!/^[a-zA-Z\-]{2,10}$/.test(language.trim())) {
      errors.push('validation.language.invalidCode');
    }
  }

  // avatar: optional, must be valid URL
  if (avatar !== undefined && avatar !== null) {
    if (typeof avatar !== 'string') {
      errors.push('validation.avatar.invalid');
    } else if (avatar.trim() === '') {
      errors.push('validation.avatar.empty');
    } else {
      try {
        new URL(avatar.trim());
      } catch (e) {
        errors.push('validation.avatar.invalidUrl');
      }
    }
  }

  if (errors.length > 0) {
    // Send the first error key to the frontend
    return next(new ApiError(400, 'Validation failed', errors[0]));
  }

  // Trim the values on the request body so controllers receive clean data
  if (req.body.fullName) req.body.fullName = req.body.fullName.trim();
  if (req.body.city) req.body.city = req.body.city.trim();
  if (req.body.country) req.body.country = req.body.country.trim();
  if (req.body.language) req.body.language = req.body.language.trim();
  if (req.body.avatar) req.body.avatar = req.body.avatar.trim();

  next();
};
