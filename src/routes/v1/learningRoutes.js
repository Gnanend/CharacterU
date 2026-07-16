const express = require('express');
const learningController = require('../../controllers/learningController');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/courses', learningController.getCourses);
router.get('/course/:slug', learningController.getCourseDetails);

module.exports = router;
