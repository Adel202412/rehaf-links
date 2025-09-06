// rehaf-office.js
export function initRehafOffice({ wrapId = 'officeWrap', popId = 'pop', quickGridId = 'quickGrid', jsonPath = 'services.json' }) {
  const wrap = document.getElementById(wrapId);
  const pop  = document.getElementById(popId);
  const quick = document.getElementById(quickGridId);

  async function loadServices() {
    try {
      const res = await fetch(jsonPath, { cache: 'no-cache' });
      const data = await res.json();

      // Create hotspots
      data.departments.forEach(d => {
        if (!d.position) return;
        const b = document.createElement('button');
        b.className = 'hotspot';
        b.style.left = d.position.x + '%';
        b.style.top  = d.position.y + '%';
        b.dataset.key = d.key;
        b.innerHTML = `<img src="${d.img}" alt="${d.title} mascot"><div class="lbl">${d.title}</div>`;
        wrap.appendChild(b);
      });

      // One popover at a time
      let openKey = null;
      function openPop(d, anchor) {
        pop.innerHTML = `
          <h4>${d.title}</h4>
          <p>${d.tagline}</p>
          <ul>${d.services.map(s => `<li>${s}</li>`).join('')}</ul>
        `;
        const W = wrap.getBoundingClientRect();
        const R = anchor.getBoundingClientRect();
        const popW = Math.min(320, W.width - 16);
        let left = R.left - W.left - popW / 2 + R.width / 2;
        left = Math.max(8, Math.min(left, W.width - popW - 8));
        const top = R.top - W.top - 8 + window.scrollY;
        pop.style.left = left + 'px';
        pop.style.top = top + 'px';
        pop.style.width = popW + 'px';
        pop.classList.add('show');
      }
      function closePop() { pop.classList.remove('show'); openKey = null; }

      wrap.addEventListener('click', e => {
        const hit = e.target.closest('.hotspot'); if (!hit) return;
        const key = hit.dataset.key;
        if (openKey === key) { closePop(); return; }
        const d = data.departments.find(x => x.key === key);
        openKey = key; openPop(d, hit);
      });
      document.addEventListener('click', e => {
        if (!pop.classList.contains('show')) return;
        if (e.target.closest('.hotspot') || e.target.closest('#pop')) return;
        closePop();
      });

      // Quick grid summary
      if (quick) {
        data.departments.filter(d => !d.quickHide).forEach(d => {
          const el = document.createElement('div');
          el.className = 'qitem';
          const three = d.services.slice(0, 3).map(s => s.split(' — ')[0]).join(', ');
          el.innerHTML = `<b>${d.title}</b><p>${three}.</p>`;
          quick.appendChild(el);
        });
      }
    } catch (err) {
      console.error('Failed to load services.json', err);
    }
  }

  loadServices();
}
