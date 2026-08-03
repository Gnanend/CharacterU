const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const { AppError } = require('../middleware/errorMiddleware');
const Progress = require('../models/Progress');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');

class LearningService {
  async getPublishedCourses(filters = {}) {
    const query = { isPublished: true };
    const { search, category, difficulty, instructor } = filters;
    
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleKey: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'all' && category !== '') query.category = category;
    if (difficulty && difficulty !== 'all' && difficulty !== '') query.difficulty = difficulty;
    if (instructor && instructor !== 'all' && instructor !== '') query.instructor = instructor;
    
    return await Course.find(query)
      .populate('instructor', 'fullName avatar')
      .sort({ order: 1, createdAt: -1 });
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

  async getLessonQuiz(lessonId) {
    const quiz = await Quiz.findOne({ lesson: lessonId, isPublished: true });
    if (!quiz) {
      const error = new Error('Quiz not found for this lesson');
      error.statusCode = 404;
      throw error;
    }

    const questions = await Question.find({ quiz: quiz._id }).select('-correctAnswer -explanationKey');
    
    return {
      quiz,
      questions
    };
  }

  async submitQuiz(userId, lessonId, answers) {
    const quiz = await Quiz.findOne({ lesson: lessonId, isPublished: true });
    if (!quiz) {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      throw error;
    }

    const questions = await Question.find({ quiz: quiz._id });
    
    let score = 0;
    const totalPossibleScore = questions.reduce((acc, q) => acc + q.points, 0);
    
    // Evaluate answers
    const evaluatedAnswers = answers.map(ans => {
      const question = questions.find(q => q._id.toString() === ans.questionId);
      const isCorrect = question && question.correctAnswer === ans.selectedAnswer;
      if (isCorrect) {
        score += question.points;
      }
      return {
        questionId: ans.questionId,
        selectedAnswer: ans.selectedAnswer
      };
    });

    const percentage = totalPossibleScore > 0 ? Math.round((score / totalPossibleScore) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

    let earnedXP = 0;

    // Check if user already passed this quiz
    const previousPass = await QuizAttempt.findOne({ user: userId, quiz: quiz._id, passed: true });

    if (passed && !previousPass) {
      const lesson = await Lesson.findById(lessonId);
      earnedXP = lesson ? lesson.xpReward : 0;
      await this.awardQuizXP(userId, lessonId, earnedXP);
    }

    const attempt = new QuizAttempt({
      user: userId,
      quiz: quiz._id,
      answers: evaluatedAnswers,
      score,
      percentage,
      passed,
      earnedXP
    });

    await attempt.save();

    // Return full questions with explanations so user can review
    return {
      attempt,
      questions
    };
  }

  async awardQuizXP(userId, lessonId, earnedXP) {
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
    progress.xpEarned += earnedXP;

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
    if (earnedXP > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { characterScore: earnedXP }
      });
    }

    return progress;
  }
}

module.exports = new LearningService();
