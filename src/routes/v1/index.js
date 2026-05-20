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

// Mount routes
router.use('/auth', authRoutes);
router.use('/pledges', pledgeRoutes);
router.use('/checkins', checkInRoutes);

module.exports = router;
