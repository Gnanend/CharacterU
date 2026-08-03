const express = require('express');
const router = express.Router();
const verificationController = require('../../controllers/verificationController');

router.get('/verify/:certificateId', verificationController.verifyCertificatePublic);

module.exports = router;
