/**
 * Erzeugt aus den Original-Fotos (Wikimedia Commons, siehe photos/sources.json)
 * responsive AVIF- und WebP-Dateien in public/photos/.
 *   PHOTO_SRC=/pfad/zu/originalen node scripts/process-photos.mjs
 * Bearbeitung: nur Zuschnitt, Skalierung, Formatkonvertierung.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SRC = process.env.PHOTO_SRC || '/workspace/k12-photos/k1all';
const OUT = resolve('public/photos');
mkdirSync(OUT, { recursive: true });
const JOBS = [
  { key: 'brot', aspect: 4 / 5, fx: 0.5, fy: 0.45, widths: [400, 640, 900] },
  { key: 'kaffee', aspect: 4 / 5, fx: 0.47, fy: 0.5, widths: [400, 640, 900] },
  { key: 'streusel', aspect: 1, fx: 0.55, fy: 0.5, widths: [360, 560] },
  { key: 'bienenstich', aspect: 1, fx: 0.42, fy: 0.5, widths: [360, 560] },
  { key: 'pflaume', aspect: 1, fx: 0.5, fy: 0.5, widths: [360, 560] },
  { key: 'cheesecake', aspect: 1, fx: 0.45, fy: 0.6, widths: [360, 560] },
];
function cropBox(w, h, aspect, fx, fy) {
  let cw = w, ch = Math.round(w / aspect);
  if (ch > h) { ch = h; cw = Math.round(h * aspect); }
  return { left: Math.round(Math.min(Math.max(fx * w - cw / 2, 0), w - cw)), top: Math.round(Math.min(Math.max(fy * h - ch / 2, 0), h - ch)), width: cw, height: ch };
}
for (const v of JOBS) {
  const src = resolve(SRC, v.key);
  const meta = await sharp(src).metadata();
  const [W, H] = (meta.orientation || 1) >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];
  const cropped = await sharp(src).rotate().extract(cropBox(W, H, v.aspect, v.fx, v.fy)).toBuffer();
  const out = [];
  for (const w of v.widths) {
    const img = sharp(cropped).resize(w, Math.round(w / v.aspect));
    const avif = await img.clone().avif({ quality: 50, effort: 6 }).toBuffer();
    const webp = await img.clone().webp({ quality: 72, effort: 6 }).toBuffer();
    writeFileSync(resolve(OUT, `${v.key}-${w}.avif`), avif);
    writeFileSync(resolve(OUT, `${v.key}-${w}.webp`), webp);
    out.push(`${w}w ${(avif.length / 1024).toFixed(0)}K/${(webp.length / 1024).toFixed(0)}K`);
  }
  console.log(v.key, out.join(' | '));
}
