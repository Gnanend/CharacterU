const express = require('express');
const router = express.Router();
const employerController = require('../../controllers/employerController');
const { protectEmployer } = require('../../middleware/employerAuthMiddleware');

router.post('/register', employerController.register);
router.post('/login', employerController.login);
router.post('/logout', employerController.logout);

router.get('/profile', protectEmployer, employerController.getProfile);
router.put('/profile', protectEmployer, employerController.updateProfile);

module.exports = router;

router.get('/search', protectEmployer, employerController.searchCandidates);
router.get('/candidate/:certificateId', protectEmployer, employerController.getCandidate);
