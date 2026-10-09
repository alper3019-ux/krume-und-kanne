// axe-core auf allen Unterseiten (Desktop + Mobil): node scripts/axe-pages.mjs <baseUrl> [out.txt]
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const [base, out] = process.argv.slice(2);
const pages = (process.env.PAGES || 'allergene.html,impressum.html,datenschutz.html,bildrechte.html,gibt-es-nicht').split(',');
const axe = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome' });
const lines = [];
for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobil', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp });
  for (const s of pages) {
    await p.goto(base + s, { waitUntil: 'networkidle', timeout: 120000 });
    await p.addScriptTag({ content: axe });
    const r = await p.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
    const l = `${name} ${s}: ${r.violations.length} Verstöße ${r.violations.map((v) => v.id + '(' + v.nodes.length + ')').join(', ')}`;
    console.log(l); lines.push(l);
  }
  await p.close();
}
await b.close();
if (out) writeFileSync(out, lines.join('\n') + '\n');
