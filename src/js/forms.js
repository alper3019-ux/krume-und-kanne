/**
 * Ehrliche Demo-Formulare: validieren barrierearm, senden aber nichts.
 * VITE_FORM_MODE=mailto öffnet stattdessen das E-Mail-Programm mit vorausgefülltem Text.
 */
import { berlinNow, addDays, isoDate } from './time.js';

const MODE = import.meta.env.VITE_FORM_MODE || 'demo';
const MAIL = import.meta.env.VITE_CONTACT_EMAIL || 'hallo@example.com';
const eur = (n) => n.toFixed(2).replace('.', ',') + ' €';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtDate = (iso) => { const [y, m, d] = iso.split('-'); return new Date(Date.UTC(+y, +m - 1, +d)).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); };

function setError(input, errEl, msg) {
  const bad = !!msg;
  if (input) input.setAttribute('aria-invalid', String(bad));
  if (errEl) { errEl.hidden = !bad; if (msg) errEl.textContent = msg; }
  return bad;
}

function showResult(form, title, rows, explain) {
  const box = form.querySelector('[data-result]');
  const mailBody = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(form.dataset.form)}&body=${encodeURIComponent(mailBody)}`;
  box.innerHTML = `
    <h3>${esc(title)}</h3>
    <p><strong>${MODE === 'mailto' ? 'Ihr E-Mail-Programm wurde mit diesen Angaben geöffnet. Erst wenn Sie dort auf Senden klicken, geht etwas raus.' : 'Demo-Modus: Es wurde nichts gesendet und nichts gespeichert.'}</strong></p>
    <dl>${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
    <p>${esc(explain)}</p>`;
  box.hidden = false;
  box.focus();
  if (MODE === 'mailto') location.href = mailto;
}

function initOrder() {
  const form = document.getElementById('order-form');
  if (!form) return;
  const now = berlinNow();
  let min = addDays(now, 2);
  if (min.dow === 1) min = addDays(min, 1);
  const date = form.querySelector('#o-datum');
  date.min = isoDate(min);
  date.max = isoDate(addDays(now, 60));
  const qty = form.querySelector('#o-anzahl');
  const half = form.querySelector('input[name=groesse][value=halb]');
  const whole = form.querySelector('input[name=groesse][value=ganz]');
  const line = form.querySelector('[data-sum-line]');
  const al = form.querySelector('[data-sum-al]');
  const price = form.querySelector('[data-sum-price]');

  const cake = () => form.querySelector('input[name=kuchen]:checked');
  function update() {
    const c = cake();
    if (!c) { line.textContent = 'Noch kein Kuchen gewählt.'; al.hidden = true; price.textContent = '–'; return; }
    const hasHalf = !!c.dataset.half;
    half.disabled = !hasHalf;
    if (!hasHalf && half.checked) whole.checked = true;
    const isHalf = half.checked;
    const n = Math.min(Math.max(parseInt(qty.value, 10) || 1, 1), 6);
    const unitPrice = isHalf ? +c.dataset.half : +c.dataset.tray;
    const name = c.closest('.cake').querySelector('.cake__name').textContent;
    line.textContent = `${n} × ${name}, ${isHalf ? 'halbes ' : ''}${c.dataset.unit}`;
    al.hidden = false;
    al.innerHTML = `<strong>Enthält:</strong> ${esc(c.dataset.al)}. Spuren weiterer Allergene möglich.`;
    price.textContent = eur(unitPrice * n);
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);

  // „Vorbestellen“-Links aus der Karte wählen den Kuchen vor
  document.querySelectorAll('[data-cake]').forEach((a) => a.addEventListener('click', () => {
    const r = form.querySelector(`input[name=kuchen][value="${a.dataset.cake}"]`);
    if (r) { r.checked = true; update(); setTimeout(() => r.focus({ preventScroll: true }), 450); }
  }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errs = [];
    const c = cake();
    const ek = form.querySelector('#err-kuchen');
    ek.hidden = !!c; if (!c) errs.push(form.querySelector('input[name=kuchen]'));
    let dm = '';
    if (!date.value) dm = 'Bitte wählen Sie einen Abholtag.';
    else if (date.value < date.min) dm = `Frühestens am ${fmtDate(date.min)}, wir brauchen zwei Tage Vorlauf.`;
    else if (date.value > date.max) dm = 'Bitte höchstens 60 Tage im Voraus bestellen.';
    else { const [y, m, d] = date.value.split('-').map(Number); if (new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 1) dm = 'Montag ist Ruhetag. Bitte einen anderen Tag wählen.'; }
    if (setError(date, form.querySelector('#o-datum-e'), dm)) errs.push(date);
    const zeit = form.querySelector('#o-zeit');
    if (setError(zeit, form.querySelector('#o-zeit-e'), zeit.value ? '' : 'Bitte wählen Sie ein Zeitfenster.')) errs.push(zeit);
    const name = form.querySelector('#o-name');
    if (setError(name, form.querySelector('#o-name-e'), name.value.trim().length > 1 ? '' : 'Bitte geben Sie Ihren Namen an.')) errs.push(name);
    const tel = form.querySelector('#o-tel');
    if (setError(tel, form.querySelector('#o-tel-e'), /^[+\d][\d\s/()-]{5,}$/.test(tel.value.trim()) ? '' : 'Bitte geben Sie eine Telefonnummer an (nur Ziffern, Leerzeichen, + / - ).')) errs.push(tel);
    if (errs.length) { form.querySelector('[data-result]').hidden = true; errs[0].focus(); return; }
    update();
    showResult(form, 'Ihre Vorbestellung – nur geprüft, nicht gesendet', [
      ['Kuchen', line.textContent], ['Allergene', c.dataset.al], ['Abholung', `${fmtDate(date.value)}, ${zeit.value} Uhr`], ['Name', name.value.trim()], ['Telefon', tel.value.trim()], ['Summe', `${price.textContent} (fiktiv)`],
    ], 'In einer echten Version ginge die Vorbestellung an das Café. Verbindlich wäre sie erst nach einer Bestätigung durch das Team per Telefon oder E-Mail.');
  });
  update();
}

function initCatering() {
  const form = document.getElementById('catering-form');
  if (!form) return;
  const now = berlinNow();
  const date = form.querySelector('#c-datum');
  date.min = isoDate(addDays(now, 3));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errs = [];
    const check = (sel, ok, msg) => { const el = form.querySelector(sel); if (setError(el, form.querySelector(sel + '-e'), ok(el) ? '' : msg)) errs.push(el); return el; };
    const anlass = check('#c-anlass', (el) => !!el.value, 'Bitte wählen Sie einen Anlass.');
    check('#c-datum', (el) => !!el.value && el.value >= el.min, 'Bitte wählen Sie ein Datum mindestens drei Tage in der Zukunft.');
    const pers = check('#c-personen', (el) => +el.value >= 10 && +el.value <= 120, 'Bitte 10 bis 120 Personen angeben.');
    const name = check('#c-name', (el) => el.value.trim().length > 1, 'Bitte geben Sie Ihren Namen an.');
    const mail = check('#c-mail', (el) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()), 'Bitte geben Sie eine gültige E-Mail-Adresse an.');
    if (errs.length) { form.querySelector('[data-result]').hidden = true; errs[0].focus(); return; }
    const diet = [...form.querySelectorAll('input[name=ernaehrung]:checked')].map((i) => i.value).join(', ') || 'keine Angabe';
    showResult(form, 'Ihre Catering-Anfrage – nur geprüft, nicht gesendet', [
      ['Anlass', anlass.value], ['Datum', fmtDate(date.value)], ['Personen', pers.value], ['Ernährung', diet], ['Name', name.value.trim()], ['E-Mail', mail.value.trim()],
    ], 'In einer echten Version bekäme das Café diese Anfrage und würde sich mit einem Angebot melden. Es gibt keine automatische Zusage.');
  });
}

export function initForms() { initOrder(); initCatering(); }
