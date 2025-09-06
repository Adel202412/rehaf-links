// rehaf-boot.js
(async () => {
  const $ = sel => document.querySelector(sel);

  // Import modules (ensure these filenames exist)
  const [
    heroMod,
    officeMod,
    runnerMod,
    archMod,
    footerMod
  ] = await Promise.all([
    import('./rehaf-hero.js').catch(() => ({})),
    import('./rehaf-office.js').catch(() => ({})),
    import('./rehaf-runner.js').catch(() => ({})),
    import('./rehaf-architecture.js').catch(() => ({})),
    import('./rehaf-footer.js').catch(() => ({})),
  ]);

  // Mount in order; if a module is missing, skip gracefully
  heroMod.unitRehafHero?.($('#hero'));
  officeMod.initRehafOffice?.($('#office'), { servicesUrl: './services.json' });
  runnerMod.initRehafRunner?.($('#runner'));
  archMod.initRehafArchitecture?.($('#architecture'));
  footerMod.initRehafFooter?.($('#footer'));

  // Tiny debug helper if you add ?debug in URL
  if (new URLSearchParams(location.search).has('debug')) {
    console.log('Modules:', { heroMod, officeMod, runnerMod, archMod, footerMod });
  }
})();
