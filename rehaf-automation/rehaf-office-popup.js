(function(){
  const wrap = document.getElementById('officeWrap');
  const pop  = document.getElementById('pop');
  let servicesCache = null;

  async function getServices(){
    if (servicesCache) return servicesCache;
    const r = await fetch('services.json');
    const raw = await r.json();
    servicesCache = Array.isArray(raw) ? raw : (raw.departments || []);
    return servicesCache;
  }

  const imgBase = src => (src||"").split('/').pop().toLowerCase();
  const findByImgBase = (list, base) => list.find(d=>{
    const p=(d.img||'').toLowerCase();
    return p.endsWith('/'+base) || p.endsWith(base);
  });

  function renderPanel(item){
    const wrapPanel = document.getElementById('servicePanel');
    if(!wrapPanel) return;
    const chips = (item.services||[]).map(s=>`<div class="acc-chip">${s}</div>`).join('');
    const tagline = item.tagline ? `<div class="acc-chip" style="font-weight:600">${item.tagline}</div>` : '';
    wrapPanel.innerHTML = `
      <div class="accordion hide">
        <div class="acc-head">${item.title || 'Services'}</div>
        <div class="acc-body">
          ${tagline}
          ${chips || '<div class="acc-chip">No services listed</div>'}
        </div>
      </div>`;
    requestAnimationFrame(()=>{
      wrapPanel.querySelector('.accordion')?.classList.remove('hide');
    });
  }

  function showPop(spotEl, item){
    if(!wrap || !pop || !spotEl) return;

    const list = (item.services||[]).map(s=>`<li>${s}</li>`).join('');
    pop.innerHTML = `
      <h4>${item.title || 'Services'}</h4>
      ${item.tagline ? `<p>${item.tagline}</p>` : ''}
      <ul style="margin:6px 0 0; padding:0 0 0 14px; color:#334155; font-size:13px; line-height:1.45;">
        ${list}
      </ul>`;

    const wrapRect = wrap.getBoundingClientRect();
    const spotRect = spotEl.getBoundingClientRect();
    let cx = spotRect.left + spotRect.width/2 - wrapRect.left;
    let cy = spotRect.top  + spotRect.height/2 - wrapRect.top;

    const pad = 12;
    cx = Math.max(pad, Math.min(cx, wrap.clientWidth  - pad));
    cy = Math.max(pad, Math.min(cy, wrap.clientHeight - pad));

    pop.style.left = cx + 'px';
    pop.style.top  = cy + 'px';
    pop.classList.add('show');
  }

  function hidePop(){ pop?.classList.remove('show'); }

  function scrollServicesBodyIntoView(){
    const panel = document.getElementById('servicePanel');
    const acc = panel?.querySelector('.accordion');
    const body = panel?.querySelector('.acc-body');
    if(!panel || !acc || !body) return;
    const header = document.querySelector('.header');
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const bodyRect = body.getBoundingClientRect();
    const pad = 8;
    const vpTop = headerH + pad;
    const vpBottom = window.innerHeight - pad;
    let delta = 0;
    if (bodyRect.top < vpTop) delta = bodyRect.top - vpTop;
    else if (bodyRect.bottom > vpBottom) delta = bodyRect.bottom - vpBottom;
    if (delta !== 0) window.scrollBy({ top: delta, behavior: 'smooth' });
  }

  function attach(){
    const spots = document.querySelectorAll('.hotspot');
    if(!spots.length){ setTimeout(attach,300); return; }

    window.addEventListener('scroll', hidePop, {passive:true});
    window.addEventListener('resize', hidePop);
    wrap.addEventListener('mouseleave', hidePop);
    document.addEventListener('click', (e)=>{
      if(!wrap.contains(e.target)) hidePop();
    });

    spots.forEach(spot=>{
      spot.addEventListener('click', async (e)=>{
        e.preventDefault();
        const img = spot.querySelector('img');
        const base = imgBase(img?.getAttribute('src') || '');
        const list = await getServices();

        let item = findByImgBase(list, base);
        if(!item){
          const lbl = spot.querySelector('.lbl')?.textContent?.trim()?.toLowerCase();
          item = list.find(d=>(d.title||'').toLowerCase()===lbl) ||
                 list.find(d=>(d.key||'').toLowerCase()===lbl);
        }
        if(!item) item = { title:'Services', services:['Details coming soon.'] };

        renderPanel(item);
        showPop(spot, item);

        requestAnimationFrame(()=>requestAnimationFrame(scrollServicesBodyIntoView));
      }, {passive:true});
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
})();