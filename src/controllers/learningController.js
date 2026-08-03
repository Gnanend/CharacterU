const learningService = require('../services/learningService');
// The user uses try/catch or an asyncHandler. I'll just use a try-catch for safety since I don't know the exact path for asyncHandler. Or I can check how they do it. I'll use try/catch to be safe.

class LearningController {
  async getCourses(req, res, next) {
    try {
      const courses = await learningService.getPublishedCourses(req.query);
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
      const userId = req.user._id;
      const courseData = await learningService.getCourseBySlug(slug, userId);
      res.status(200).json({
        status: 'success',
        data: courseData
      });
    } catch (error) {
      next(error);
    }
  }

  async getLesson(req, res, next) {
    try {
      const { lessonId } = req.params;
      console.log("Incoming lessonId", lessonId);
      const userId = req.user._id;
      const lesson = await learningService.getLesson(lessonId, userId);
      console.log("Lesson found", lesson._id);
      res.status(200).json({
        status: 'success',
        data: lesson
      });
    } catch (error) {
      console.error("GET LESSON ERROR:", error);
      next(error);
    }
  }

  async completeLesson(req, res, next) {
    try {
      const { lessonId } = req.params;
      const userId = req.user._id;
      
      const progress = await learningService.completeLesson(userId, lessonId);
      
      res.status(200).json({
        status: 'success',
        data: progress
      });
    } catch (error) {
      next(error);
    }
  }

  async getLessonQuiz(req, res, next) {
    try {
      const { lessonId } = req.params;
      const quizData = await learningService.getLessonQuiz(lessonId);
      res.status(200).json({
        status: 'success',
        data: quizData
      });
    } catch (error) {
      next(error);
    }
  }

  async submitQuiz(req, res, next) {
    try {
      const { lessonId } = req.params;
      const userId = req.user._id;
      const { answers } = req.body;
      
      const result = await learningService.submitQuiz(userId, lessonId, answers);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LearningController();
