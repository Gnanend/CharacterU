const express = require('express');
const router = express.Router();
const employerApiController = require('../../controllers/employerApiController');
const { protectApiKey, logApiUsage } = require('../../middleware/employerApiMiddleware');

router.use(protectApiKey);
router.use(logApiUsage);

router.get('/verify/:certificateId', employerApiController.verifyCertificate);
router.get('/candidate/:certificateId', employerApiController.getCandidateProfile);
router.get('/certificate/:certificateId', employerApiController.getCertificateMeta);

module.exports = router;
