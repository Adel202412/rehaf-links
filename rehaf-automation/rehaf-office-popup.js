// rehaf-office-popup.js — popup only, smart positioning (no cards)
(function () {
  const wrap = document.getElementById('officeWrap');
  const pop  = document.getElementById('pop');
  let servicesCache = null;

  // Load services once
  async function getServices() {
    if (servicesCache) return servicesCache;
    const r = await fetch('services.json');
    const raw = await r.json();
    servicesCache = Array.isArray(raw) ? raw : (raw.departments || []);
    return servicesCache;
  }

  // Helpers
  const imgBase = (src) => (src || "").split("/").pop().toLowerCase();
  const findByImgBase = (list, base) =>
    list.find((d) => {
      const p = (d.img || "").toLowerCase();
      return p.endsWith("/" + base) || p.endsWith(base);
    });

  function headerH() {
    const h = document.querySelector('.header');
    return h ? h.getBoundingClientRect().height : 0;
  }

  // Place popup near mascot, auto-flip if needed, clamp to viewport
  function placePopupNear(spotEl) {
    const rect = spotEl.getBoundingClientRect();
    const topGuard = headerH() + 10;  // keep clear of sticky header
    const pad = 10;

    // Start from mascot center
    let cx = rect.left + rect.width / 2;
    let cy = rect.top  + rect.height / 2;

    // Clamp X inside viewport
    cx = Math.max(pad, Math.min(cx, window.innerWidth - pad));

    // Default ABOVE (CSS lifts -100%)
    pop.classList.remove('dir-below');
    pop.style.left = cx + 'px';
    pop.style.top  = cy + 'px';

    // Measure bubble and decide flip
    const pr = pop.getBoundingClientRect();
    const bubbleTopIfAbove = pr.top - pr.height; // due to transform
    if (bubbleTopIfAbove < topGuard) {
      // Flip below target
      pop.classList.add('dir-below');
      pop.style.left = cx + 'px';
      pop.style.top  = (rect.bottom) + 'px';
    }

    // Re-clamp horizontally after flip
    const after = pop.getBoundingClientRect();
    if (after.left < pad) {
      pop.style.left = (pad + after.width / 2) + 'px';
    } else if (after.right > window.innerWidth - pad) {
      pop.style.left = (window.innerWidth - pad - after.width / 2) + 'px';
    }

    // Vertical nudge if still touching header
    const finalR = pop.getBoundingClientRect();
    if (finalR.top < topGuard) {
      pop.style.top = (parseFloat(pop.style.top) + (topGuard - finalR.top)) + 'px';
    }
  }

  function showPop(spotEl, item) {
    if (!spotEl || !pop) return;

    const list = (item.services || []).map((s) => `<li>${s}</li>`).join("");
    pop.innerHTML = `
      <h4>${item.title || "Services"}</h4>
      ${item.tagline ? `<p>${item.tagline}</p>` : ""}
      <ul>${list}</ul>
    `;

    // Make visible before measuring/placing
    pop.style.position = "fixed";
    pop.classList.add("show");

    placePopupNear(spotEl);
  }

  function hidePop() { pop?.classList.remove("show"); }

  function attach() {
    const spots = document.querySelectorAll(".hotspot");
    if (!spots.length) { setTimeout(attach, 300); return; }

    // Hide on scroll/resize or clicking outside the office area
    window.addEventListener("scroll", hidePop, { passive: true });
    window.addEventListener("resize", hidePop);
    document.addEventListener("click", (e) => {
      if (wrap && !wrap.contains(e.target)) hidePop();
    });

    spots.forEach((spot) => {
      spot.addEventListener("click", async (e) => {
        e.preventDefault();

        const img  = spot.querySelector("img");
        const base = imgBase(img?.getAttribute("src") || "");
        const list = await getServices();

        // Match by file → then label/key → fallback
        let item =
          findByImgBase(list, base) ||
          (function () {
            const lbl = spot.querySelector(".lbl")?.textContent?.trim()?.toLowerCase();
            return (
              list.find((d) => (d.title || "").toLowerCase() === lbl) ||
              list.find((d) => (d.key || "").toLowerCase() === lbl)
            );
          })() ||
          { title: "Services", services: ["Details coming soon."] };

        showPop(spot, item);
      }, { passive: true });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", attach);
  else attach();
})();