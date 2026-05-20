const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { validateRegister } = require('../../validators/authValidator');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegister, authController.register);

// Note: Login API is not built yet as per requirements

module.exports = router;
