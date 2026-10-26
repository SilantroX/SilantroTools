const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

function createStaticServer(distDir, port = 4324) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.json': 'application/json',
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    let filePath = path.join(distDir, reqPath);
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';
    else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) filePath = path.join(filePath, 'index.html');

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

async function capture() {
  const distDir = path.resolve(__dirname, 'dist');
  const server = await createStaticServer(distDir, 4324);
  const outDir = path.resolve(__dirname, 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ channel: 'msedge' });

  const tasks = [
    { name: 'home-desktop-light', path: '/', width: 1280, height: 800, dark: false },
    { name: 'home-desktop-dark', path: '/', width: 1280, height: 800, dark: true },
    { name: 'home-mobile-light', path: '/', width: 375, height: 667, dark: false },
    { name: 'home-mobile-dark', path: '/', width: 375, height: 667, dark: true },
    { name: 'qr-desktop-light', path: '/tools/qr-generator/', width: 1280, height: 800, dark: false },
    { name: 'qr-desktop-dark', path: '/tools/qr-generator/', width: 1280, height: 800, dark: true },
    { name: 'qr-mobile-light', path: '/tools/qr-generator/', width: 375, height: 667, dark: false },
    { name: 'qr-mobile-dark', path: '/tools/qr-generator/', width: 375, height: 667, dark: true },
    { name: 'cookies-desktop', path: '/cookies/', width: 1280, height: 800, dark: false },
  ];

  for (const t of tasks) {
    const context = await browser.newContext({
      viewport: { width: t.width, height: t.height },
      colorScheme: t.dark ? 'dark' : 'light'
    });
    const page = await context.newPage();
    if (t.dark) {
      await page.addInitScript(() => {
        localStorage.setItem('theme', 'dark');
      });
    } else {
      await page.addInitScript(() => {
        localStorage.setItem('theme', 'light');
      });
    }
    await page.goto(`http://localhost:4324${t.path}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(outDir, `${t.name}.png`), fullPage: false });
    console.log(`Saved screenshot: ${t.name}.png`);
    await context.close();
  }

  await browser.close();
  server.close();
}

capture().catch(console.error);
