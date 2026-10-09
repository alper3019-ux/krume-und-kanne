/**
 * Interaktionstest (Playwright): Status, Allergenfilter, Vorbestellung (Validierung + ehrliche Demo),
 * Catering, Karte erst nach Klick, Navigation mobil, Unterseiten, reduzierte Bewegung, Konsolenfehler.
 *   URL=http://localhost:47111/krume-und-kanne/ node scripts/interaction-test.mjs
 */
import { chromium } from 'playwright-core';
const URL = process.env.URL || 'http://localhost:47111/krume-und-kanne/';
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome' });
const errors = [];
let pass = 0, fail = 0;
const ok = (c, m) => { console.log(c ? '✓' : '✗', m); c ? pass++ : fail++; if (!c) process.exitCode = 1; };

async function run(reduced) {
  const L = reduced ? '[reduziert]' : '[normal]';
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, reducedMotion: reduced ? 'reduce' : 'no-preference', locale: 'de-DE', timezoneId: 'Europe/Berlin' });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${L} ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${L} ${e.message}`));
  const ext = [];
  page.on('request', (r) => { if (!r.url().startsWith(new globalThis.URL(URL).origin)) ext.push(r.url()); });
  await page.goto(URL, { waitUntil: 'networkidle' });
  const st = await page.textContent('[data-status] .status__text');
  ok(/geöffnet|Geschlossen/.test(st), `${L} Live-Status: „${st}“`);
  ok(/KW \d+/.test(await page.textContent('[data-kw]')), `${L} Kalenderwoche im Wochenkarten-Ticket`);
  ok(await page.locator('.dish').count() === 23, `${L} 23 Gerichte als HTML in der Karte`);
  // Filter ohne Gluten
  await page.locator('.chip:has(input[name=ohne][value=A])').click();
  await page.waitForTimeout(700);
  const visA = await page.$$eval('.dish:not([hidden])', (els) => els.map((e) => e.dataset.a));
  ok(visA.length > 0 && visA.every((a) => !a.split(' ').includes('A')), `${L} Filter „ohne Gluten“ zeigt nur Gerichte ohne A (${visA.length})`);
  ok(/von 23/.test(await page.textContent('[data-count]')), `${L} Live-Zähler aktualisiert (role=status)`);
  await page.locator('.chip:has(input[name=diet][value=vegan])').click(); await page.waitForTimeout(600);
  const vegan = await page.$$eval('.dish:not([hidden])', (els) => els.every((e) => e.dataset.diet === 'vegan'));
  ok(vegan, `${L} Filter vegan + ohne Gluten kombiniert`);
  ok(await page.locator('#karte-fruehstueck .menu-cat__empty').isVisible() === (await page.locator('#karte-fruehstueck .dish:not([hidden])').count() === 0), `${L} Leere Kategorie zeigt Hinweis`);
  await page.click('#filter button[type=reset]'); await page.waitForTimeout(600);
  ok(await page.locator('.dish:not([hidden])').count() === 23, `${L} Zurücksetzen zeigt wieder alle`);
  // Vorbestellen aus der Karte
  await page.click('[data-cake=bienenstich]'); await page.waitForTimeout(900);
  ok(await page.isChecked('input[name=kuchen][value=bienenstich]'), `${L} „Als ganzes Blech vorbestellen“ wählt Bienenstich vor`);
  ok(/Mandel/.test(await page.textContent('[data-sum-al]')), `${L} Allergene vor dem Absenden sichtbar`);
  await page.click('#order-form button[type=submit]');
  ok(await page.getAttribute('#o-datum', 'aria-invalid') === 'true', `${L} Leeres Datum → aria-invalid`);
  ok(await page.evaluate(() => document.activeElement.id) === 'o-datum', `${L} Fokus springt auf erstes Fehlerfeld`);
  // Montag wählen
  const monday = await page.evaluate(() => { const d = new Date(document.querySelector('#o-datum').min + 'T12:00:00Z'); while (d.getUTCDay() !== 1) d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); });
  await page.fill('#o-datum', monday); await page.click('#order-form button[type=submit]');
  ok(/Ruhetag/.test(await page.textContent('#o-datum-e')), `${L} Montag wird als Ruhetag abgelehnt`);
  const tue = await page.evaluate((m) => { const d = new Date(m + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); }, monday);
  await page.fill('#o-datum', tue); await page.selectOption('#o-zeit', { index: 2 }); await page.fill('#o-name', 'Test Person'); await page.fill('#o-tel', '0341 123456');
  await page.check('input[name=groesse][value=halb]', { force: true }); await page.fill('#o-anzahl', '2');
  ok((await page.textContent('[data-sum-price]')).includes('76,00'), `${L} Summe: 2 × halber Bienenstich = 76,00 €`);
  await page.click('#order-form button[type=submit]');
  const res = await page.textContent('#order-form [data-result]');
  ok(/nichts gesendet/.test(res) && /nur geprüft/.test(res), `${L} Ergebnis sagt ehrlich: nichts gesendet`);
  ok(await page.evaluate(() => document.activeElement.matches('[data-result]')), `${L} Fokus auf Ergebnis`);
  // Käsekuchen hat kein halbes Blech
  await page.check('input[name=kuchen][value=kaesekuchen]', { force: true });
  ok(await page.isDisabled('input[name=groesse][value=halb]'), `${L} Käsekuchen: „halb“ deaktiviert`);
  // Catering
  await page.click('#catering-form button[type=submit]');
  ok(await page.getAttribute('#c-anlass', 'aria-invalid') === 'true', `${L} Catering: Pflichtfelder geprüft`);
  await page.selectOption('#c-anlass', { index: 1 });
  const cd = await page.evaluate(() => document.querySelector('#c-datum').min);
  await page.fill('#c-datum', cd); await page.fill('#c-personen', '25'); await page.fill('#c-name', 'Test'); await page.fill('#c-mail', 'test@example.org');
  await page.click('#catering-form button[type=submit]');
  ok(/nichts gesendet/.test(await page.textContent('#catering-form [data-result]')), `${L} Catering: ehrliche Demo-Meldung`);
  // Karte erst nach Klick
  ok(ext.length === 0, `${L} Keine externen Anfragen vor dem Karten-Klick (${ext.length})`);
  ok(await page.locator('[data-map] iframe').count() === 0, `${L} Keine Karte ohne Einwilligung`);
  await page.click('[data-map-load]');
  ok(await page.locator('[data-map] iframe[src*="openstreetmap"]').count() === 1, `${L} Karte lädt nach Klick`);
  // Bewegung
  const anim = await page.evaluate(() => getComputedStyle(document.querySelector('.illu--hero .ln')).animationName);
  ok(reduced ? anim === 'none' : anim !== 'none', `${L} Hero-Animation ${reduced ? 'aus' : 'an'} (${anim})`);
  const dash = await page.evaluate(() => getComputedStyle(document.querySelector('.draw .ln')).strokeDashoffset);
  if (reduced) ok(dash === '0px' || dash === '0', `${L} Illustrationen sofort vollständig (dashoffset ${dash})`);
  await ctx.close();
}
await run(false);
await run(true);
// Mobil: Navigation
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(`[mobil] ${e.message}`));
  await p.goto(URL, { waitUntil: 'networkidle' });
  ok(!(await p.locator('#hauptnav').isVisible()), '[mobil] Navigation eingeklappt');
  await p.click('.nav-toggle');
  ok(await p.locator('#hauptnav').isVisible() && await p.getAttribute('.nav-toggle', 'aria-expanded') === 'true', '[mobil] Menü öffnet, aria-expanded=true');
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  ok(sw <= 390, `[mobil] kein horizontales Scrollen (scrollWidth ${sw})`);
  await ctx.close();
}
// Unterseiten
{
  const p = await browser.newPage();
  p.on('console', (m) => { if (m.type() === 'error' && !/404/.test(m.text())) errors.push(`[sub] ${m.text()}`); });
  p.on('pageerror', (e) => errors.push(`[sub] ${e.message}`));
  for (const s of ['allergene.html', 'impressum.html', 'datenschutz.html', 'bildrechte.html']) {
    const r = await p.goto(URL + s, { waitUntil: 'networkidle' });
    ok(r.status() === 200 && (await p.locator('h1').count()) === 1, `${s}: 200, eine h1`);
  }
  const r = await p.goto(URL + 'gibt-es-nicht', { waitUntil: 'networkidle' });
  ok(r.status() === 404 && /Krume/.test(await p.textContent('h1')), '404-Seite');
  await p.close();
}
ok(errors.length === 0, `Keine Konsolenfehler ${errors.length ? JSON.stringify(errors) : ''}`);
console.log(`\n${pass} bestanden, ${fail} fehlgeschlagen`);
await browser.close();
