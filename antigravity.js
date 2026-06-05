console.log('Antigravity: Static constellation with water-ripple mouse effect');

export function initAntigravity(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    pointer-events: none;
    z-index: 0;
  `;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // ─── CONFIG ────────────────────────────────────────────────────
  const GRID_SPACING  = 36;   // space between dots (bigger = fewer dots)
  const DOT_RADIUS    = 1.6;  // dot size
  const BASE_OPACITY  = 0.24; // base opacity
  const MOUSE_RADIUS  = 143;  // ripple zone around mouse
  const MAX_PUSH      = 23;   // max pixels a dot moves when mouse is near
  const RETURN_SPEED  = 0.06; // how fast dot returns to home (0–1, lower=slower)
  const PUSH_SPEED    = 0.10; // how fast dot moves toward pushed position
  const COLOR         = '#e7f702'; // yellow
  // ───────────────────────────────────────────────────────────────

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;

  // Build static grid of dots
  let dots = [];

  function buildGrid() {
    dots = [];
    const cols = Math.ceil(W / GRID_SPACING) + 1;
    const rows = Math.ceil(H / GRID_SPACING) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Slight offset on every other row for a natural look
        const offsetX = (r % 2) * (GRID_SPACING / 2);
        const hx = c * GRID_SPACING + offsetX;
        const hy = r * GRID_SPACING;
        dots.push({
          hx, hy,          // home position (never changes)
          x: hx, y: hy,    // current position
          vx: 0, vy: 0     // velocity
        });
      }
    }
  }

  buildGrid();

  // Mouse tracking
  let mx = -9999, my = -9999;
  window.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
  window.addEventListener('pointerleave', () => { mx = -9999; my = -9999; });

  // Resize
  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
    buildGrid();
  });

  // ─── ANIMATION LOOP ────────────────────────────────────────────
  function tick() {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = COLOR;

    for (const d of dots) {
      // Distance from mouse
      const dx = d.hx - mx;
      const dy = d.hy - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetX = d.hx;
      let targetY = d.hy;

      if (dist < MOUSE_RADIUS && dist > 0) {
        // Push dot away from mouse, strength fades with distance
        const strength = (1 - dist / MOUSE_RADIUS);
        const push = MAX_PUSH * strength;
        targetX = d.hx + (dx / dist) * push;
        targetY = d.hy + (dy / dist) * push;
      }

      // Smooth interpolate toward target
      d.x += (targetX - d.x) * (dist < MOUSE_RADIUS ? PUSH_SPEED : RETURN_SPEED);
      d.y += (targetY - d.y) * (dist < MOUSE_RADIUS ? PUSH_SPEED : RETURN_SPEED);

      // Opacity: slightly brighter near mouse
      let alpha = BASE_OPACITY;
      if (dist < MOUSE_RADIUS) {
        alpha = BASE_OPACITY + (0.5 - BASE_OPACITY) * (1 - dist / MOUSE_RADIUS);
      }

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  tick();
}
