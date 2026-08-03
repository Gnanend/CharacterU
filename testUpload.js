const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config({ path: '.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadPdf() {
  const pdfBuffer = fs.readFileSync('test_local.pdf');
  console.log('Local PDF size:', pdfBuffer.length);
  
  const pdfUrl = await new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { 
        folder: 'characteru/certificates', 
        resource_type: 'image', 
        format: 'pdf',
        access_mode: 'public',
        type: 'upload'
      }, 
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(pdfBuffer).pipe(stream);
  });
  
  console.log('Upload Result:', pdfUrl);
}

uploadPdf().catch(console.error);
