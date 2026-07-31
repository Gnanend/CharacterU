const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User');
const Certificate = require('../models/Certificate');
const Pledge = require('../models/Pledge');
const CheckIn = require('../models/CheckIn');
const blockchainService = require('./blockchainService');
const ApiError = require('../utils/ApiError');

exports.checkEligibilityAndStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const checkIns = await CheckIn.countDocuments({ user: userId });
  const pledges = await Pledge.countDocuments({ user: userId, status: 'completed' });
  const existingCert = await Certificate.findOne({ user: userId });

  let profileFields = ['fullName', 'email', 'avatar', 'city', 'country'];
  let filledFields = profileFields.filter(field => user[field] && user[field] !== '').length;
  let profileCompletion = Math.round((filledFields / profileFields.length) * 100);

  const eligibility = {
    scoreRequirement: { current: user.characterScore, required: 80, met: user.characterScore >= 80 },
    checkInRequirement: { current: checkIns, required: 7, met: checkIns >= 7 },
    pledgeRequirement: { current: pledges, required: 1, met: pledges >= 1 },
    profileRequirement: { current: profileCompletion, required: 80, met: profileCompletion >= 80 }
  };

  const isEligible = Object.values(eligibility).every(req => req.met);

  return {
    isEligible,
    hasGenerated: !!existingCert,
    certificate: existingCert,
    requirements: eligibility
  };
};

exports.issueNewCertificate = async (userId) => {
  const status = await exports.checkEligibilityAndStatus(userId);
  if (status.hasGenerated) throw new ApiError(400, 'Certificate already issued');
  if (!status.isEligible) throw new ApiError(400, 'User not eligible for certificate');

  const user = await User.findById(userId);
  const certificateId = `CHR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const verificationToken = uuidv4();
  const issueDate = new Date();

  // 1. SHA-256 Hash
  const dataString = `${certificateId}|${user.fullName}|${user.characterScore}|${issueDate.toISOString()}`;
  const certificateHash = crypto.createHash('sha256').update(dataString).digest('hex');

  // 2. Blockchain Transaction
  let txDetails;
  try {
    txDetails = await blockchainService.issueBlockchainCertificate(certificateId, userId.toString(), certificateHash);
  } catch (error) {
    throw new ApiError(500, 'Blockchain registration failed.');
  }

  // 3. QR Code
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${verificationToken}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl);

  // 4. PDF Generation
  const pdfBuffer = await generatePDFBuffer(user.fullName, certificateId, user.characterScore, issueDate, qrCodeDataUrl, txDetails.transactionHash);
  
  const pdfUrl = await new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream({ folder: 'characteru/certificates', resource_type: 'raw', format: 'pdf' }, (error, result) => {
      if (result) resolve(result.secure_url);
      else reject(new ApiError(500, 'PDF upload failed'));
    });
    streamifier.createReadStream(pdfBuffer).pipe(stream);
  });

  // 5. MongoDB
  const cert = await Certificate.create({
    user: userId,
    certificateId,
    verificationToken,
    characterScore: user.characterScore,
    issuedDate: issueDate,
    transactionHash: txDetails.transactionHash,
    blockNumber: txDetails.blockNumber,
    certificateHash,
    qrCodeUrl: qrCodeDataUrl,
    pdfUrl
  });

  return cert;
};

exports.verifyByToken = async (token) => {
  const cert = await Certificate.findOne({ verificationToken: token }).populate('user', 'fullName');
  if (!cert) throw new ApiError(404, 'Invalid certificate token');
  return cert;
};

async function generatePDFBuffer(name, certId, score, date, qrDataUrl, txHash) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 50 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    doc.rect(20, 20, 802, 555).lineWidth(5).stroke('#1e3a8a');
    doc.rect(30, 30, 782, 535).lineWidth(2).stroke('#3b82f6');
    doc.fontSize(40).fillColor('#1e3a8a').text('CharacterU Certificate', { align: 'center' }).moveDown();
    doc.fontSize(20).fillColor('#333333').text('This certifies that', { align: 'center' }).moveDown();
    doc.fontSize(35).fillColor('#2563eb').text(name, { align: 'center' }).moveDown();
    doc.fontSize(16).fillColor('#333333').text('has successfully completed the Character Building Requirements', { align: 'center' });
    doc.text(`with a Character Score of ${score}`, { align: 'center' }).moveDown(2);

    const detailsY = doc.y;
    doc.fontSize(12).fillColor('#666666');
    doc.text(`Certificate ID: ${certId}`, 50, detailsY);
    doc.text(`Issued Date: ${date.toLocaleDateString()}`, 50, detailsY + 20);
    doc.text(`Blockchain: Polygon Amoy`, 50, detailsY + 40);
    doc.text(`Tx Hash: ${txHash.substring(0,20)}...`, 50, detailsY + 60);

    if (qrDataUrl) {
      doc.image(qrDataUrl, 650, detailsY, { fit: [100, 100] });
    }

    doc.moveTo(350, detailsY + 70).lineTo(500, detailsY + 70).lineWidth(1).stroke('#000000');
    doc.text('Authorized Signature', 370, detailsY + 80);
    doc.end();
  });
}
