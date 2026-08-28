const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Collect console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // Collect failed requests
  const failed = [];
  page.on('requestfailed', req => {
    failed.push(`${req.url()} - ${req.failure()?.errorText}`);
  });

  await page.goto('http://localhost:3000/generator', { waitUntil: 'networkidle' });

  // Take screenshot
  await page.screenshot({ path: '/data/nuxt-blue-red-and-purple/apps/web/gen-check.png', fullPage: false });

  // Check for layout issues
  const layoutInfo = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    const info = [];
    sections.forEach((s, i) => {
      const rect = s.getBoundingClientRect();
      const style = window.getComputedStyle(s);
      info.push({
        index: i,
        class: s.className,
        top: Math.round(rect.top),
        height: Math.round(rect.height),
        overflow: style.overflow,
        hasOverlap: false,
      });
    });

    // Check for overlaps
    for (let i = 0; i < info.length; i++) {
      for (let j = i + 1; j < info.length; j++) {
        if (info[i].top < info[j].top + info[j].height && info[j].top < info[i].top + info[i].height) {
          if (Math.abs(info[i].top - info[j].top) < 5) {
            info[i].hasOverlap = true;
            info[j].hasOverlap = true;
          }
        }
      }
    }

    return info;
  });

  // Check for horizontal overflow
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });

  // Check font loading
  const fontsLoaded = await page.evaluate(() => {
    return document.fonts.ready.then(() => document.fonts.check('1em Archivo'));
  });

  console.log('=== CONSOLE ERRORS ===');
  errors.forEach(e => console.log('❌', e));
  if (!errors.length) console.log('✅ No console errors');

  console.log('\n=== FAILED REQUESTS ===');
  failed.forEach(f => console.log('❌', f));
  if (!failed.length) console.log('✅ No failed requests');

  console.log('\n=== LAYOUT ===');
  layoutInfo.forEach(s => {
    const overlap = s.hasOverlap ? ' ⚠️ OVERLAP' : '';
    console.log(`Section ${s.index}: ${s.class.slice(0, 40)} | top=${s.top}px height=${s.height}px${overlap}`);
  });

  console.log('\n=== OVERFLOW ===');
  console.log(hasOverflow ? '⚠️ Horizontal overflow detected' : '✅ No horizontal overflow');

  console.log('\n=== FONTS ===');
  console.log(fontsLoaded ? '✅ Archivo loaded' : '⚠️ Archivo not loaded');

  await browser.close();
  console.log('\nScreenshot saved to gen-check.png');
})();
