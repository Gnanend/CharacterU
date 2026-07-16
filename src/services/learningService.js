const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const { AppError } = require('../middleware/errorMiddleware'); // Ensure this is correct path to AppError if it exists, actually usually they use Error object or custom throw. Let me check the user's project structure. Wait, I will just throw an error. Wait, errorMiddleware usually exports AppError. Or I'll just throw new Error() if not found, and let errorHandler catch it.

class LearningService {
  async getPublishedCourses() {
    return await Course.find({ isPublished: true }).sort({ order: 1 });
  }

  async getCourseBySlug(slug) {
    const course = await Course.findOne({ slug, isPublished: true });
    
    if (!course) {
      const error = new Error('Course not found or not published');
      error.statusCode = 404;
      throw error;
    }

    const modules = await Module.find({ course: course._id, isPublished: true }).sort({ order: 1 });
    
    const courseData = {
      ...course.toObject(),
      modules: []
    };

    for (const mod of modules) {
      const lessons = await Lesson.find({ module: mod._id, isPublished: true }).sort({ order: 1 });
      courseData.modules.push({
        ...mod.toObject(),
        lessons
      });
    }

    return courseData;
  }
}

module.exports = new LearningService();
