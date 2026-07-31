const express = require('express');
const router = express.Router();
const certificateController = require('../../controllers/certificateController');
const { protect } = require('../../middleware/authMiddleware');

router.get('/status', protect, certificateController.getCertificateStatus);
router.post('/generate', protect, certificateController.generateCertificate);
router.get('/verify/:token', certificateController.verifyCertificate);

module.exports = router;
