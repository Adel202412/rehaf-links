// rehaf-runner.js

// Public API expected by your boot: take existing elements and start the game
export function renderRunner(canvas, scoreEl, card) {
  if (!canvas || !scoreEl || !card) {
    console.warn("[Runner] Missing elements:", { canvas, scoreEl, card });
    return;
  }
  initRehafRunner(canvas, scoreEl, card);
}

// Game engine
export function initRehafRunner(canvas, scoreEl, card) {
  const ctx = canvas.getContext("2d");

  // DPR fit
  let vw = canvas.clientWidth,
    vh = canvas.clientHeight;
  function fit() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    vw = w;
    vh = h;
  }
  fit();
  window.addEventListener("resize", fit, { passive: true });

  const C = {
    bg: "#fff",
    ground: "#e7f4f1",
    r1: "#00ab9a",
    r2: "#00786c",
    letter: "#00453e",
    shadow: "rgba(0,0,0,.10)",
  };
  let inView = false,
    running = true,
    score = 0,
    best = 0,
    lastMile = 0,
    t0 = 0; // <-- single t0 here
  const gy = () => Math.round(vh - 36);
  const R = {
    x: 80,
    y: 0,
    w: 34,
    h: 40,
    vy: 0,
    gravity: 0.68,
    jumpV: -10.6,
    onGround: true,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
    jumps: 0,
    maxJumps: 2,
  };
  const letters = ["E", "H", "A", "F"],
    obs = [],
    spawn = { t: 0, next: 980 };

  function reset() {
    score = 0;
    lastMile = 0;
    running = true;
    R.y = gy() - R.h;
    R.vy = 0;
    R.onGround = true;
    R.jumps = 0;
    R.angle = 0;
    R.scaleX = 1;
    R.scaleY = 1;
    obs.length = 0;
    spawn.t = 0;
    spawn.next = 980;
  }
  reset();

  function toast(txt) {
    if (!card) return;
    const d = document.createElement("div");
    d.className = "toast";
    d.textContent = txt;
    card.appendChild(d);
    setTimeout(() => d.remove(), 1600);
  }

  function jump() {
    if (!inView) return;
    if (!running) {
      reset();
      return;
    }
    if (R.jumps < R.maxJumps) {
      R.vy = R.jumpV;
      R.onGround = false;
      R.jumps++;
      R.scaleX = 1.1;
      R.scaleY = 0.9;
      R.angle = -0.2;
    }
  }
  window.addEventListener("keydown", (e) => {
    if (
      [" ", "ArrowUp", "w", "W"].includes(e.key) ||
      ["Space", "ArrowUp", "KeyW"].includes(e.code)
    ) {
      e.preventDefault();
      jump();
    }
  });
  canvas.addEventListener("pointerdown", jump, { passive: true });

  function rnd(a, b) {
    return Math.random() * (b - a) + a;
  }
  function spawnObs() {
    const size = rnd(18, 28),
      speed = rnd(2.2, 2.9),
      right = obs.length ? obs[obs.length - 1].x : vw + 50;
    obs.push({
      x: Math.max(vw + 20, right + rnd(300, 420)),
      y: gy(),
      s: size,
      v: speed,
      ch: letters[(Math.random() * letters.length) | 0],
    });
  }

  function update(dt) {
    R.vy += R.gravity;
    R.y += R.vy;
    const target = Math.max(-0.6, Math.min(0.6, R.vy * 0.045));
    R.angle += (target - R.angle) * 0.25;
    R.scaleX += (1 - R.scaleX) * 0.15;
    R.scaleY += (1 - R.scaleY) * 0.15;
    const y = gy() - R.h;
    if (R.y >= y) {
      R.y = y;
      R.vy = 0;
      if (!R.onGround) {
        R.scaleX = 0.94;
        R.scaleY = 1.06;
      }
      R.onGround = true;
      R.jumps = 0;
      R.angle *= 0.6;
    }

    spawn.t += dt;
    if (spawn.t >= spawn.next) {
      spawn.t = 0;
      spawn.next = rnd(900, 1250);
      spawnObs();
    }

    for (let i = obs.length - 1; i >= 0; i--) {
      const o = obs[i];
      o.x -= o.v;
      if (o.x + o.s < -30) obs.splice(i, 1);
      const hit = !(
        R.x + R.w < o.x - o.s / 2 ||
        R.x > o.x + o.s / 2 ||
        R.y + R.h < o.y - o.s ||
        R.y > o.y
      );
      if (hit) {
        running = false;
        best = Math.max(best, Math.floor(score));
      }
    }

    if (running) {
      score += dt * 0.01;
      const mile = Math.floor(score / 100);
      if (mile > lastMile) {
        lastMile = mile;
        toast(`Well done! Mile ${mile}`);
      }
    }
    if (scoreEl)
      scoreEl.textContent = `${Math.floor(score)}${best ? " / Best " + best : ""}`;
  }

  function drawBG() {
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, vw, vh);
    ctx.strokeStyle = C.ground;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, gy() + 0.5);
    ctx.lineTo(vw, gy() + 0.5);
    ctx.stroke();
  }

  function drawRunner() {
    ctx.save();
    ctx.translate(R.x + R.w / 2, R.y + R.h / 2);
    ctx.rotate(R.angle);
    ctx.scale(R.scaleX, R.scaleY);
    ctx.save();
    ctx.translate(-R.w / 2, -R.h / 2);
    ctx.fillStyle = C.shadow;
    ctx.beginPath();
    ctx.ellipse(R.w / 2, R.h + 6, R.w * 0.36, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    const r = 8,
      x = 0,
      y = 0,
      w = R.w,
      h = R.h;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, C.r1);
    g.addColorStop(1, C.r2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px Inter, system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("R", w / 2, h / 2 - 1);
    ctx.restore();
    ctx.restore();
  }

  function drawObs(o) {
    const x = o.x,
      y = o.y;
    ctx.save();
    ctx.fillStyle = "rgba(0,171,154,0.08)";
    ctx.strokeStyle = "#cfe7e3";
    ctx.lineWidth = 1;
    ctx.fillRect(x - o.s / 2, y - o.s, o.s, o.s);
    ctx.strokeRect(x - o.s / 2, y - o.s, o.s, o.s);
    ctx.fillStyle = C.letter;
    ctx.font = `bold ${Math.floor(o.s * 0.8)}px Inter, system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(o.ch, x, y - o.s / 2 + 2);
    ctx.restore();
  }

  function drawOver() {
    if (running) return;
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.fillRect(0, 0, vw, vh);
    ctx.fillStyle = C.letter;
    ctx.font = "bold 22px Inter, system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Game Over — tap or press Space to restart", vw / 2, vh / 2);
    ctx.restore();
  }

  function loop(ts) {
    const dt = Math.min(32, ts - (t0 || ts));
    t0 = ts;
    if (inView) {
      update(dt);
      drawBG();
      obs.forEach(drawObs);
      drawRunner();
      drawOver();
    } else {
      drawBG();
      obs.forEach(drawObs);
      drawRunner();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  const io = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        inView = e.isIntersecting;
      });
    },
    { threshold: 0.2 },
  );
  io.observe(canvas);
}
