import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';

async function generateTestPdfs() {
  // Fetch a real JPEG image
  const jpegRes = await fetch('https://picsum.photos/800/800.jpg');
  const jpegBytes = Buffer.from(await jpegRes.arrayBuffer());
  
  // Fetch a PNG image (often these are JPEGs disguised as PNGs if we just use picsum, let's use a reliable PNG source or generate one with canvas if we had it, but we can just use a known PNG URL)
  const pngRes = await fetch('https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png');
  const pngBytes = Buffer.from(await pngRes.arrayBuffer());

  const pdfJpeg = await PDFDocument.create();
  const pageJpeg = pdfJpeg.addPage([500, 500]);
  const jpgImage = await pdfJpeg.embedJpg(jpegBytes);
  pageJpeg.drawImage(jpgImage, { x: 0, y: 0, width: 500, height: 500 });
  await fs.writeFile('test-jpeg.pdf', await pdfJpeg.save());

  const pdfPng = await PDFDocument.create();
  const pagePng = pdfPng.addPage([500, 500]);
  const pngImage = await pdfPng.embedPng(pngBytes);
  pagePng.drawImage(pngImage, { x: 0, y: 0, width: 500, height: 500 });
  await fs.writeFile('test-png.pdf', await pdfPng.save());

  console.log('Created test-jpeg.pdf and test-png.pdf');
}

generateTestPdfs().catch(console.error);
