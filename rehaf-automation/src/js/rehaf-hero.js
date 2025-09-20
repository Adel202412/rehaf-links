// rehaf-hero.js (REHAF v2)
export function initRehafHero(container) {
  if (!container) return;

  // v2 styling hook (keeps your existing hero.split styles)
  container.classList.add("split");

  // NOTE: make sure the file names/casing match your real files:
  // WebP:  src/assets/mascot.webp
  // WebM:  src/assets/mascotvideo.webm   <-- rename file to lowercase .webm if needed

  container.innerHTML = `
    <div class="hero-inner" aria-labelledby="heroTitle">
      <div class="copy">
        <div class="kicker">AI Virtual Office</div>
        <h1 id="heroTitle">Automate Your Office. Save Time. <span class="ai">Scale Faster.</span></h1>
        <p class="sub">We design AI-powered workflows that eliminate repetitive tasks so your team can focus on growth.</p>

        <div class="btn-row">
          <a class="btn-v2 primary" href="#contact" aria-label="Contact REHAF">Contact Us</a>
          <a class="btn-v2 ghost" href="#office" aria-label="Explore the virtual office">Explore the Floorplan</a>
        </div>

        <!-- Optional stat chips (remove if you don’t want them duplicated with Trust) -->
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:14px;">
          <span class="chip">30+ hours saved / month</span>
          <span class="chip">AI Agents reduce headcount needs</span>
          <span class="chip">24/7 AI employees</span>
          <span class="chip">99% fewer human errors</span>
        </div>
      </div>

      <div class="visual" aria-hidden="true">
        <div class="card revealable">
          <video
            class="mascotWelcome"
            autoplay
            loop
            muted
            playsinline
            preload="metadata"
            poster="src/assets/mascot.webp"
            aria-label="Hi, I’m REHAF — your AI assistant for running a virtual office."
          >
            <source src="src/assets/mascotvideo.webm" type="video/webm">
            <img src="src/assets/mascot.webp" alt="Hi, I’m REHAF — your AI assistant for running a virtual office.">
          </video>
        </div>
      </div>
    </div>
  `;

  // Reduced motion fallback
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    const v = container.querySelector('.mascotWelcome');
    if (v) {
      const img = document.createElement('img');
      img.src = 'src/assets/mascot.webp';
      img.alt = 'Hi, I’m REHAF — your AI assistant for running a virtual office.';
      img.className = 'mascotWelcome';
      v.replaceWith(img);
    }
  }

  // Reveal animation hook
  const card = container.querySelector('.visual .card.revealable');
  if (card) {
    if (prefersReduced) {
      card.classList.add('is-in');
    } else if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { card.classList.add('is-in'); io.disconnect(); }
      }, { threshold: 0.25 });
      io.observe(card);
    } else {
      card.classList.add('is-in');
    }
  }
}