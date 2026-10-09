/** Rendert HTML-Bausteine aus src/data/menu.js (läuft zur Build-Zeit in Node). */
import { ALLERGENS, CATEGORIES, DISHES, LUNCH, HOURS, DAY_NAMES, QUICK } from './menu.js';

const eur = (n) => n.toFixed(2).replace('.', ',') + ' €';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const aName = (c) => ALLERGENS.find((x) => x.code === c);

function allergenLine(d) {
  if (!d.a.length) return `<p class="dish__al dish__al--none">Keine der 14 Hauptallergene als Zutat${d.trace ? ' · Spuren möglich' : ''}</p>`;
  const parts = d.a.map((c) => {
    const det = d.detail?.[c] ? ` (${esc(d.detail[c])})` : '';
    return `<li><abbr title="${esc(aName(c).name)}">${c}</abbr> ${esc(aName(c).short)}${det}</li>`;
  });
  return `<ul class="dish__al" aria-label="Enthält folgende Allergene">${parts.join('')}</ul>`;
}

const dietBadge = (d) => d.diet === 'vegan' ? '<span class="badge badge--vegan">vegan</span>' : d.diet === 'veg' ? '<span class="badge badge--veg">vegetarisch</span>' : '';

export function renderMenu() {
  return CATEGORIES.map((c) => {
    const items = DISHES.filter((d) => d.cat === c.id).map((d) => `
        <li class="dish" id="g-${d.id}" data-a="${d.a.join(' ')}" data-diet="${d.diet}" style="view-transition-name: dish-${d.id}">
          <div class="dish__head">
            <h4 class="dish__name">${esc(d.name)}</h4>
            <span class="dish__dots" aria-hidden="true"></span>
            <span class="dish__price"><span class="sr-only">Preis: </span>${eur(d.price)}</span>
          </div>
          <p class="dish__desc">${esc(d.desc)} ${dietBadge(d)}</p>
          ${allergenLine(d)}
          ${d.cake ? `<a class="dish__order" href="#vorbestellen" data-cake="${d.id}">Als ganzes ${d.cake.unit.split(' ')[0]} vorbestellen <span aria-hidden="true">→</span></a>` : ''}
        </li>`).join('');
    return `
      <section class="menu-cat" id="karte-${c.id}" aria-labelledby="h-${c.id}">
        <header class="menu-cat__head">
          <h3 id="h-${c.id}">${esc(c.name)}</h3>
          <p>${esc(c.note)}</p>
        </header>
        <ul class="menu-cat__list" role="list">${items}</ul>
        <p class="menu-cat__empty" hidden>In dieser Kategorie passt gerade nichts zu Ihrem Filter.</p>
      </section>`;
  }).join('');
}


export function renderLegend() {
  return `<ol class="legend" role="list">${ALLERGENS.map((a) => `<li><b>${a.code}</b> ${esc(a.name)}</li>`).join('')}</ol>`;
}

export function renderFilter() {
  const chip = (a) => `<label class="chip"><input type="checkbox" name="ohne" value="${a.code}"><span>ohne ${esc(a.short)}</span></label>`;
  const quick = QUICK.map((c) => chip(aName(c))).join('');
  const rest = ALLERGENS.filter((a) => !QUICK.includes(a.code)).map(chip).join('');
  return `
    <fieldset class="filter__group">
      <legend>Ernährung</legend>
      <label class="chip"><input type="radio" name="diet" value="" checked><span>alles</span></label>
      <label class="chip"><input type="radio" name="diet" value="veg"><span>vegetarisch</span></label>
      <label class="chip"><input type="radio" name="diet" value="vegan"><span>vegan</span></label>
    </fieldset>
    <fieldset class="filter__group">
      <legend>Allergene ausschließen</legend>
      ${quick}
      <details class="filter__more"><summary>Alle 14 Allergene</summary><div class="filter__more-list">${rest}</div></details>
    </fieldset>`;
}

