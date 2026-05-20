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

// Future routes will be mounted here
// router.use('/users', userRoutes);

module.exports = router;
