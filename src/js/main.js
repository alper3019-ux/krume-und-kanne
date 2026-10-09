import { berlinNow, openStatus, isoWeek } from './time.js';
import { LUNCH, DAY_NAMES } from '../data/menu.js';
import { initFilter } from './filter.js';
import { initForms } from './forms.js';

document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Navigation (mobil) */
const toggle = $('.nav-toggle');
const nav = $('#hauptnav');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav?.addEventListener('click', (e) => { if (e.target.closest('a') && toggle?.getAttribute('aria-expanded') === 'true') toggle.click(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { toggle.click(); toggle.focus(); } });

/* Live-Status, heutiger Tag, Mittagstisch */
function updateLive() {
  const now = berlinNow();
  const st = openStatus(now);
  for (const el of $$('[data-status]')) {
    el.classList.toggle('is-open', st.open);
    el.classList.toggle('is-closed', !st.open);
    $('.status__text', el).textContent = st.text;
  }
  for (const el of $$('[data-today-hours]')) el.textContent = `${DAY_NAMES[now.dow]}, ${st.todayText}`;
  const kw = `KW ${isoWeek(now)}`;
  for (const el of $$('[data-kw]')) el.textContent = `Diese Woche · ${kw}`;
  for (const el of $$('[data-kw-inline]')) el.textContent = `Karte der ${kw}.`;
  for (const el of $$('.hours tr[data-day]')) el.classList.toggle('is-today', +el.dataset.day === now.dow);
  for (const el of $$('.lunch__day')) {
    const today = +el.dataset.day === now.dow;
    el.classList.toggle('is-today', today);
    $('.lunch__today', el).hidden = !today;
  }
  const t = $('[data-lunch-today]');
  if (t) {
    const today = LUNCH.find((l) => l.day === now.dow);
    const next = LUNCH.find((l) => l.day > now.dow) || LUNCH[0];
    t.innerHTML = today
      ? `<strong>Heute:</strong> ${today.name}, ${today.price.toFixed(2).replace('.', ',')} €`
      : `Heute kein Mittagstisch. <strong>${DAY_NAMES[next.day]}:</strong> ${next.name}`;
  }
}
updateLive();
setInterval(updateLive, 60_000);

initFilter();
initForms();

/* Karte erst nach Klick (OpenStreetMap) */
$('[data-map-load]')?.addEventListener('click', (e) => {
  const map = e.target.closest('[data-map]');
  const f = document.createElement('iframe');
  f.title = 'OpenStreetMap: Ausschnitt Leipzig-Plagwitz (die Café-Adresse ist fiktiv)';
  f.src = 'https://www.openstreetmap.org/export/embed.html?bbox=12.3050%2C51.3205%2C12.3450%2C51.3380&layer=mapnik';
  f.loading = 'lazy';
  f.referrerPolicy = 'no-referrer';
  const note = document.createElement('p');
  note.className = 'map__consent';
  note.innerHTML = 'Kartenausschnitt: Leipzig-Plagwitz. Die Adresse des Cafés ist erfunden und deshalb nicht markiert. © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a>';
  map.replaceChildren(f, note);
  f.focus?.();
});
