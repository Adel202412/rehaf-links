// rehaf-hero.js
export function initRehafHero(container) {
  if (!container) return;
  container.classList.add("split");
  container.innerHTML = `
    <div class="hero-inner" aria-labelledby="heroTitle">
      <div class="copy">
        <div class="kicker">AI Virtual Office</div>
        <h1 id="heroTitle">
          Hi, I am <span class="ai">REHAF</span><br>
          I own a <span class="brand">Virtual Office</span>
        </h1>
        <p class="sub">
          Hire always-on AI employees to automate tasks, reduce errors, and move faster.
        </p>
        <div class="btn-row">
          <a class="btnx primary" href="mailto:info@rehaf.ae" aria-label="Contact REHAF to hire AI employees">
            Hire my AI employees
          </a>
          <a class="btnx ghost" href="#office" aria-label="Explore the virtual office">Explore the Office</a>
        </div>
      </div>

      <div class="visual" aria-hidden="true">
        <div class="card">
          <video class="mascotWelcome" autoplay loop muted playsinline preload="metadata"
                 poster="src/assets/mascots/logo.webp">
            <source src="src/assets/mascotvideo.webm" type="video/webm">
          </video>
          <div class="mascotGround"></div>
        </div>
      </div>
    </div>
  `;

  // Respect reduced motion: swap video for a static image
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    const v = container.querySelector('.mascotWelcome');
    if (v) {
      const img = document.createElement('img');
      img.src = 'src/assets/mascots/logo.webp';
      img.alt = '';
      img.className = 'mascotWelcome';
      v.replaceWith(img);
    }
  }
}