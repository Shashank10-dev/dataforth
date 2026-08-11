import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  let retries = 5;
  while (retries > 0) {
    try {
      await page.goto('http://localhost:3000/pdf-tools/compress-pdf', { waitUntil: 'networkidle0', timeout: 5000 });
      break;
    } catch (e) {
      retries--;
      if (retries === 0) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Test JPEG
  const fileInput = await page.$('input[type=file]');
  await fileInput.uploadFile('./test-jpeg.pdf');
  
  // Wait for the UI to update
  await page.waitForSelector('button:has-text("Compress PDF")');
  await page.click('button:has-text("Compress PDF")');
  
  // Wait for the result
  await page.waitForSelector('a[download]', { timeout: 60000 });
  
  // Read before/after sizes
  const sizes = await page.evaluate(() => {
    const texts = Array.from(document.querySelectorAll('span')).map(el => el.textContent);
    // Find the text elements that contain "MB" to grab sizes
    return texts.filter(t => t.includes('MB'));
  });
  console.log('JPEG Test Results: ', sizes);

  // Test PNG (Fallback)
  await page.reload({ waitUntil: 'networkidle0' });
  const fileInput2 = await page.$('input[type=file]');
  await fileInput2.uploadFile('./test-png.pdf');
  
  await page.waitForSelector('button:has-text("Compress PDF")');
  
  // Capture console logs to see if fallback is exercised
  let fallbackExercised = false;
  page.on('console', msg => {
    if (msg.text().includes('Unsupported image encoding')) fallbackExercised = true;
  });
  
  await page.click('button:has-text("Compress PDF")');
  await page.waitForSelector('a[download]', { timeout: 60000 });
  
  const sizesPng = await page.evaluate(() => {
    const texts = Array.from(document.querySelectorAll('span')).map(el => el.textContent);
    return texts.filter(t => t.includes('MB'));
  });
  
  console.log('PNG (Fallback) Test Results: ', sizesPng);
  console.log('Fallback exercised (unsupported encoding):', fallbackExercised);

  await browser.close();
})();
