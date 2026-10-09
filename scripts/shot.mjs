// Schnelle Ansicht: node scripts/shot.mjs <url> <out.png> [w] [h] [full] [scrollTo-selector]
import { chromium } from 'playwright-core';
const [url, out, w = 1440, h = 900, full = '0', sel] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
const errs = []; p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', (e) => errs.push(e.message));
await p.goto(url, { waitUntil: 'networkidle' });
if (sel) { await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'start' }), sel); }
await p.waitForTimeout(2200);
await p.screenshot({ path: out, fullPage: full === '1' });
console.log('errors:', errs);
await b.close();
