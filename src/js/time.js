/** Zeit in Europe/Berlin (unabhängig von der Zeitzone des Geräts). */
import { HOURS, DAY_NAMES } from '../data/menu.js';

export function berlinNow(d = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short',
  }).formatToParts(d).map((p) => [p.type, p.value]));
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  return { y: +parts.year, m: +parts.month, d: +parts.day, dow, min: +parts.hour * 60 + +parts.minute };
}
const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fmt = (t) => t.replace(/^0/, '');

/** Live-Status: geöffnet bis … / öffnet … */
export function openStatus(now = berlinNow()) {
  const h = HOURS[now.dow];
  if (h && now.min >= toMin(h[0]) && now.min < toMin(h[1])) {
    return { open: true, text: `Jetzt geöffnet · bis ${fmt(h[1])} Uhr`, todayText: `geöffnet bis ${fmt(h[1])} Uhr` };
  }
  if (h && now.min < toMin(h[0])) return { open: false, text: `Geschlossen · öffnet heute ${fmt(h[0])} Uhr`, todayText: `${fmt(h[0])}–${fmt(h[1])} Uhr` };
  for (let i = 1; i <= 7; i++) {
    const dow = (now.dow + i) % 7;
    if (HOURS[dow]) {
      const when = i === 1 ? 'morgen' : DAY_NAMES[dow];
      return { open: false, text: `Geschlossen · öffnet ${when} ${fmt(HOURS[dow][0])} Uhr`, todayText: h ? `heute geschlossen ab ${fmt(h[1])} Uhr` : 'heute Ruhetag' };
    }
  }
  return { open: false, text: 'Geschlossen', todayText: 'geschlossen' };
}

/** ISO-Kalenderwoche */
export function isoWeek({ y, m, d }) {
  const t = new Date(Date.UTC(y, m - 1, d));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y0) / 864e5 + 1) / 7);
}
export const isoDate = ({ y, m, d }) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
export function addDays({ y, m, d }, n) {
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), dow: t.getUTCDay() };
}
