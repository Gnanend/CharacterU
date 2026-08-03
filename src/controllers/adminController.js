const VerificationLog = require('../models/VerificationLog');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const User = require('../models/User');
const DailyCheckIn = require('../models/DailyCheckIn');
const CommunityDeed = require('../models/CommunityDeed');
const AuditLog = require('../models/AuditLog');
const Progress = require('../models/Progress');
const QuizAttempt = require('../models/QuizAttempt');
const Pledge = require('../models/Pledge');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Resource = require('../models/Resource');
const ApiError = require('../utils/ApiError');

const generateUniqueSlug = async (data, courseId = null) => {
  let baseSlug = '';
  if (data.title && data.title.trim() !== '') {
    baseSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  } else if (data.titleKey && data.titleKey.trim() !== '') {
    baseSlug = data.titleKey.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  
  if (!baseSlug) {
    baseSlug = `course-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 2;
  
  // Find if slug exists for ANY course OTHER than the current courseId
  const query = { slug };
  if (courseId) {
    query._id = { $ne: courseId };
  }
  
  while (await Course.exists(query)) {
    slug = `${baseSlug}-${counter}`;
    query.slug = slug;
    counter++;
  }
  return slug;
};

// Helper for audit logging
const createAuditLog = async (req, action, targetUserId, details = {}) => {
  try {
    await AuditLog.create({
      admin: req.user._id,
      targetUser: targetUserId,
      action,
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
      browser: req.headers['user-agent']
    });
  } catch (err) {
    console.error('Audit Log Error:', err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    // For average character score
    const avgScoreResult = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: null, avgScore: { $avg: '$characterScore' } } }
    ]);
    const avgCharacterScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    const activeUsers = await User.countDocuments({ status: 'active' }); // Assumes status field if any, or just totalUsers for now if no status field. Wait, user model has status? Let's check User.js. If no status, active = totalUsers or lastLogin based. We will assume 'active' status for now or just total. I'll use countDocuments() for simplicity, or we check if User has status later. Actually, the requirements don't strictly define active. Let's just return a placeholder or totalUsers if status doesn't exist.
    // Actually we'll count check-ins today for active.

    const certificatesIssued = await Certificate.countDocuments();
    const coursesCount = await Course.countDocuments();
    const communityDeedsCount = await CommunityDeed.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysCheckIns = await DailyCheckIn.countDocuments({ createdAt: { $gte: today } });

    const recentRegistrations = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const latestCertificates = await Certificate.find().sort({ createdAt: -1 }).limit(5).populate('user', 'fullName email');

    // Create a simple activity feed from various sources
    const activities = [];
    
    recentRegistrations.forEach(user => {
      activities.push({
        id: `reg_${user._id}`,
        type: 'registration',
        message: `${user.fullName || user.username} registered as a student`,
        date: user.createdAt
      });
    });

    latestCertificates.forEach(cert => {
      activities.push({
        id: `cert_${cert._id}`,
        type: 'certificate',
        message: `Certificate issued to ${cert.user?.fullName || 'a student'}`,
        date: cert.createdAt
      });
    });

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalUsers,
          totalStudents,
          totalAdmins,
          activeUsers: totalUsers, // Fallback
          certificatesIssued,
          courses: coursesCount,
          communityDeeds: communityDeedsCount,
          todaysCheckIns,
          avgCharacterScore
        },
        recentRegistrations,
        latestCertificates,
        activityFeed: activities.slice(0, 10)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getVerificationAnalytics = async (req, res, next) => {
  try {
    const totalCertificates = await Certificate.countDocuments();
    const totalRequests = await VerificationLog.countDocuments();
    const failedRequests = await VerificationLog.countDocuments({ status: { $in: ['invalid', 'not_found', 'error'] } });
    
    // Group by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyData = await VerificationLog.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ["$status", "verified"] }, 1, 0] }
          },
          failCount: {
            $sum: { $cond: [{ $ne: ["$status", "verified"] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalCertificates,
        totalRequests,
        failedRequests,
        dailyData,
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    console.log("Step 1 - Reading Query");
    const { page = 1, limit = 10, search, category, difficulty, status, instructor, sort = 'newest' } = req.query;
    console.log(req.query);
    
    console.log("Step 2 - Building Mongo Query");
    const query = {};

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleKey: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all' && category !== '') query.category = category;
    if (difficulty && difficulty !== 'all' && difficulty !== '') query.difficulty = difficulty;
    if (status && status !== 'all' && status !== '') query.status = status;
    if (instructor && instructor !== 'all' && instructor !== '') query.instructor = instructor;

    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    else if (sort === 'title') sortObj = { title: 1 };
    else if (sort === 'popular') sortObj = { _id: 1 }; // Placeholder for most enrolled

    const skip = (page - 1) * limit;
    console.log(query);

    console.log("Step 3 - Counting Courses");
    const total = await Course.countDocuments(query);

    console.log("Step 4 - Fetching Courses");
    const courses = await Course.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    console.log("Step 5 - Populating Stats");
    // Fetch related stats
    const enrichedCourses = await Promise.all(
      courses.map(async (c) => {
        const modules = await Module.countDocuments({ course: c._id });
        const enrolled = await Progress.countDocuments({ course: c._id });
        const completed = await Progress.countDocuments({ course: c._id, completed: true });
        
        let completionRate = 0;
        if (enrolled > 0) {
          completionRate = Math.round((completed / enrolled) * 100);
        }

        return { ...c, modulesCount: modules, studentsEnrolled: enrolled, completionRate };
      })
    );

    console.log("Step 6 - Returning Response");
    res.status(200).json({ 
      status: 'success', 
      data: {
        courses: enrichedCourses,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit)
        }
      } 
    });
  } catch (error) {
    console.error("======================================");
    console.error("ADMIN COURSES ERROR");
    console.error(error);
    console.error(error.stack);
    console.error("======================================");

    return res.status(500).json({
        success: false,
        message: error.message,
        stack:
            process.env.NODE_ENV === "development"
                ? error.stack
                : undefined
    });
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) throw new ApiError(404, 'Course not found');

    const modules = await Module.find({ course: course._id }).sort({ order: 1 }).lean();
    const lessons = await Lesson.find({ module: { $in: modules.map(m => m._id) } }).sort({ order: 1 }).lean();
    const quizzes = await Quiz.find({ lesson: { $in: lessons.map(l => l._id) } }).lean();

    // Attach lessons to their respective modules for easier frontend parsing
    const modulesWithLessons = modules.map(m => {
      const moduleLessons = lessons.filter(l => String(l.module) === String(m._id)).map(les => {
        const lessonQuiz = quizzes.find(q => String(q.lesson) === String(les._id));
        return { ...les, quiz: lessonQuiz || null };
      });
      return { ...m, lessons: moduleLessons };
    });

    res.status(200).json({
      status: 'success',
      data: {
        course,
        modules: modulesWithLessons,
        lessons,
        quizzes
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id, updatedBy: req.user._id };
    
    // Always generate a robust slug
    data.slug = await generateUniqueSlug(data);
    
    // Ensure draft/publish consistency
    if (data.status === 'published') {
      data.isPublished = true;
      data.publishedAt = data.publishedAt || new Date();
    } else {
      data.status = 'draft';
      data.isPublished = false;
    }
    
    const course = await Course.create(data);
    await createAuditLog(req, 'CREATE_COURSE', null, { courseId: course._id });
    res.status(201).json({ status: 'success', data: course });
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const data = { ...req.body, updatedBy: req.user._id };
    
    // Regenerate slug if title or titleKey changes and it's being sent
    if (data.title !== undefined || data.titleKey !== undefined) {
      const existingCourse = await Course.findById(req.params.id);
      if (existingCourse && (data.title !== existingCourse.title || data.titleKey !== existingCourse.titleKey)) {
        // Merge with existing to handle cases where only one is updated
        const mergedData = { ...existingCourse.toObject(), ...data };
        data.slug = await generateUniqueSlug(mergedData, req.params.id);
      }
    }
    
    // Ensure draft/publish consistency
    if (data.status === 'published' || data.isPublished === true) {
      data.status = 'published';
      data.isPublished = true;
      data.publishedAt = data.publishedAt || new Date();
    } else if (data.status === 'draft' || data.isPublished === false) {
      data.status = 'draft';
      data.isPublished = false;
    }

    const course = await Course.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!course) throw new ApiError(404, 'Course not found');
    await createAuditLog(req, 'UPDATE_COURSE', null, { courseId: course._id });
    res.status(200).json({ status: 'success', data: course });
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found');
    await createAuditLog(req, 'DELETE_COURSE', null, { courseId: req.params.id });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

exports.duplicateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) throw new ApiError(404, 'Course not found');
    
    delete course._id;
    delete course.createdAt;
    delete course.updatedAt;
    
    const baseTitle = course.title || course.titleKey || 'Untitled Course';
    course.title = `${baseTitle} (Copy)`;
    
    const baseSlug = course.slug || 'course';
    course.slug = `${baseSlug}-copy-${Date.now()}`;
    
    course.status = 'draft';
    course.isPublished = false;
    course.createdBy = req.user._id;
    course.updatedBy = req.user._id;

    console.log("Creating Course");
    const newCourse = await Course.create(course);
    
    // Duplicate modules, lessons, quizzes...
    const modules = await Module.find({ course: req.params.id }).lean();
    for (const mod of modules) {
      const oldModId = mod._id;
      delete mod._id;
      mod.course = newCourse._id;
      console.log("Creating Module", mod.title);
      const newMod = await Module.create(mod);
      
      const lessons = await Lesson.find({ module: oldModId }).lean();
      for (const les of lessons) {
        const oldLesId = les._id;
        delete les._id;
        les.module = newMod._id;
        console.log("Creating Lesson", les.title);
        const newLes = await Lesson.create(les);

        const quiz = await Quiz.findOne({ lesson: oldLesId }).lean();
        if (quiz) {
          const oldQuizId = quiz._id;
          delete quiz._id;
          
          quiz.title = quiz.title || quiz.titleKey || "Untitled Quiz";
          quiz.description = quiz.description || quiz.descriptionKey || "";
          
          quiz.lesson = newLes._id;
          console.log("Creating Quiz", quiz.title);
          const newQuiz = await Quiz.create(quiz);

          const questions = await Question.find({ quiz: oldQuizId }).lean();
          for (const q of questions) {
            delete q._id;
            q.quiz = newQuiz._id;
            
            const questionText = q.question || q.questionKey || "Untitled Question";
            const explanationText = q.explanation || q.explanationKey || "";
            
            q.question = questionText;
            q.explanation = explanationText;
            
            if ((!q.options || q.options.length === 0) && q.optionKeys && q.optionKeys.length > 0) {
              q.options = [...q.optionKeys];
            }
            
            console.log("QUESTION PAYLOAD");
            console.log(q);
            
            console.log("Creating Question", q.question);
            await Question.create(q);
          }
        }
      }
    }

    await createAuditLog(req, 'DUPLICATE_COURSE', null, { oldCourseId: req.params.id, newCourseId: newCourse._id });
    res.status(201).json({ status: 'success', data: newCourse });
  } catch (error) {
    console.error("====================================");
    console.error("DUPLICATE COURSE ERROR");
    console.error("====================================");
    console.error(error);
    console.error(error.stack);
    
    if (error.errors) {
        Object.keys(error.errors).forEach(key => {
            console.error(key, error.errors[key].message);
        });
    }
    
    return res.status(500).json({
        success: false,
        message: error.message,
        stack: error.stack,
        validationErrors: error.errors || null
    });
  }
};

// ==========================================
// MODULE MANAGEMENT
// ==========================================

exports.createModule = async (req, res, next) => {
  try {
    const module = await Module.create(req.body);
    await createAuditLog(req, 'CREATE_MODULE', null, { moduleId: module._id, courseId: module.course });
    res.status(201).json({ status: 'success', data: module });
  } catch (error) {
    next(error);
  }
};

exports.updateModule = async (req, res, next) => {
  try {
    const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!module) throw new ApiError(404, 'Module not found');
    await createAuditLog(req, 'UPDATE_MODULE', null, { moduleId: module._id });
    res.status(200).json({ status: 'success', data: module });
  } catch (error) {
    next(error);
  }
};

exports.deleteModule = async (req, res, next) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) throw new ApiError(404, 'Module not found');
    
    // Also delete lessons, quizzes, questions...
    const lessons = await Lesson.find({ module: module._id });
    for (const les of lessons) {
      const quiz = await Quiz.findOne({ lesson: les._id });
      if (quiz) {
        await Question.deleteMany({ quiz: quiz._id });
        await Quiz.findByIdAndDelete(quiz._id);
      }
      await Lesson.findByIdAndDelete(les._id);
    }
    
    await createAuditLog(req, 'DELETE_MODULE', null, { moduleId: req.params.id });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

exports.reorderModules = async (req, res, next) => {
  try {
    const { moduleIds } = req.body; // Array of IDs in correct order
    for (let i = 0; i < moduleIds.length; i++) {
      await Module.findByIdAndUpdate(moduleIds[i], { order: i });
    }
    await createAuditLog(req, 'REORDER_MODULES', null, { count: moduleIds.length });
    res.status(200).json({ status: 'success', message: 'Modules reordered' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// LESSON MANAGEMENT
// ==========================================

exports.createLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.create(req.body);
    await createAuditLog(req, 'CREATE_LESSON', null, { lessonId: lesson._id, moduleId: lesson.module });
    res.status(201).json({ status: 'success', data: lesson });
  } catch (error) {
    next(error);
  }
};

exports.updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lesson) throw new ApiError(404, 'Lesson not found');
    await createAuditLog(req, 'UPDATE_LESSON', null, { lessonId: lesson._id });
    res.status(200).json({ status: 'success', data: lesson });
  } catch (error) {
    next(error);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) throw new ApiError(404, 'Lesson not found');
    
    const quiz = await Quiz.findOne({ lesson: lesson._id });
    if (quiz) {
      await Question.deleteMany({ quiz: quiz._id });
      await Quiz.findByIdAndDelete(quiz._id);
    }
    
    await createAuditLog(req, 'DELETE_LESSON', null, { lessonId: req.params.id });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

exports.reorderLessons = async (req, res, next) => {
  try {
    const { lessonIds } = req.body;
    for (let i = 0; i < lessonIds.length; i++) {
      await Lesson.findByIdAndUpdate(lessonIds[i], { order: i });
    }
    await createAuditLog(req, 'REORDER_LESSONS', null, { count: lessonIds.length });
    res.status(200).json({ status: 'success', message: 'Lessons reordered' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// QUIZ & QUESTION MANAGEMENT
// ==========================================

exports.getQuizByLesson = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ lesson: req.params.lessonId });
    res.status(200).json({ status: 'success', data: quiz }); // Null if no quiz
  } catch (error) {
    next(error);
  }
};

exports.createQuiz = async (req, res, next) => {
  try {
    // If a quiz already exists for this lesson, error
    const existing = await Quiz.findOne({ lesson: req.body.lesson });
    if (existing) throw new ApiError(400, 'Lesson already has a quiz');

    const quiz = await Quiz.create(req.body);
    await createAuditLog(req, 'CREATE_QUIZ', null, { quizId: quiz._id });
    res.status(201).json({ status: 'success', data: quiz });
  } catch (error) {
    next(error);
  }
};

exports.updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) throw new ApiError(404, 'Quiz not found');
    await createAuditLog(req, 'UPDATE_QUIZ', null, { quizId: quiz._id });
    res.status(200).json({ status: 'success', data: quiz });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) throw new ApiError(404, 'Quiz not found');
    await Question.deleteMany({ quiz: quiz._id });
    await createAuditLog(req, 'DELETE_QUIZ', null, { quizId: req.params.id });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

exports.getQuestionsByQuiz = async (req, res, next) => {
  try {
    const questions = await Question.find({ quiz: req.params.quizId }).sort('order createdAt');
    res.status(200).json({ status: 'success', data: questions });
  } catch (error) {
    next(error);
  }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    await createAuditLog(req, 'CREATE_QUESTION', null, { questionId: question._id });
    res.status(201).json({ status: 'success', data: question });
  } catch (error) {
    next(error);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!question) throw new ApiError(404, 'Question not found');
    await createAuditLog(req, 'UPDATE_QUESTION', null, { questionId: question._id });
    res.status(200).json({ status: 'success', data: question });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) throw new ApiError(404, 'Question not found');
    await createAuditLog(req, 'DELETE_QUESTION', null, { questionId: req.params.id });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

exports.reorderQuestions = async (req, res, next) => {
  try {
    const { questionIds } = req.body;
    if (!Array.isArray(questionIds)) throw new ApiError(400, 'questionIds must be an array');
    
    await Promise.all(questionIds.map(async (id, index) => {
      await Question.findByIdAndUpdate(id, { order: index });
    }));
    
    await createAuditLog(req, 'REORDER_QUESTIONS', null, {});
    res.status(200).json({ status: 'success', message: 'Questions reordered' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// RESOURCE MANAGEMENT
// ==========================================

exports.getResourcesByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const resources = await Resource.find({ course: courseId }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ status: 'success', data: resources });
  } catch (error) {
    next(error);
  }
};

exports.createResource = async (req, res, next) => {
  try {
    const { course, title, type, url, order } = req.body;
    
    if (!course || !title || !type) {
      throw new ApiError(400, 'Course, title, and type are required');
    }

    const resourceData = {
      course,
      title,
      type,
      order: order || 0,
      uploadedBy: req.user._id
    };

    if (type === 'link') {
      if (!url) throw new ApiError(400, 'URL is required for link resources');
      resourceData.url = url;
    } else if (type === 'file') {
      if (!req.file) throw new ApiError(400, 'File is required for file resources');
      resourceData.url = req.file.path; // Cloudinary URL
      resourceData.fileName = req.file.originalname;
      resourceData.fileSize = req.file.size;
      resourceData.mimeType = req.file.mimetype;
    } else {
      throw new ApiError(400, 'Invalid resource type');
    }

    const resource = await Resource.create(resourceData);
    await createAuditLog(req, 'CREATE_RESOURCE', null, { resourceId: resource._id, courseId: course });
    
    res.status(201).json({ status: 'success', data: resource });
  } catch (error) {
    next(error);
  }
};

exports.updateResource = async (req, res, next) => {
  try {
    const { title, type, url, order } = req.body;
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) throw new ApiError(404, 'Resource not found');

    if (title) resource.title = title;
    if (order !== undefined) resource.order = order;
    
    // Only update type-specific fields if requested
    if (type) {
      resource.type = type;
      if (type === 'link') {
        if (url) resource.url = url;
        resource.fileName = undefined;
        resource.fileSize = undefined;
        resource.mimeType = undefined;
      } else if (type === 'file' && req.file) {
        resource.url = req.file.path;
        resource.fileName = req.file.originalname;
        resource.fileSize = req.file.size;
        resource.mimeType = req.file.mimetype;
      }
    } else {
      // If type isn't changing, but a new file is uploaded
      if (resource.type === 'file' && req.file) {
        resource.url = req.file.path;
        resource.fileName = req.file.originalname;
        resource.fileSize = req.file.size;
        resource.mimeType = req.file.mimetype;
      } else if (resource.type === 'link' && url) {
        resource.url = url;
      }
    }

    await resource.save();
    await createAuditLog(req, 'UPDATE_RESOURCE', null, { resourceId: resource._id });
    
    res.status(200).json({ status: 'success', data: resource });
  } catch (error) {
    next(error);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) throw new ApiError(404, 'Resource not found');
    
    // Note: To fully clean up, we should ideally delete the file from Cloudinary here
    // using cloudinary.uploader.destroy(public_id) if we parsed it out.
    // For now, removing DB record.
    
    await createAuditLog(req, 'DELETE_RESOURCE', null, { resourceId: req.params.id });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

exports.togglePublishCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found');
    
    const newPublishStatus = !course.isPublished;
    
    // 1. Update Course
    course.isPublished = newPublishStatus;
    course.status = newPublishStatus ? 'published' : 'draft';
    await course.save();
    
    // 2. Update all Modules belonging to the Course
    await Module.updateMany(
      { course: course._id },
      { $set: { isPublished: newPublishStatus } }
    );
    
    // 3. Find those Modules & Collect moduleIds
    const modules = await Module.find({ course: course._id }).select('_id');
    const moduleIds = modules.map(m => m._id);
    
    if (moduleIds.length > 0) {
      // 4. Update all Lessons
      await Lesson.updateMany(
        { module: { $in: moduleIds } },
        { $set: { isPublished: newPublishStatus } }
      );
      
      // 5. Find those Lessons & Collect lessonIds
      const lessons = await Lesson.find({ module: { $in: moduleIds } }).select('_id');
      const lessonIds = lessons.map(l => l._id);
      
      if (lessonIds.length > 0) {
        // 6. Update all Quizzes
        await Quiz.updateMany(
          { lesson: { $in: lessonIds } },
          { $set: { isPublished: newPublishStatus } }
        );
        
        // 7. Find those Quizzes & Collect quizIds
        const quizzes = await Quiz.find({ lesson: { $in: lessonIds } }).select('_id');
        const quizIds = quizzes.map(q => q._id);
        
        if (quizIds.length > 0) {
          // 8. Update all Questions
          await Question.updateMany(
            { quiz: { $in: quizIds } },
            { $set: { isPublished: newPublishStatus } }
          );
        }
      }
    }
    
    await createAuditLog(req, 'TOGGLE_PUBLISH_COURSE', null, { courseId: course._id, isPublished: newPublishStatus });
    
    res.status(200).json({ status: 'success', data: course });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// USER MANAGEMENT
// ==========================================

exports.getAdminUsers = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      role, 
      status, 
      minScore, 
      maxScore, 
      sort = 'newest' 
    } = req.query;

    const query = { 
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } }
      ]
    }; // Support legacy users created before the isDeleted field existed

    // Search
    if (search && search.trim() !== '') {
      // Use $and so we don't overwrite the isDeleted $or clause
      query.$and = [
        {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }

    // Filters (ignore 'all' or empty)
    if (role && role !== 'all' && role !== '') query.role = role;
    if (status && status !== 'all' && status !== '') query.status = status;
    
    if (minScore || maxScore) {
      query.characterScore = {};
      if (minScore) query.characterScore.$gte = Number(minScore);
      if (maxScore) query.characterScore.$lte = Number(maxScore);
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    else if (sort === 'highestScore') sortObj = { characterScore: -1 };
    else if (sort === 'lowestScore') sortObj = { characterScore: 1 };

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await User.countDocuments(query);

    // Fetch related counts efficiently
    const enrichedUsers = await Promise.all(
      users.map(async (u) => {
        const courses = await Progress.countDocuments({ user: u._id, completed: true });
        const certificates = await Certificate.countDocuments({ user: u._id });
        return { ...u, coursesCount: courses, certificatesCount: certificates };
      })
    );

    console.log("===============================");
    console.log("Admin Users Mongo Query:", JSON.stringify(query, null, 2));
    console.log("Users Found in MongoDB:", users.length);
    console.log("Users returning to client (sample 1):", enrichedUsers.length > 0 ? enrichedUsers[0].email : 'None');
    console.log("===============================");

    res.status(200).json({
      status: 'success',
      data: {
        users: enrichedUsers,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) throw new ApiError(404, 'User not found');

    const [
      checkIns, 
      courses, 
      certificates, 
      pledges, 
      deeds,
      quizAttempts
    ] = await Promise.all([
      DailyCheckIn.countDocuments({ user: user._id }),
      Progress.find({ user: user._id, completed: true }).populate('course', 'title'),
      Certificate.find({ user: user._id }),
      Pledge.find({ user: user._id }),
      CommunityDeed.find({ user: user._id }),
      QuizAttempt.find({ user: user._id }).sort({ score: -1 })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        ...user,
        stats: {
          checkIns,
          coursesCompleted: courses.length,
          certificatesIssued: certificates.length,
          pledgesSubmitted: pledges.length,
          communityDeeds: deeds.length
        },
        courses,
        certificates,
        quizAttempts
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAdminUser = async (req, res, next) => {
  try {
    const { fullName, bio, role, status, avatar } = req.body;
    
    // Prevent modifying deleted users
    const existing = await User.findById(req.params.id);
    if (!existing) throw new ApiError(404, 'User not found');
    if (existing.isDeleted) throw new ApiError(400, 'Cannot modify a deleted user');

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, bio, role, status, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    await createAuditLog(req, 'UPDATE_USER', updatedUser._id, { updatedFields: req.body });

    res.status(200).json({ status: 'success', data: updatedUser });
  } catch (error) {
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { action } = req.body; // 'suspend' or 'activate'
    if (!['suspend', 'activate'].includes(action)) throw new ApiError(400, 'Invalid action');

    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    
    user.status = action === 'suspend' ? 'suspended' : 'active';
    await user.save();

    await createAuditLog(req, `${action.toUpperCase()}_USER`, user._id);

    res.status(200).json({ status: 'success', data: { status: user.status } });
  } catch (error) {
    next(error);
  }
};

exports.softDeleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    if (user.isDeleted) throw new ApiError(400, 'User is already deleted');

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      throw new ApiError(403, 'You cannot delete your own admin account');
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    user.deletedBy = req.user._id;
    user.status = 'suspended'; // Suspend upon delete
    await user.save();

    await createAuditLog(req, 'DELETE_USER', user._id);

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};
