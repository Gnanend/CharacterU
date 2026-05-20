const express = require('express');
const { getDashboardAnalytics } = require('../../controllers/analyticsController');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

// Apply the protect middleware to all routes in this file
router.use(protect);

router.route('/dashboard').get(getDashboardAnalytics);

module.exports = router;
