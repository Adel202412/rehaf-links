// rehaf-office-cards.js — Services (left) + Mascot preview (right)
(function () {
  const panel = document.getElementById('servicePanel');
  const officeWrap = document.getElementById('officeWrap');
  let servicesCache = null;

  async function getServices() {
    if (servicesCache) return servicesCache;
    try {
      const r = await fetch('src/data/services.json', { cache: 'no-store' });
      const raw = await r.json();
      servicesCache = Array.isArray(raw) ? raw : (raw.departments || []);
    } catch (e) {
      console.error('services.json load error:', e);
      servicesCache = [];
    }
    return servicesCache;
  }

  const imgBase = (src) => (src || '').split('/').pop().toLowerCase();
  const findByImgBase = (list, base) =>
    list.find(d => {
      const p = (d.img || '').toLowerCase();
      return p.endsWith('/' + base) || p.endsWith(base);
    });

  function findByLabelOrKey(list, spot) {
    const key = (spot.dataset.key || '').trim().toLowerCase();
    if (key) {
      const hit = list.find(d =>
        (d.key || '').toLowerCase() === key ||
        (d.title || '').toLowerCase() === key
      );
      if (hit) return hit;
    }
    const lbl = spot.querySelector('.lbl')?.textContent?.trim()?.toLowerCase();
    if (lbl) {
      return (
        list.find(d => (d.title || '').toLowerCase() === lbl) ||
        list.find(d => (d.key   || '').toLowerCase() === lbl)
      );
    }
    return null;
  }

  const esc = s => (s || '').replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));

  function renderCards(item, mascotSrc) {
    if (!panel) return;

    const title = esc(item.title || 'Services');
    const tagline = esc(item.tagline || '');
    const chips = Array.isArray(item.services) && item.services.length
      ? item.services.map(s => `<div class="acc-chip">${esc(s)}</div>`).join('')
      : '<div class="acc-chip">No services listed</div>';

    panel.innerHTML = `
      <div class="panel">
        <!-- Left: Services -->
        <div class="card-services">
          <div class="acc-head">${title}</div>
          <div class="acc-body">
            ${tagline ? `<div class="acc-chip" style="font-weight:600">${tagline}</div>` : ''}
            ${chips}
          </div>
        </div>

        <!-- Right: Mascot preview (photo now, can host video later) -->
        <div class="card-mascot">
          <div class="title">${title}</div>
          ${tagline ? `<div class="tagline">${tagline}</div>` : ''}
          <div class="preview">
            ${mascotSrc
              ? `<img src="${mascotSrc}" alt="${title} mascot">`
              : '<div style="opacity:.65">No image</div>'}
          </div>
          <!-- Future: replace preview with <video controls src="..."></video> -->
        </div>
      </div>
    `;
  }

  function softReveal(el){
    if (!el) return;
    const header = document.querySelector('.header');
    const hh = header ? header.getBoundingClientRect().height : 0;
    const r = el.getBoundingClientRect();
    const pad = 8, vpTop = hh + pad, vpBottom = innerHeight - pad;
    let delta = 0;
    if (r.top < vpTop) delta = r.top - vpTop;
    else if (r.bottom > vpBottom) delta = r.bottom - vpBottom;
    if (delta) scrollBy({ top: delta, behavior: 'smooth' });
  }

  function handle(spot){
    return async (e) => {
      e.preventDefault();
      const imgEl = spot.querySelector('img');
      const src   = imgEl?.getAttribute('src') || '';
      const base  = imgBase(src);
      const list  = await getServices();

      const item =
        findByImgBase(list, base) ||
        findByLabelOrKey(list, spot) ||
        { title:'Services', tagline:'Details coming soon.', services:[] };

      renderCards(item, src);
      requestAnimationFrame(() => softReveal(panel));
    };
  }

  function attach(){
    const spots = document.querySelectorAll('.hotspot');
    if (!spots.length){ setTimeout(attach, 300); return; }

    spots.forEach(spot => {
      if (!spot.hasAttribute('tabindex')) spot.setAttribute('tabindex','0');
      if (!spot.hasAttribute('role'))     spot.setAttribute('role','button');
      const onClick = handle(spot);
      spot.addEventListener('click', onClick, { passive:true });
      spot.addEventListener('keydown', ev => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onClick(ev); }
      });
    });

    // Auto-show first on load (optional)
    // spots[0]?.click();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();

  if (officeWrap){
    const mo = new MutationObserver(() => {
      if (document.querySelector('.hotspot')) attach();
    });
    mo.observe(officeWrap, { childList:true, subtree:true });
  }
})();