export function renderAllergenTable() {
  const all = [...DISHES.map((d) => ({ ...d, catName: CATEGORIES.find((c) => c.id === d.cat).name })), ...LUNCH.map((l) => ({ ...l, catName: `Mittagstisch ${DAY_NAMES[l.day]}` }))];
  const head = `<tr><th scope="col">Gericht</th>${ALLERGENS.map((a) => `<th scope="col"><abbr title="${esc(a.name)}">${a.code}</abbr><span class="sr-only"> ${esc(a.name)}</span></th>`).join('')}</tr>`;
  const rows = all.map((d) => `<tr><th scope="row">${esc(d.name)}<small>${esc(d.catName)}</small></th>${ALLERGENS.map((a) => d.a.includes(a.code) ? `<td class="yes"><span aria-hidden="true">●</span><span class="sr-only">enthält ${esc(a.short)}${d.detail?.[a.code] ? ' (' + esc(d.detail[a.code]) + ')' : ''}</span></td>` : '<td><span class="sr-only">nein</span></td>').join('')}</tr>`).join('');
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="Allergen-Tabelle, horizontal scrollbar"><table class="al-table"><caption class="sr-only">Allergene je Gericht (Codes A–N nach Anhang II LMIV)</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
}

export function renderLunch() {
  return LUNCH.map((l) => `
      <li class="lunch__day" data-day="${l.day}">
        <p class="lunch__dow">${DAY_NAMES[l.day]}<span class="lunch__today" hidden> · heute</span></p>
        <h3 class="lunch__name">${esc(l.name)}</h3>
        <p class="lunch__desc">${esc(l.desc)} ${dietBadge(l)}</p>
        <p class="lunch__meta"><span class="lunch__price">${eur(l.price)}</span> <span class="lunch__al">Allergene: ${l.a.map((c) => `<abbr title="${esc(aName(c).name)}">${c}</abbr>`).join(', ')}${Object.keys(l.detail || {}).length ? ` (${Object.entries(l.detail).map(([k, v]) => `${k}: ${esc(v)}`).join('; ')})` : ''}</span></p>
      </li>`).join('');
}

export function renderCakeOptions() {
  return DISHES.filter((d) => d.cake).map((d, i) => `
        <label class="cake" style="view-transition-name: cake-${d.id}">
          <input type="radio" name="kuchen" value="${d.id}" ${i === 0 ? 'required' : ''} data-tray="${d.cake.tray}" data-half="${d.cake.half ?? ''}" data-unit="${esc(d.cake.unit)}" data-al="${esc(d.a.map((c) => aName(c).short + (d.detail?.[c] ? ' (' + d.detail[c] + ')' : '')).join(', '))}">
          <picture>
            <source type="image/avif" srcset="{{BASE}}photos/${d.cake.photo}-360.avif 360w, {{BASE}}photos/${d.cake.photo}-560.avif 560w" sizes="(min-width: 900px) 180px, 40vw">
            <img src="{{BASE}}photos/${d.cake.photo}-360.webp" srcset="{{BASE}}photos/${d.cake.photo}-360.webp 360w, {{BASE}}photos/${d.cake.photo}-560.webp 560w" sizes="(min-width: 900px) 180px, 40vw" width="360" height="360" alt="" loading="lazy" decoding="async">
          </picture>
          <span class="cake__name">${esc(d.name)}</span>
          <span class="cake__price">${esc(d.cake.unit)} · ${eur(d.cake.tray)}${d.cake.half ? ` · halb ${eur(d.cake.half)}` : ''}</span>
        </label>`).join('');
}

export function renderHours() {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return `<table class="hours"><caption class="sr-only">Öffnungszeiten (fiktiv)</caption><tbody>${order.map((d) => `<tr data-day="${d}"><th scope="row">${DAY_NAMES[d]}</th><td>${HOURS[d] ? `${HOURS[d][0]}–${HOURS[d][1]} Uhr` : 'Ruhetag'}</td></tr>`).join('')}</tbody></table>`;
}
