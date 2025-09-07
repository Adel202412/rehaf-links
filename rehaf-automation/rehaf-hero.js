export function initRehafHero(container) {
  if (!container) return;
  container.innerHTML = `
    <section class="hero">
      <video class="mascotWelcome" autoplay loop muted playsinline>
        <source src="assets/mascotvideo.webm" type="video/webm">
        Your browser does not support the video tag.
      </video>
      <h1>Hi, I am REHAF</h1>
      <p>Welcome to our AI Virtual Office.</p>
      <div class="downHint">Scroll to enter the office !</div>
    </section>
  `;
}