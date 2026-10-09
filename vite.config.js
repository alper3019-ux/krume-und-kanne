/**
 * Vite-Konfiguration (Multi-Page). Ziel über .env:
 *   VITE_BASE      Unterpfad, z. B. "/krume-und-kanne/" (GitHub Pages)
 *   VITE_SITE_URL  absolute URL mit Schrägstrich (canonical, og:url, Sitemap)
 * Das Plugin "partials" setzt Kopf/Fuß, Illustrationen und die aus den Daten
 * erzeugte Speisekarte zur Build-Zeit ins HTML ein (funktioniert ohne JS, gut für SEO).
 */
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { renderMenu, renderAllergenTable, renderLegend, renderLunch, renderCakeOptions, renderHours, renderFilter } from './src/data/render.js';

const root = import.meta.dirname;
const partial = (name) => readFileSync(resolve(root, 'src/partials', name), 'utf8');
const illu = (name) => readFileSync(resolve(root, 'src/illu', name + '.svg'), 'utf8');

function renderCredits() {
  const src = JSON.parse(readFileSync(resolve(root, 'photos/sources.json'), 'utf8'));
  const use = { brot: 'Geschichte (Sauerteig)', kaffee: 'Geschichte (Kaffee)', streusel: 'Vorbestellung', bienenstich: 'Vorbestellung', pflaume: 'Vorbestellung', cheesecake: 'Vorbestellung' };
  const e = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<ul class="credits" role="list">${Object.entries(src).map(([k, v]) => `
    <li><img src="{{BASE}}photos/${k}-${k === 'brot' || k === 'kaffee' ? 400 : 360}.webp" width="120" height="${k === 'brot' || k === 'kaffee' ? 150 : 120}" alt="" loading="lazy">
      <div><p><strong>${e(v.title.replace(/^File:/, ''))}</strong><br>Urheber:in: ${e(v.artist)} · Lizenz: <a href="${e(v.licenseUrl)}">${e(v.license)}</a><br>
      Quelle: <a href="${e(v.page)}">Wikimedia Commons</a> · Verwendet in: ${use[k]}<br>
      Bearbeitung: zugeschnitten, verkleinert, als AVIF/WebP gespeichert.${v.license.includes('SA') ? ' Die bearbeitete Fassung steht ebenfalls unter ' + e(v.license) + '.' : ''}</p></div></li>`).join('')}</ul>`;
}

function partials(env) {
  return {
    name: 'kk-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        let out = html
          .replaceAll('<!--HEADER-->', partial('header.html'))
          .replaceAll('<!--FOOTER-->', partial('footer.html'))
          .replaceAll('<!--MENU-->', renderMenu())
          .replaceAll('<!--LEGEND-->', renderLegend())
          .replaceAll('<!--ALLERGEN_TABLE-->', renderAllergenTable())
          .replaceAll('<!--LUNCH-->', renderLunch())
          .replaceAll('<!--CAKES-->', renderCakeOptions())
          .replaceAll('<!--HOURS-->', renderHours())
          .replaceAll('<!--FILTER-->', renderFilter())
          .replaceAll('<!--CREDITS-->', renderCredits());
        out = out.replace(/<!--ILLU:([a-z0-9-]+)-->/g, (_, n) => illu(n));
        return out
          .replaceAll('{{BASE}}', env.VITE_BASE || '/')
          .replaceAll('{{SITE}}', env.VITE_SITE_URL || '/')
          .replaceAll('{{MAIL}}', env.VITE_CONTACT_EMAIL || 'hallo@example.com');
      },
    },
  };
}

/** Preload der Hauptschrift (Fraunces), Dateiname kommt aus dem Bundle. */
function fontPreload(base) {
  return {
    name: 'kk-font-preload',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const f = Object.keys(ctx.bundle).find((k) => /fraunces-soft-sub.*\.woff2$/.test(k));
        if (!f) return html;
        return html.replace('</title>', `</title>\n  <link rel="preload" href="${base}${f}" as="font" type="font/woff2" crossorigin>`);
      },
    },
  };
}

function seoFiles(siteUrl) {
  const pages = ['', 'allergene.html'];
  return {
    name: 'kk-seo-files',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n` });
      const d = new Date().toISOString().slice(0, 10);
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${siteUrl}${p}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n` });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, 'VITE_');
  return {
    base: env.VITE_BASE || '/',
    plugins: [partials(env), fontPreload(env.VITE_BASE || '/'), seoFiles(env.VITE_SITE_URL)],
    server: { port: 47110, strictPort: true },
    build: {
      outDir: 'dist',
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      rollupOptions: {
        input: Object.fromEntries(['index', 'allergene', 'impressum', 'datenschutz', 'bildrechte', '404'].map((n) => [n === '404' ? 'notfound' : n, resolve(root, `${n}.html`)])),
      },
    },
  };
});
