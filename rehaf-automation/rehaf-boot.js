// rehaf-boot.js
const $ = (sel) => document.querySelector(sel);

(async () => {
  // Import modules (no silent swallowing)
  const [heroMod, officeMod, runnerMod, archMod, footerMod] = await Promise.all([
    import('./rehaf-hero.js'),
    import('./rehaf-office.js'),
    import('./rehaf-runner.js'),
    import('./rehaf-architecture.js'),
    import('./rehaf-footer.js'),
  ]);

  // Call safely so one failure doesn't block others
  const safe = (fn, ...args) => { try { fn?.(...args); } catch (e) { console.error(e); } };

  safe(heroMod.initRehafHero, $('#hero'));
  // Office now takes (container, options) and builds its own DOM
  safe(officeMod.initRehafOffice, $('#office'), {
    jsonPath: './services.json',
    floorplanSrc: 'assets/floorplan.webp'
  });
  // Runner now exposes renderRunner(container) that builds markup then boots the game
  safe(runnerMod.renderRunner, $('#runner'));
  safe(archMod.initRehafArchitecture, $('#architecture'));
  safe(footerMod.initRehafFooter, $('#footer'));

  // Optional debug
  if (new URLSearchParams(location.search).has('debug')) {
    console.log('Modules ok:', { heroMod, officeMod, runnerMod, archMod, footerMod });
  }
})();