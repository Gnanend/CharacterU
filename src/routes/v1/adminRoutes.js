const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware');
const { uploadResource } = require('../../middleware/uploadMiddleware');

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/dashboard/stats', adminController.getDashboardStats);

router.get('/analytics/verification', adminController.getVerificationAnalytics);

// User Management (Admin)
router.get('/users', adminController.getAdminUsers);
router.get('/users/:id', adminController.getAdminUserById);
router.put('/users/:id', adminController.updateAdminUser);
router.patch('/users/:id/status', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.softDeleteUser);

// Course Management (Admin)
router.get('/courses', adminController.getCourses);
router.get('/courses/:id', adminController.getCourseById);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);
router.put('/courses/:id/publish', adminController.togglePublishCourse);
router.post('/courses/:id/duplicate', adminController.duplicateCourse);

// Module Management (Admin)
router.post('/modules', adminController.createModule);
router.put('/modules/:id', adminController.updateModule);
router.delete('/modules/:id', adminController.deleteModule);
router.patch('/modules/reorder', adminController.reorderModules);

// Lesson Management (Admin)
router.post('/lessons', adminController.createLesson);
router.put('/lessons/:id', adminController.updateLesson);
router.delete('/lessons/:id', adminController.deleteLesson);
router.patch('/lessons/reorder', adminController.reorderLessons);

// Quiz & Question Management (Admin)
router.get('/quizzes/:lessonId', adminController.getQuizByLesson);
router.post('/quizzes', adminController.createQuiz);
router.put('/quizzes/:id', adminController.updateQuiz);
router.delete('/quizzes/:id', adminController.deleteQuiz);

router.get('/questions/:quizId', adminController.getQuestionsByQuiz);
router.post('/questions', adminController.createQuestion);
router.put('/questions/:id', adminController.updateQuestion);
router.delete('/questions/:id', adminController.deleteQuestion);
router.patch('/questions/reorder', adminController.reorderQuestions);

// Resource Management (Admin)
router.get('/resources/:courseId', adminController.getResourcesByCourse);
router.post('/resources', uploadResource.single('file'), adminController.createResource);
router.put('/resources/:id', uploadResource.single('file'), adminController.updateResource);
router.delete('/resources/:id', adminController.deleteResource);

module.exports = router;
