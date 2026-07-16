const express = require('express');
const learningController = require('../../controllers/learningController');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/courses', learningController.getCourses);
router.get('/course/:slug', learningController.getCourseDetails);
router.get('/lesson/:lessonId', learningController.getLesson);
router.post('/lesson/:lessonId/complete', learningController.completeLesson);

module.exports = router;
