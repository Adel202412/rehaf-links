import { renderHero } from './rehaf-hero.js';
import { renderOffice } from './rehaf-office.js';
import { renderRunner } from './rehaf-runner.js';
import { renderArchitecture } from './rehaf-architecture.js';
import { renderFooter } from './rehaf-footer.js';

// Simple inline sections
function renderWhy(){ 
  document.querySelector('#rehaf-why').innerHTML = `
    <h2>Why Automation Matters</h2>
    <p>Automation reduces repetitive work, lowers costs, and minimizes errors.
    With REHAF’s AI-driven systems, your team can focus on growth instead of routine tasks.</p>`;
}
function renderTestimony(){
  document.querySelector('#rehaf-testimony').innerHTML = `
    <h3>What People Say</h3>
    <p>“REHAF helped us streamline operations and save countless hours. The virtual office is a game-changer.”</p>`;
}
function renderCTA(){
  document.querySelector('#rehaf-cta').innerHTML = `
    <h2 style="color:var(--accent);text-align:center">Let’s start your journey with us</h2>
    <p style="text-align:center;color:#475569;margin-top:6px">Tell us your goal. We’ll automate the path.</p>
    <div style="display:flex;justify-content:center;margin-top:12px">
      <a class="btn primary" href="mailto:info@rehaf.ae">Contact Us</a>
    </div>`;
}

window.addEventListener('DOMContentLoaded', () => {
  renderHero('#rehaf-hero');
  renderOffice('#rehaf-office');
  renderWhy();
  renderTestimony();
  renderCTA();
  renderRunner('#rehaf-runner');
  renderArchitecture('#rehaf-architecture');
  renderFooter('#rehaf-footer');
});