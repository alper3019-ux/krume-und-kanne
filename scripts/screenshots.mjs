// Screenshots für README/Portfolio: node scripts/screenshots.mjs <url> <outDir>
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const [url, out = 'screens'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome' });
const ctx = (o) => b.newContext({ locale: 'de-DE', timezoneId: 'Europe/Berlin', ...o });
const settle = (p, ms = 1800) => p.waitForTimeout(ms);
async function scrollTo(p, sel, offset = 0) {
  await p.evaluate(async ([s, o]) => { const y = document.querySelector(s).getBoundingClientRect().top + scrollY + o; for (let i = 0; i <= 12; i++) { scrollTo(0, y * i / 12); await new Promise((r) => setTimeout(r, 40)); } }, [sel, offset]);
}
// Desktop
{
  const c = await ctx({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await settle(p, 2600);
  await p.screenshot({ path: `${out}/desktop-hero.png` });
  // Signatur: Linien zeichnen sich beim Scrollen – Momentaufnahme mitten im Zeichnen + fertig
  await scrollTo(p, '#geschichte .story__item', -560); await settle(p, 900);
  await p.screenshot({ path: `${out}/desktop-signatur-zeichnen.png` });
  await scrollTo(p, '#geschichte .story__item', -120); await settle(p, 900);
  await p.screenshot({ path: `${out}/desktop-signatur-fertig.png` });
  // Allergenfilter
  await scrollTo(p, '#karte', 0); await settle(p, 500);
  await p.locator('.chip:has(input[value=A])').click(); await p.locator('.chip:has(input[value=G])').click(); await settle(p, 900);
  await scrollTo(p, '#karte .menu__layout', -100); await settle(p, 700);
  await p.screenshot({ path: `${out}/desktop-allergenfilter.png` });
  await scrollTo(p, '#mittag', -40); await settle(p, 900);
  await p.screenshot({ path: `${out}/desktop-mittagstisch.png` });
  await scrollTo(p, '#vorbestellen', 0); await p.locator('.cake').nth(1).click(); await settle(p, 500);
  await scrollTo(p, '#vorbestellen .order__cols', -470); await settle(p, 700);
  await p.screenshot({ path: `${out}/desktop-vorbestellen.png` });
  await c.close();
}
// Mobil
{
  const c = await ctx({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await c.newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await settle(p, 2600);
  await p.screenshot({ path: `${out}/mobile-hero.png` });
  await scrollTo(p, '#karte .menu__card', -20); await settle(p, 900);
  await p.screenshot({ path: `${out}/mobile-karte.png` });
  await scrollTo(p, '#geschichte .story__item', -80); await settle(p, 900);
  await p.screenshot({ path: `${out}/mobile-signatur.png` });
  await c.close();
}
await b.close();
console.log('ok');
