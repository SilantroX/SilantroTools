const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

function createStaticServer(distDir, port = 4323) {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    let filePath = path.join(distDir, reqPath);
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';
    else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) filePath = path.join(filePath, 'index.html');

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.writeHead(200);
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

async function test() {
  const distDir = path.resolve(__dirname, 'dist');
  const server = await createStaticServer(distDir, 4323);
  const browser = await chromium.launch({ channel: 'msedge' });

  // 1. Mobile 375px
  {
    const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await context.newPage();
    await page.goto('http://localhost:4323/tools/qr-generator/', { waitUntil: 'networkidle' });
    const isOpen = await page.evaluate(() => document.getElementById('technical-guide-details')?.hasAttribute('open'));
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    console.log(`[Mobile 375px] Guide Open: ${isOpen} | ScrollHeight: ${scrollHeight}px | ScrollWidth: ${scrollWidth}px`);
    await context.close();
  }

  // 2. Desktop 1280px
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    await page.goto('http://localhost:4323/tools/qr-generator/', { waitUntil: 'networkidle' });
    const isOpen = await page.evaluate(() => document.getElementById('technical-guide-details')?.hasAttribute('open'));
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    console.log(`[Desktop 1280px] Guide Open: ${isOpen} | ScrollHeight: ${scrollHeight}px | ScrollWidth: ${scrollWidth}px`);
    await context.close();
  }

  await browser.close();
  server.close();
}

test().catch(console.error);
