const fs = require('fs');
const crypto = require('crypto');

async function verifyFiles() {
  console.log('--- LOCAL PDF VERIFICATION ---');
  if (fs.existsSync('test_local.pdf')) {
    const localBuffer = fs.readFileSync('test_local.pdf');
    console.log('Local File Size:', localBuffer.length);
    console.log('Local SHA256:', crypto.createHash('sha256').update(localBuffer).digest('hex'));
    console.log('Starts with %PDF-:', localBuffer.toString('utf8', 0, 5) === '%PDF-');
  } else {
    console.log('Local file not found.');
  }

  console.log('\n--- CLOUDINARY FETCH VERIFICATION ---');
  try {
    // Attempt to download the RAW .pdf from Cloudinary
    const res = await fetch('https://res.cloudinary.com/dcexd3sz0/raw/upload/v1785505917/characteru/certificates/aeaacvdo9c9ctjtfuk44.pdf');
    const cloudBuffer = await res.arrayBuffer();
    const cloudBufferNode = Buffer.from(cloudBuffer);
    
    console.log('Cloudinary File Size:', cloudBufferNode.length);
    console.log('Cloudinary HTTP Status:', res.status);
    console.log('Headers:', [...res.headers.entries()].find(h => h[0] === 'x-cld-error') || 'No ACL Error');
    if (cloudBufferNode.length > 0) {
      console.log('Cloudinary SHA256:', crypto.createHash('sha256').update(cloudBufferNode).digest('hex'));
      console.log('Starts with %PDF-:', cloudBufferNode.toString('utf8', 0, 5) === '%PDF-');
    } else {
      console.log('WARNING: Cloudinary returned 0 bytes.');
    }
  } catch (err) {
    console.error('Fetch failed', err);
  }
}

verifyFiles();
