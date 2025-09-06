// rehaf-hero.js
export function initRehafHero(container) {
  if (!container) return;
  container.innerHTML = `
    <section class="hero">
      <img class="mascotWelcome" src="assets/moscot.webp" alt="REHAF mascot waving" />
      <h1>Hi, I am REHAF</h1>
      <p>Welcome to our AI Virtual Office.</p>
      <div class="downHint">Scroll to enter the office ↓</div>
    </section>
  `;
}