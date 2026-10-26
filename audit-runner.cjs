const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Simple static server for dist/
function createStaticServer(distDir, port = 4321) {
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
    '.xml': 'application/xml',
    '.txt': 'text/plain',
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath.endsWith('/')) {
      reqPath += 'index.html';
    }
    let filePath = path.join(distDir, reqPath);
    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function runAudit() {
  const distDir = path.resolve(__dirname, 'dist');
  const server = await createStaticServer(distDir, 4321);
  console.log('Static server started at http://localhost:4321');

  const browser = await chromium.launch({ channel: 'msedge' });
  const routes = [
    '/',
    '/tools/qr-generator/',
    '/about/',
    '/contact/',
    '/privacy/',
    '/terms/',
    '/cookies/'
  ];

  const viewports = [
    { name: 'Mobile Small (320px)', width: 320, height: 600 },
    { name: 'Mobile Standard (375px)', width: 375, height: 667 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Desktop (1280px)', width: 1280, height: 800 },
  ];

  const results = {
    overflows: [],
    seo: [],
    accessibility: [],
    theme: [],
    pageMetrics: []
  };

  const page = await browser.newPage();

  for (const route of routes) {
    const url = `http://localhost:4321${route}`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // SEO checks
    const seoData = await page.evaluate(() => {
      const title = document.title;
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
      const h1Count = document.querySelectorAll('h1').length;
      const h1Text = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim()).join(' | ');
      const schemas = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
        try {
          return JSON.parse(s.innerHTML);
        } catch (e) {
          return { error: 'Invalid JSON' };
        }
      });
      return { title, metaDesc, canonical, ogTitle, ogDesc, ogImage, h1Count, h1Text, schemasCount: schemas.length, schemas };
    });

    results.seo.push({ route, ...seoData });

    // Measure viewports for overflows and document heights
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(100);

      const metrics = await page.evaluate((vpWidth) => {
        const docScrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const windowWidth = window.innerWidth;
        const scrollHeight = document.documentElement.scrollHeight;
        const hasHorizontalOverflow = docScrollWidth > windowWidth || bodyScrollWidth > windowWidth;

        // find offending elements if any
        let offending = [];
        if (hasHorizontalOverflow) {
          const all = document.querySelectorAll('*');
          all.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > windowWidth + 1) {
              offending.push({
                tag: el.tagName,
                class: (el.className || '').toString().slice(0, 50),
                right: rect.right,
                width: rect.width
              });
            }
          });
        }

        return {
          windowWidth,
          docScrollWidth,
          bodyScrollWidth,
          scrollHeight,
          hasHorizontalOverflow,
          offending: offending.slice(0, 5)
        };
      }, vp.width);

      if (metrics.hasHorizontalOverflow) {
        results.overflows.push({
          route,
          viewport: vp.name,
          ...metrics
        });
      }

      results.pageMetrics.push({
        route,
        viewport: vp.name,
        scrollHeight: metrics.scrollHeight
      });
    }

    // Accessibility basic check
    const a11y = await page.evaluate(() => {
      const skipLink = !!document.querySelector('a[href^="#main"], a[href^="#content"]');
      const missingAltImages = Array.from(document.querySelectorAll('img')).filter(img => !img.hasAttribute('alt')).length;
      const buttonsWithoutLabel = Array.from(document.querySelectorAll('button')).filter(btn => {
        const text = btn.innerText.trim();
        const ariaLabel = btn.getAttribute('aria-label');
        const ariaLabelledby = btn.getAttribute('aria-labelledby');
        return !text && !ariaLabel && !ariaLabelledby;
      }).length;
      const inputsWithoutLabel = Array.from(document.querySelectorAll('input, select, textarea')).filter(inp => {
        const id = inp.getAttribute('id');
        const hasAssociatedLabel = id && !!document.querySelector(`label[for="${id}"]`);
        const hasParentLabel = !!inp.closest('label');
        const hasAria = inp.hasAttribute('aria-label') || inp.hasAttribute('aria-labelledby');
        return !hasAssociatedLabel && !hasParentLabel && !hasAria && inp.type !== 'hidden';
      }).length;

      return {
        skipLink,
        missingAltImages,
        buttonsWithoutLabel,
        inputsWithoutLabel
      };
    });

    results.accessibility.push({ route, ...a11y });
  }

  // Check Theme Toggle functionality on home page
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  const themeInitial = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  const themeBtn = await page.$('#theme-toggle');
  let themeToggled = null;
  let themePersisted = null;
  if (themeBtn) {
    await themeBtn.click();
    themeToggled = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    themePersisted = await page.evaluate(() => localStorage.getItem('theme'));
  }
  results.theme.push({
    themeInitial,
    themeToggled,
    themePersisted,
    btnFound: !!themeBtn
  });

  console.log(JSON.stringify(results, null, 2));

  await browser.close();
  server.close();
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
