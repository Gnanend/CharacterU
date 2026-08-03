const fs = require('fs');
const PDFDocument = require('pdfkit');

async function testPdf() {
  const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 50 });
  const buffers = [];
  
  doc.on('data', chunk => buffers.push(chunk));
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(buffers);
    fs.writeFileSync('test_local.pdf', pdfBuffer);
    console.log('PDF saved locally, size:', pdfBuffer.length);
    console.log('Starts with %PDF-:', pdfBuffer.toString('utf8', 0, 5) === '%PDF-');
  });

  doc.rect(20, 20, 802, 555).lineWidth(5).stroke('#1e3a8a');
  doc.rect(30, 30, 782, 535).lineWidth(2).stroke('#3b82f6');
  doc.fontSize(40).fillColor('#1e3a8a').text('CharacterU Certificate', { align: 'center' }).moveDown();
  doc.fontSize(20).fillColor('#333333').text('This certifies that', { align: 'center' }).moveDown();
  doc.fontSize(35).fillColor('#2563eb').text('Demo User', { align: 'center' }).moveDown();
  doc.fontSize(16).fillColor('#333333').text('has successfully completed the Character Building Requirements', { align: 'center' });
  doc.text(`with a Character Score of 85`, { align: 'center' }).moveDown(2);

  const detailsY = doc.y;
  doc.fontSize(12).fillColor('#666666');
  doc.text(`Certificate ID: 123456`, 50, detailsY);
  doc.text(`Issued Date: ${new Date().toLocaleDateString()}`, 50, detailsY + 20);
  doc.text(`Blockchain: Polygon Amoy`, 50, detailsY + 40);
  doc.text(`Tx Hash: 0x123...`, 50, detailsY + 60);

  // We skip qrCode data URL here to simplify
  doc.moveTo(350, detailsY + 70).lineTo(500, detailsY + 70).lineWidth(1).stroke('#000000');
  doc.text('Authorized Signature', 370, detailsY + 80);
  doc.end();
}

testPdf();
