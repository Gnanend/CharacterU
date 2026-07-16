const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const { AppError } = require('../middleware/errorMiddleware');
const Progress = require('../models/Progress');
const User = require('../models/User');

class LearningService {
  async getPublishedCourses() {
    return await Course.find({ isPublished: true }).sort({ order: 1 });
  }

  async getCourseBySlug(slug, userId) {
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

    let progress = null;
    if (userId) {
      progress = await Progress.findOne({ user: userId, course: course._id });
    }

    courseData.progress = progress || {
      completedLessons: [],
      completionPercentage: 0,
      xpEarned: 0
    };

    return courseData;
  }

  async getLesson(lessonId, userId) {
    const lesson = await Lesson.findById(lessonId).populate('module');
    if (!lesson || !lesson.isPublished) {
      const error = new Error('Lesson not found or not published');
      error.statusCode = 404;
      throw error;
    }
    
    // Find previous and next lessons
    const courseId = lesson.module.course;
    const modules = await Module.find({ course: courseId, isPublished: true }).sort({ order: 1 });
    const moduleIds = modules.map(m => m._id);
    const allLessons = await Lesson.find({ module: { $in: moduleIds }, isPublished: true }).sort({ order: 1 });
    
    const currentIndex = allLessons.findIndex(l => l._id.toString() === lessonId.toString());
    const prevLessonId = currentIndex > 0 ? allLessons[currentIndex - 1]._id : null;
    const nextLessonId = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1]._id : null;

    let isCompleted = false;
    if (userId) {
      const progress = await Progress.findOne({ user: userId, course: courseId });
      if (progress && progress.completedLessons.includes(lessonId)) {
        isCompleted = true;
      }
    }

    return {
      ...lesson.toObject(),
      prevLessonId,
      nextLessonId,
      isCompleted
    };
  }

  async completeLesson(userId, lessonId) {
    const lesson = await Lesson.findById(lessonId).populate('module');
    if (!lesson) {
      const error = new Error('Lesson not found');
      error.statusCode = 404;
      throw error;
    }

    const courseId = lesson.module.course;

    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = new Progress({
        user: userId,
        course: courseId,
        completedLessons: [],
        completionPercentage: 0,
        xpEarned: 0
      });
    }

    // Check if already completed
    if (progress.completedLessons.includes(lessonId)) {
      return progress;
    }

    // Add to completed
    progress.completedLessons.push(lessonId);
    progress.lastLesson = lessonId;
    progress.xpEarned += lesson.xpReward;

    // Calculate percentage
    const modules = await Module.find({ course: courseId, isPublished: true });
    const moduleIds = modules.map(m => m._id);
    const totalLessons = await Lesson.countDocuments({ module: { $in: moduleIds }, isPublished: true });

    progress.completionPercentage = totalLessons > 0 
      ? Math.round((progress.completedLessons.length / totalLessons) * 100)
      : 0;
      
    if (progress.completionPercentage >= 100) {
      progress.completedAt = new Date();
    }

    await progress.save();

    // Award XP to user
    await User.findByIdAndUpdate(userId, {
      $inc: { characterScore: lesson.xpReward }
    });

    return progress;
  }
}

module.exports = new LearningService();
