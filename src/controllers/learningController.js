const learningService = require('../services/learningService');
// The user uses try/catch or an asyncHandler. I'll just use a try-catch for safety since I don't know the exact path for asyncHandler. Or I can check how they do it. I'll use try/catch to be safe.

class LearningController {
  async getCourses(req, res, next) {
    try {
      const courses = await learningService.getPublishedCourses();
      res.status(200).json({
        status: 'success',
        data: courses
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourseDetails(req, res, next) {
    try {
      const { slug } = req.params;
      const courseData = await learningService.getCourseBySlug(slug);
      res.status(200).json({
        status: 'success',
        data: courseData
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LearningController();
