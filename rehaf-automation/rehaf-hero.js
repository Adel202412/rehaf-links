// in rehaf-hero.js
export function initRehafHero(container) {
  if (!container) return;
  container.classList.add('split');
  container.innerHTML = `
    <div class="hero-inner">
      <div class="copy">
        <div class="kicker">AI Virtual Office</div>
        <h1>
          Create Hundreds of <span class="ai">AI Employees</span><br>
          Inside <span class="brand">REHAF's</span> Work Platform
        </h1>
        <p class="sub">Manage all Human Work and AI Work in a single platform with seamless handoff.</p>
        <div class="btn-row">
          <a class="btnx primary" href="mailto:lilafutum@gmail.com">Try REHAF for Free</a>
          <a class="btnx ghost" href="mailto:lilafutum@gmail.com?subject=REHAF%20Sales">Contact Sales</a>
        </div>
      </div>
      <div class="visual">
        <div class="card">
          <video class="mascotWelcome" autoplay loop muted playsinline>
            <source src="assets/mascotvideo.webm" type="video/webm">
          </video>
        </div>
      </div>
    </div>
    <div class="downHint">Scroll to enter the office !</div>
  `;
}