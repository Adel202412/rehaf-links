// rehaf-boot.js
// Central loader for all REHAF modules

import { initRehafHero } from './rehaf-hero.js';
import { initRehafOffice } from './rehaf-office.js';
import { renderRunner } from './rehaf-runner.js';
import { initRehafArchitecture } from './rehaf-architecture.js';
import { initRehafFooter } from './rehaf-footer.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[BOOT] Starting REHAF modules…');

  try {
    // HERO
    const heroContainer = document.getElementById('hero');
    if (heroContainer) {
      initRehafHero(heroContainer);
      console.log('[BOOT] Hero initialized');
    } else {
      console.warn('[BOOT] Hero container not found');
    }

    // OFFICE
    const officeWrap = document.getElementById('officeWrap');
    const pop = document.getElementById('pop');
    const qgrid = document.getElementById('quickGrid');
    if (officeWrap && pop) {
      await initRehafOffice(officeWrap, pop, qgrid, 'src/data/services.json');
      console.log('[BOOT] Office initialized');
    } else {
      console.warn('[BOOT] Office shell missing');
    }

    // RUNNER
    const canvas = document.getElementById('rehafRunner');
    const scoreEl = document.getElementById('runnerScore');
    const card = document.getElementById('runnerCard');
    if (canvas && scoreEl && card) {
      renderRunner(canvas, scoreEl, card);
      console.log('[BOOT] Runner initialized');
    } else {
      console.warn('[BOOT] Runner shell missing');
    }

    // ARCHITECTURE
    const archContainer = document.querySelector('#architecture .container');
    if (archContainer) {
      initRehafArchitecture(archContainer);
      console.log('[BOOT] Architecture initialized');
    } else {
      console.warn('[BOOT] Architecture container not found');
    }

    // FOOTER
    const footerContainer = document.querySelector('#footer .container');
    if (footerContainer) {
      initRehafFooter(footerContainer);
      console.log('[BOOT] Footer initialized');
    } else {
      console.warn('[BOOT] Footer container not found');
    }

    console.log('[BOOT] ✅ All modules attempted');
  } catch (err) {
    console.error('[BOOT] ❌ Error while loading modules:', err);
  }
});
