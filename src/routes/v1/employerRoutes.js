const express = require('express');
const router = express.Router();
const employerController = require('../../controllers/employerController');
const { protectEmployer } = require('../../middleware/employerAuthMiddleware');

router.post('/register', employerController.register);
router.post('/login', employerController.login);
router.post('/logout', employerController.logout);

router.get('/profile', protectEmployer, employerController.getProfile);
router.put('/profile', protectEmployer, employerController.updateProfile);

router.get('/search', protectEmployer, employerController.searchCandidates);
router.get('/candidate/:certificateId', protectEmployer, employerController.getCandidate);

router.get('/analytics', protectEmployer, employerController.getAnalytics);
router.get('/history', protectEmployer, employerController.getHistory);
router.post('/api-keys', protectEmployer, employerController.createApiKey);
router.delete('/api-keys/:keyId', protectEmployer, employerController.revokeApiKey);

module.exports = router;
