const express = require('express');
const router = express.Router();

/**
 * Health check route to verify the API is running
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CharacterU API is healthy',
    timestamp: new Date().toISOString()
  });
});

const authRoutes = require('./authRoutes');
const pledgeRoutes = require('./pledgeRoutes');
const checkInRoutes = require('./checkInRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const leaderboardRoutes = require('./leaderboardRoutes');
const profileRoutes = require('./profileRoutes');
const learningRoutes = require('./learningRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/pledges', pledgeRoutes);
router.use('/checkins', checkInRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/profile', profileRoutes);
router.use('/learning', learningRoutes);

module.exports = router;
