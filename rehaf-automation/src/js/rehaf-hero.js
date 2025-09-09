// in rehaf-hero.js
export function initRehafHero(container) {
  if (!container) return;
  container.classList.add("split");
  container.innerHTML = `
    <div class="hero-inner">
      <div class="copy">
        <div class="kicker">AI Virtual Office</div>
        <h1>
          Hi, I am <span class="ai">REHAF</span><br>
          I own a <span class="brand">Virtual Office</span>
        </h1>
        <p class="sub">All my employees are AI Employees, and they are extremely clever and 24 hours working for me.</p>
        <div class="btn-row">
          <a class="btnx primary" href="mailto:lilafutum@gmail.com">contact me to rent my employees 😁</a>
        </div>
      </div>
      <div class="visual">
        <div class="card">
          <video class="mascotWelcome" autoplay loop muted playsinline>
            <source src="src/assets/mascotvideo.webm" type="video/webm">
          </video>
        </div>
      </div>
    </div>
  `;
}
