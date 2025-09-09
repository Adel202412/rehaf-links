// js/scale-fix.js
// -------------------------------------------------------------
// Fix mobile/desktop-site scaling quirks.
// If a phone browser is forcing "desktop site" and content looks tiny,
// this script gently scales the page back to normal size.
// -------------------------------------------------------------

(function () {
  function fixScale() {
    // visual viewport width (or fallback to window.innerWidth)
    const vv = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    // layout width (CSS pixels)
    const lw = document.documentElement.clientWidth;
    const ratio = vv / lw;
    const root = document.documentElement;

    // reset scaling
    root.style.transform = "";
    root.style.transformOrigin = "";

    // If page looks "mini" (ratio < 0.8), scale it up
    if (ratio < 0.8) {
      const scale = 1 / ratio;
      root.style.transform = `scale(${scale})`;
      root.style.transformOrigin = "top left";
    }
  }

  window.addEventListener("resize", fixScale);
  window.addEventListener("orientationchange", fixScale);
  fixScale(); // run once on load
})();