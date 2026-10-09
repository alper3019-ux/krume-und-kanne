/** Allergen- und Ernährungsfilter der Speisekarte (mit View Transition, falls verfügbar). */
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

export function initFilter() {
  const form = document.getElementById('filter');
  if (!form) return;
  const dishes = [...document.querySelectorAll('.dish')];
  const count = form.querySelector('[data-count]');
  const total = dishes.length;

  function apply() {
    const ex = new Set([...form.querySelectorAll('input[name=ohne]:checked')].map((i) => i.value));
    const diet = form.querySelector('input[name=diet]:checked')?.value || '';
    let shown = 0;
    for (const d of dishes) {
      const al = d.dataset.a ? d.dataset.a.split(' ') : [];
      const okA = !al.some((a) => ex.has(a));
      const okD = !diet || d.dataset.diet === 'vegan' || (diet === 'veg' && d.dataset.diet === 'veg');
      d.hidden = !(okA && okD);
      if (!d.hidden) shown++;
    }
    for (const cat of document.querySelectorAll('.menu-cat')) {
      const any = cat.querySelector('.dish:not([hidden])');
      cat.querySelector('.menu-cat__empty').hidden = !!any;
    }
    count.textContent = shown === total ? `Alle ${total} Gerichte` : `${shown} von ${total} Gerichten passen`;
  }
  function run() {
    if (document.startViewTransition && !reduce.matches) document.startViewTransition(apply);
    else apply();
  }
  form.addEventListener('change', run);
  form.addEventListener('reset', () => setTimeout(run, 0));
  form.addEventListener('submit', (e) => e.preventDefault());
  apply();
}
