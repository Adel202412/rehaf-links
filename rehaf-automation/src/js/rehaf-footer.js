// rehaf-footer.js (V2)
export function initRehafFooter(container) {
  if (!container) return;
  container.innerHTML = `
    <footer id="footer" class="footer">
      <div class="container footer-grid">
        <div class="footer-left">
          <span>© REHAF, 2025. All rights reserved.</span>
        </div>

        <nav class="footer-nav">
          <a href="#solutions">Solutions</a>
          <a href="#process">Process</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <a href="#office">Explore Floorplan</a>
        </nav>

        <div class="footer-right">
          <span class="chip">English</span>
          <span class="chip">العربية</span>
        </div>
      </div>
      <div class="footer-note">Made with ❤️ in the UAE</div>
    </footer>
  `;
}