const express = require('express');
const mentorController = require('../../controllers/mentorController');
const { protect } = require('../../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 chat requests per windowMs
  message: { status: 'fail', message: 'Too many messages sent. Please wait a moment.' }
});

const router = express.Router();

router.use(protect);

router.get('/', mentorController.getChatHistory);
router.post('/message', chatLimiter, mentorController.sendMessage);

module.exports = router;
