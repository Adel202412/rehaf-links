/* Full Website Debugger (REHAF edition)
   - Enable with ?debug=1 or localStorage.debug="1"
   - Toggle overlay: Alt+D, Disable forever: Alt+Shift+D
   - No dependencies, no builds
*/
(() => {
  const enabled = /[?&]debug=1/.test(location.search) || localStorage.getItem("debug") === "1";
  if (!enabled) return;

  /** ------------ util ------------- **/
  const now = () => performance.now();
  const fmtMs = (n) => `${Math.round(n)}ms`;
  const kb = (n) => `${(n/1024).toFixed(1)} KB`;
  const isPlainObj = (v) => Object.prototype.toString.call(v) === "[object Object]";
  const safeJSON = (v) => {
    try { return JSON.stringify(v); } catch { return String(v); }
  };

  const state = {
    logs: [],        // console + errors + network
    net: { fetch: [], xhr: [] },
    perf: { paints: {}, nav: null, lcp: null, cls: 0, fid: null, longTasks: [] },
    res: [],         // resource timings (lazy fill on expand)
    domChanges: 0,
  };

  /** -------- overlay DOM ---------- **/
  const style = document.createElement("style");
  style.textContent = `
  #dbg { position: fixed; inset: auto 12px 12px auto; z-index:999999; 
         background:#0b1220; color:#a8f3e6; border:1px solid #1f3a36;
         border-radius:10px; box-shadow:0 8px 18px rgba(0,0,0,.25); 
         font:12px/1.2 system-ui, Segoe UI, Arial; width: 280px }
  #dbg header { display:flex; align-items:center; justify-content:space-between; 
                gap:8px; padding:8px 10px; border-bottom:1px solid #16312c }
  #dbg header b { color:#e8fff9; font-size:12px }
  #dbg .row { display:flex; gap:6px; align-items:center; flex-wrap:wrap }
  #dbg .chip { background:#0d1a1a; border:1px solid #214c44; color:#b7fff0; 
               border-radius:8px; padding:4px 6px; font-weight:700 }
  #dbg .muted { color:#81cdbf }
  #dbg .btn  { background:#07302a; color:#b7fff0; border:1px solid #214c44; 
               border-radius:8px; padding:4px 6px; cursor:pointer; font-weight:800 }
  #dbg .btn:hover{ background:#0b3e36 }
  #dbg .wrap { max-height: 50vh; overflow:auto; padding:8px 10px; display:none }
  #dbg.open .wrap { display:block }
  #dbg .sec { margin:8px 0 }
  #dbg .sec h4 { color:#b7fff0; margin:6px 0 }
  #dbg code, #dbg pre { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  #dbg .log { border:1px solid #16312c; border-radius:8px; padding:6px; margin:6px 0; background:#0a1620 }
  #dbg .log .t { color:#9adbd0 }
  #dbg .log.err { border-color:#4a1f23; background:#1a0e10; color:#ffc0c8 }
  #dbg .kv { display:grid; grid-template-columns: 90px 1fr; gap:4px 8px; }
  #dbg .tbl { width:100%; border-collapse:collapse; }
  #dbg .tbl th, #dbg .tbl td { border-bottom:1px solid #16312c; padding:4px 6px; text-align:left; }
  #dbg .right { margin-left:auto }
  `;
  document.head.appendChild(style);

  const el = document.createElement("div");
  el.id = "dbg";
  el.innerHTML = `
    <header>
      <b>REHAF Debugger</b>
      <div class="row">
        <span class="chip" id="dbgStat">…</span>
        <button class="btn" id="dbgToggle">Open</button>
      </div>
    </header>
    <div class="wrap">
      <div class="sec" id="secSummary"></div>
      <div class="sec" id="secPerf"></div>
      <div class="sec" id="secNetwork"></div>
      <div class="sec" id="secConsole"></div>
      <div class="sec" id="secStorage"></div>
      <div class="sec" id="secDOM"></div>
      <div class="sec" id="secActions"></div>
    </div>
  `;
  document.body.appendChild(el);

  const $ = (sel) => el.querySelector(sel);
  const stat = $("#dbgStat");

  const setOpen = (v) => { el.classList.toggle("open", v); $("#dbgToggle").textContent = v ? "Close" : "Open"; };
  $("#dbgToggle").onclick = () => setOpen(!el.classList.contains("open"));

  // Keyboard controls
  window.addEventListener("keydown", (e) => {
    if (e.altKey && e.key.toLowerCase() === "d" && !e.shiftKey) {
      setOpen(!el.classList.contains("open"));
    } else if (e.altKey && e.shiftKey && e.key.toLowerCase() === "d") {
      localStorage.removeItem("debug");
      alert("Debug disabled. Refresh to hide if ?debug=1 is not present.");
    }
  });

  /** -------- summary/env ------- **/
  function renderSummary() {
    const ua = navigator.userAgent;
    const dpr = window.devicePixelRatio || 1;
    const vw = Math.round(window.visualViewport?.width || window.innerWidth);
    const vh = Math.round(window.visualViewport?.height || window.innerHeight);
    const on = navigator.onLine ? "online" : "offline";
  
    const mem = performance.memory && performance.memory.jsHeapSizeLimit
  ? `${Math.round(performance.memory.jsHeapSizeLimit / 1048576)} MB`
  : "n/a";

    const sw = ("serviceWorker" in navigator) ? (navigator.serviceWorker.controller ? "active" : "supported") : "no";
    const webgl = (() => {
      try { const c = document.createElement("canvas"); return !!(c.getContext("webgl") || c.getContext("experimental-webgl")); } catch { return false; }
    })();
    const storage = (async () => {
      try { const q = await navigator.storage?.estimate?.(); return q?.quota ? `${(q.quota/1024/1024).toFixed(0)} MB` : "n/a"; } catch { return "n/a"; }
    })();

    const html = `
      <h4>Summary</h4>
      <div class="kv">
        <div>Viewport</div><div>${vw}×${vh} @${dpr}x</div>
        <div>Network</div><div>${on}</div>
        <div>UserAgent</div><div>${ua}</div>
        <div>SW</div><div>${sw}</div>
        <div>Heap Limit</div><div>${mem}</div>
        <div>Storage</div><div id="dbgStorageQuota">…</div>
      </div>
    `;
    $("#secSummary").innerHTML = html;
    Promise.resolve(storage).then((v)=> { $("#dbgStorageQuota").textContent = v; });
  }

  /** -------- performance -------- **/
  function setupPerformance() {
    // navigation + paint
    const nav = performance.getEntriesByType("navigation")[0];
    if (nav) state.perf.nav = nav.toJSON ? nav.toJSON() : nav;

    // Paint entries (FCP/LCP/CLS via PerformanceObserver)
    try {
      const poPaint = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          state.perf.paints[e.name] = e.startTime;
        }
        renderPerf();
      });
      poPaint.observe({ type: "paint", buffered: true });
    } catch {}

    // LCP
    try {
      const poLCP = new PerformanceObserver((list) => {
        const last = list.getEntries().pop();
        if (last) state.perf.lcp = last.startTime;
        renderPerf();
      });
      poLCP.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}

    // CLS
    try {
      let cls = 0;
      const poCLS = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (!e.hadRecentInput) cls += e.value;
        }
        state.perf.cls = cls;
        renderPerf();
      });
      poCLS.observe({ type: "layout-shift", buffered: true });
    } catch {}

    // Long tasks
    try {
      const poLT = new PerformanceObserver((list) => {
        state.perf.longTasks.push(...list.getEntries().map(e => ({ start: e.startTime, dur: e.duration })));
        renderPerf();
      });
      poLT.observe({ type: "longtask", buffered: true });
    } catch {}

    // FID-ish (first input delay) – measure on first user input
    let firstInputAt = null;
    const onFirstInput = (e) => {
      if (firstInputAt) return;
      firstInputAt = now();
      state.perf.fid = firstInputAt - performance.timeOrigin;
      renderPerf();
      window.removeEventListener("pointerdown", onFirstInput, { capture: true });
      window.removeEventListener("keydown", onFirstInput, { capture: true });
    };
    window.addEventListener("pointerdown", onFirstInput, { capture: true, once: true });
    window.addEventListener("keydown", onFirstInput, { capture: true, once: true });
  }

  function renderPerf() {
    const p = state.perf;
    const nav = p.nav || {};
    const paints = p.paints || {};
    const rows = [];
    if (paints["first-contentful-paint"]) rows.push(`<tr><th>FCP</th><td>${fmtMs(paints["first-contentful-paint"])}</td></tr>`);
    if (p.lcp) rows.push(`<tr><th>LCP</th><td>${fmtMs(p.lcp)}</td></tr>`);
    rows.push(`<tr><th>CLS</th><td>${(p.cls||0).toFixed(3)}</td></tr>`);
    if (p.fid) rows.push(`<tr><th>FID-ish</th><td>${fmtMs(p.fid)}</td></tr>`);
    if (nav && nav.domContentLoadedEventEnd) rows.push(`<tr><th>DOM Ready</th><td>${fmtMs(nav.domContentLoadedEventEnd)}</td></tr>`);
    if (nav && nav.loadEventEnd) rows.push(`<tr><th>Load</th><td>${fmtMs(nav.loadEventEnd)}</td></tr>`);

    $("#secPerf").innerHTML = `
      <h4>Performance</h4>
      <table class="tbl">
        <tbody>${rows.join("")}</tbody>
      </table>
      <div class="muted">Long tasks: ${state.perf.longTasks.length}</div>
      <button class="btn" id="dbgPerfRes">Show Slow Resources</button>
      <div id="dbgResWrap"></div>
    `;

    $("#dbgPerfRes").onclick = () => {
      const list = performance.getEntriesByType("resource")
        .filter(e => e.duration > 200 || (e.transferSize||0) > 100*1024)
        .sort((a,b)=>b.duration-a.duration)
        .slice(0,30);
      const rows = list.map(e => `
        <tr>
          <td>${e.initiatorType || "-"}</td>
          <td title="${e.name}">${e.name.split("/").slice(-1)[0]}</td>
          <td>${fmtMs(e.duration)}</td>
          <td>${e.transferSize ? kb(e.transferSize) : "–"}</td>
          <td>${fmtMs(e.responseStart - e.requestStart)}<!-- TTFB --></td>
        </tr>`).join("");
      $("#dbgResWrap").innerHTML = `
        <table class="tbl">
          <thead><tr><th>Type</th><th>Name</th><th>Dur</th><th>Size</th><th>TTFB</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="5" class="muted">No slow resources.</td></tr>`}</tbody>
        </table>`;
    };
  }

  /** -------- console & errors ----- **/
  function pushLog(kind, args, extra={}) {
    const time = new Date().toLocaleTimeString();
    const entry = { time, kind, args: Array.from(args), ...extra };
    state.logs.push(entry);
    if (state.logs.length > 400) state.logs.shift();
    renderConsole();
    bumpStat();
  }

  // Proxy console
  ["log","info","warn","error"].forEach((k) => {
    const orig = console[k];
    console[k] = function(...a){
      pushLog(k, a);
      orig.apply(console, a);
    };
  });

  // Global errors
  window.addEventListener("error", (e) => {
    pushLog("error", [e.message, e.filename+":"+e.lineno], { type:"error" });
  });
  window.addEventListener("unhandledrejection", (e) => {
    pushLog("error", ["Promise rejection", e.reason], { type:"promise" });
  });

  function renderConsole() {
    const last = state.logs.slice(-50);
    const html = last.map(l => {
      const body = l.args.map(v => {
        if (isPlainObj(v) || Array.isArray(v)) return `<pre>${safeJSON(v)}</pre>`;
        return `<code>${String(v)}</code>`;
      }).join(" ");
      const cls = (l.kind === "error") ? "log err" : "log";
      return `<div class="${cls}"><span class="t">${l.time}</span> • <b>${l.kind.toUpperCase()}</b><div>${body}</div></div>`;
    }).join("");
    $("#secConsole").innerHTML = `<h4>Console & Errors</h4>${html || '<div class="muted">No logs yet.</div>'}`;
  }

  /** -------- network intercept ----- **/
  // fetch
  const origFetch = window.fetch;
  window.fetch = async function(input, init) {
    const start = now();
    let url = (typeof input === "string") ? input : input.url;
    let method = (init && init.method) || "GET";
    try {
      const res = await origFetch(input, init);
      const dur = now() - start;
      const size = Number(res.headers.get("content-length")) || 0;
      state.net.fetch.push({ url, method, status: res.status, dur, size });
      if (state.net.fetch.length > 200) state.net.fetch.shift();
      renderNetwork();
      bumpStat();
      return res;
    } catch (err) {
      const dur = now() - start;
      state.net.fetch.push({ url, method, status: "ERR", dur, size: 0, error: String(err) });
      renderNetwork();
      bumpStat();
      throw err;
    }
  };

  // XHR
  const OrigXHR = window.XMLHttpRequest;
  function PatchedXHR() {
    const xhr = new OrigXHR();
    const meta = { url:"", method:"GET", start:0 };
    const open = xhr.open;
    xhr.open = function(m,u){ meta.method=m; meta.url=u; open.apply(xhr, arguments); };
    xhr.addEventListener("loadstart", ()=> meta.start = now());
    xhr.addEventListener("loadend", ()=>{
      const dur = now() - meta.start;
      state.net.xhr.push({ url: meta.url, method: meta.method, status: xhr.status, dur, size: Number(xhr.getResponseHeader("content-length"))||0 });
      if (state.net.xhr.length > 200) state.net.xhr.shift();
      renderNetwork(); bumpStat();
    });
    xhr.addEventListener("error", ()=>{
      const dur = now() - meta.start;
      state.net.xhr.push({ url: meta.url, method: meta.method, status: "ERR", dur, size:0 });
      renderNetwork(); bumpStat();
    });
    return xhr;
  }
  window.XMLHttpRequest = PatchedXHR;

  function renderNetwork() {
    const recent = [...state.net.fetch.slice(-10).reverse(), ...state.net.xhr.slice(-10).reverse()]
      .sort((a,b)=>b.dur - a.dur).slice(0,10);

    const rows = recent.map(r => `
      <tr>
        <td>${r.method}</td>
        <td title="${r.url}">${r.url.split("/").slice(-1)[0]}</td>
        <td>${r.status}</td>
        <td>${fmtMs(r.dur)}</td>
        <td>${r.size ? kb(r.size) : "–"}</td>
      </tr>`).join("");

    $("#secNetwork").innerHTML = `
      <h4>Network (recent)</h4>
      <table class="tbl">
        <thead><tr><th>M</th><th>URL</th><th>St</th><th>Dur</th><th>Size</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5" class="muted">No requests yet.</td></tr>`}</tbody>
      </table>
      <div class="row" style="margin-top:6px">
        <button class="btn" id="dbgExport">Export Logs</button>
        <span class="muted right">Online: ${navigator.onLine ? "yes" : "no"}</span>
      </div>
    `;
    $("#dbgExport").onclick = () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `rehaf-debug-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    };
  }

  /** -------- storage inspector ----- **/
  function renderStorage() {
    const ls = Object.keys(localStorage).map(k => [k, localStorage.getItem(k)]);
    const ss = Object.keys(sessionStorage).map(k => [k, sessionStorage.getItem(k)]);
    const cs = document.cookie ? document.cookie.split(";").map(s => s.trim().split("=")) : [];

    function make(list, title) {
      const rows = list.map(([k,v]) => `<tr><td>${k}</td><td>${(v||"").slice(0,120)}</td><td>${kb((v||"").length)}</td></tr>`).join("");
      return `
        <h5 style="margin:6px 0">${title}</h5>
        <table class="tbl">
          <thead><tr><th>Key</th><th>Value</th><th>Size</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="3" class="muted">Empty</td></tr>`}</tbody>
        </table>`;
    }

    $("#secStorage").innerHTML = `
      <h4>Storage</h4>
      ${make(ls, "localStorage")}
      ${make(ss, "sessionStorage")}
      ${make(cs, "Cookies")}
    `;
  }

  /** -------- DOM & mutations ----- **/
  const mo = new MutationObserver((muts) => {
    state.domChanges += muts.length;
    if (state.domChanges % 25 === 0) bumpStat();
  });
  mo.observe(document.documentElement, { childList:true, subtree:true, attributes:false });

  function renderDOM() {
    const nodes = document.getElementsByTagName("*").length;
    $("#secDOM").innerHTML = `
      <h4>DOM</h4>
      <div class="kv">
        <div>Nodes</div><div>${nodes}</div>
        <div>Mutations</div><div>${state.domChanges}</div>
      </div>
    `;
  }

  /** -------- actions -------------- **/
  function renderActions() {
    $("#secActions").innerHTML = `
      <h4>Actions</h4>
      <div class="row">
        <button class="btn" id="dbgReload">Reload</button>
        <button class="btn" id="dbgClearLS">Clear LS</button>
        <button class="btn" id="dbgClearSS">Clear SS</button>
        <button class="btn" id="dbgClearCache">Clear Cache</button>
      </div>
    `;
    $("#dbgReload").onclick = ()=> location.reload();
    $("#dbgClearLS").onclick = ()=> { localStorage.clear(); alert("localStorage cleared"); renderStorage(); };
    $("#dbgClearSS").onclick = ()=> { sessionStorage.clear(); alert("sessionStorage cleared"); renderStorage(); };
    $("#dbgClearCache").onclick = async ()=> {
      if ("caches" in window) {
        const keys = await caches.keys(); for (const k of keys) await caches.delete(k);
        alert("Caches cleared");
      } else alert("Cache API not supported");
    };
  }

  /** -------- badge stat update ---- **/
  function bumpStat() {
    const errs = state.logs.filter(l => l.kind === "error").length;
    const reqs = state.net.fetch.length + state.net.xhr.length;
    stat.textContent = `err:${errs} • net:${reqs} • dom:${state.domChanges}`;
  }

  /** -------- initial render -------- **/
  renderSummary();
  setupPerformance(); renderPerf();
  renderNetwork();
  renderConsole();
  renderStorage();
  renderDOM();
  renderActions();

  // Connectivity & viewport listeners
  window.addEventListener("online", bumpStat);
  window.addEventListener("offline", bumpStat);
  window.addEventListener("resize", () => { renderSummary(); renderDOM(); });
})();