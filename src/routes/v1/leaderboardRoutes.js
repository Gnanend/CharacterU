const express = require('express');
const { getGlobalLeaderboard, getCountryLeaderboard, getCityLeaderboard } = require('../../controllers/leaderboardController');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

// Global endpoint is public
router.get('/global', getGlobalLeaderboard);

// Country and City require authentication
router.get('/country', protect, getCountryLeaderboard);
router.get('/city', protect, getCityLeaderboard);

module.exports = router;
