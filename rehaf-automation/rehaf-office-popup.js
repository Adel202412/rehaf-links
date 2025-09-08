// rehaf-office-popup.js — popup only (no cards)
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

  // Show popup near mascot, clamped to viewport
  function showPop(spotEl, item) {
    if (!spotEl || !pop) return;

    const list = (item.services || []).map((s) => `<li>${s}</li>`).join("");
    pop.innerHTML = `
      <h4>${item.title || "Services"}</h4>
      ${item.tagline ? `<p>${item.tagline}</p>` : ""}
      <ul>${list}</ul>
    `;

    const rect = spotEl.getBoundingClientRect();
    let cx = rect.left + rect.width / 2;
    let cy = rect.top  + rect.height / 2;

    const pad = 8;
    cx = Math.max(pad, Math.min(cx, window.innerWidth  - pad));
    cy = Math.max(pad, Math.min(cy, window.innerHeight - pad));

    pop.style.position = "fixed";
    pop.style.left = cx + "px";
    pop.style.top  = cy + "px";
    pop.classList.add("show");
  }

  function hidePop() {
    if (pop) pop.classList.remove("show");
  }

  function attach() {
    const spots = document.querySelectorAll(".hotspot");
    if (!spots.length) { setTimeout(attach, 300); return; }

    // Hide popup on scroll/resize/click outside
    window.addEventListener("scroll", hidePop, { passive: true });
    window.addEventListener("resize", hidePop);
    document.addEventListener("click", (e) => {
      if (wrap && !wrap.contains(e.target)) hidePop();
    });

    spots.forEach((spot) => {
      spot.addEventListener("click", async (e) => {
        e.preventDefault();
        const img = spot.querySelector("img");
        const base = imgBase(img?.getAttribute("src") || "");
        const list = await getServices();

        // Try filename → then label/key → fallback
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

        showPop(spot, item);   // only popup, no cards
      }, { passive: true });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attach);
  } else {
    attach();
  }
})();