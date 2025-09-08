// rehaf-office-cards.js — Two cards under the floorplan:
// Left = services (title, tagline, chips)
// Right = mascot preview (image + short text)
(function () {
  const panel = document.getElementById('servicePanel');
  const officeWrap = document.getElementById('officeWrap');
  let servicesCache = null;

  // ---- Data helpers --------------------------------------------------------
  async function getServices() {
    if (servicesCache) return servicesCache;
    try {
      const r = await fetch('services.json', { cache: 'no-store' });
      const raw = await r.json();
      servicesCache = Array.isArray(raw) ? raw : (raw.departments || []);
      return servicesCache;
    } catch (e) {
      console.error('services.json load error:', e);
      servicesCache = [];
      return servicesCache;
    }
  }

  const imgBase = (src) => (src || '').split('/').pop().toLowerCase();

  // match by image file name (case-insensitive)
  const findByImgBase = (list, base) =>
    list.find((d) => {
      const p = (d.img || '').toLowerCase();
      return p.endsWith('/' + base) || p.endsWith(base);
    });

  // optional: match via data-key or visible label text
  function findByLabelOrKey(list, spot) {
    const key = (spot.dataset.key || '').trim().toLowerCase();
    if (key) {
      const hit = list.find(
        (d) =>
          (d.key || '').toLowerCase() === key ||
          (d.title || '').toLowerCase() === key
      );
      if (hit) return hit;
    }
    const lbl = spot.querySelector('.lbl')?.textContent?.trim()?.toLowerCase();
    if (lbl) {
      return (
        list.find((d) => (d.title || '').toLowerCase() === lbl) ||
        list.find((d) => (d.key || '').toLowerCase() === lbl)
      );
    }
    return null;
  }

  // ---- Render helpers ------------------------------------------------------
  function esc(s) {
    return (s || '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[m]));
  }

  function renderCards(item, mascotSrc) {
    if (!panel) return;

    const title = esc(item.title || 'Services');
    const tagline = esc(item.tagline || '');
    const chips = Array.isArray(item.services) && item.services.length
      ? item.services.map((s) => `<div class="acc-chip">${esc(s)}</div>`).join('')
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

        <!-- Right: Mascot preview -->
        <div class="card-mascot">
          <div class="title">${title}</div>
          ${tagline ? `<div class="tagline">${tagline}</div>` : '<div class="tagline" style="opacity:.75">Selected department</div>'}
          <div class="preview">
            ${
              mascotSrc
                ? `<img src="${mascotSrc}" alt="${title} mascot">`
                : '<div style="opacity:.6">No image</div>'
            }
          </div>
        </div>
      </div>
    `;
  }

  function softRevealIntoView(el) {
    if (!el) return;
    const header = document.querySelector('.header');
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const rect = el.getBoundingClientRect();
    const pad = 8;
    const vpTop = headerH + pad;
    const vpBottom = window.innerHeight - pad;

    let delta = 0;
    if (rect.top < vpTop) delta = rect.top - vpTop;
    else if (rect.bottom > vpBottom) delta = rect.bottom - vpBottom;

    if (delta) window.scrollBy({ top: delta, behavior: 'smooth' });
  }

  // ---- Main wiring ---------------------------------------------------------
  function handleHotspotClick(spot) {
    return async (e) => {
      e.preventDefault();

      const imgEl = spot.querySelector('img');
      const src = imgEl?.getAttribute('src') || '';
      const base = imgBase(src);
      const list = await getServices();

      // priority: file name -> data-key/label -> fallback
      let item =
        findByImgBase(list, base) ||
        findByLabelOrKey(list, spot) ||
        { title: 'Services', tagline: 'Details coming soon.', services: [] };

      renderCards(item, src);
      // small delay to allow layout to paint before scrolling
      requestAnimationFrame(() => softRevealIntoView(panel));
    };
  }

  function attach() {
    const spots = document.querySelectorAll('.hotspot');
    if (!spots.length) {
      // hotspots are probably injected by another script — try again shortly
      setTimeout(attach, 300);
      return;
    }

    // Click + keyboard activation
    spots.forEach((spot) => {
      // make hotspots keyboard-accessible if not already
      if (!spot.hasAttribute('tabindex')) spot.setAttribute('tabindex', '0');
      if (!spot.hasAttribute('role')) spot.setAttribute('role', 'button');

      const onClick = handleHotspotClick(spot);
      spot.addEventListener('click', onClick, { passive: true });
      spot.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          onClick(ev);
        }
      });
    });

    // Optionally, preselect the first hotspot to show the panel on load:
    // spots[0]?.click();
  }

  // If officeWrap exists but hotspots are late, we still re-try via attach()
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }

  // Safety: if something else dynamically re-renders the office, re-attach
  // (MutationObserver is lightweight here)
  if (officeWrap) {
    const mo = new MutationObserver(() => {
      // re-bind if new hotspots arrive
      const any = document.querySelector('.hotspot');
      if (any) attach();
    });
    mo.observe(officeWrap, { childList: true, subtree: true });
  }
})();