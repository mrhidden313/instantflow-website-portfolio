console.log('Antigravity: Oily transparent liquid water effect');

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

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;

  // ─── CONFIG ────────────────────────────────────────────────────
  const GRID_SPACING  = 30;    
  const DOT_RADIUS    = 2.5;     
  const MOUSE_RADIUS  = 150;   
  const MAX_PUSH      = 60;    
  const RETURN_SPEED  = 0.05; 
  const PUSH_SPEED    = 0.2;  
  const FADE_SPEED    = 0.15;  
  const BASE_OPACITY  = 0.0;  // Hidden by default, only visible near mouse
  const MAX_OPACITY   = 1.0;   
  const GLOW_BLUR     = 15;    
  const COLOR         = '#e7f702';
  
  // Ripple Config (Water drop effect)
  const RIPPLE_SPEED  = 9.5;   // 40% slower
  const RIPPLE_WIDTH  = 80;
  const RIPPLE_FORCE  = 120; // Gentler push
  // ───────────────────────────────────────────────────────────────

  let dots = [];
  let ripples = [];

  function buildGrid() {
    dots = [];
    const cols = Math.ceil(W / GRID_SPACING) + 1;
    const rows = Math.ceil(H / GRID_SPACING) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const offsetX = (r % 2) * (GRID_SPACING / 2);
        dots.push({
          hx: c * GRID_SPACING + offsetX,
          hy: r * GRID_SPACING,
          x:  c * GRID_SPACING + offsetX,
          y:  r * GRID_SPACING,
          alpha: BASE_OPACITY
        });
      }
    }
  }

  buildGrid();

  let mx = -9999, my = -9999;

  window.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
  window.addEventListener('pointerleave', () => { mx = -9999; my = -9999; });
  window.addEventListener('click', e => {
    ripples.push({ x: e.clientX, y: e.clientY, radius: 0, life: 1 });
  });
  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    buildGrid();
  });

  // ─── LOOP ──────────────────────────────────────────────────────
  function tick() {
    ctx.clearRect(0, 0, W, H);

    // Update ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      let r = ripples[i];
      r.radius += RIPPLE_SPEED;
      r.life = 1 - (r.radius / MOUSE_RADIUS); // Fades out exactly at the edge of the visible dot area
      if (r.life <= 0) ripples.splice(i, 1);
    }

    // Draw the actual water wave rings! (Clear liquid glass effect)
    for (const r of ripples) {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${r.life * 0.4})`; // Transparent white liquid
      ctx.lineWidth = 4 * r.life; // Thinner
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${r.life * 0.15})`;
      ctx.lineWidth = 2 * r.life;
      ctx.stroke();
    }

    // Oily glow effect
    ctx.shadowColor  = COLOR;
    ctx.shadowBlur   = GLOW_BLUR;
    ctx.fillStyle    = COLOR;

    for (const d of dots) {
      // Mouse interaction
      const dx   = d.hx - mx;
      const dy   = d.hy - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const inZone = dist < MOUSE_RADIUS;

      let targetAlpha = 0;
      let tx = d.hx, ty = d.hy;

      if (inZone) {
        targetAlpha = MAX_OPACITY * (1 - dist / MOUSE_RADIUS);
        if (dist > 0) {
          const push = MAX_PUSH * (1 - dist / MOUSE_RADIUS);
          tx += (dx / dist) * push;
          ty += (dy / dist) * push;
        }
      }

      // Ripple interaction (liquid water shockwave)
      for (const r of ripples) {
        const rdx = d.hx - r.x;
        const rdy = d.hy - r.y;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        const diff = Math.abs(rdist - r.radius);
        
        if (diff < RIPPLE_WIDTH) {
          const force = RIPPLE_FORCE * (1 - diff / RIPPLE_WIDTH) * r.life;
          if (rdist > 0) {
            tx += (rdx / rdist) * force;
            ty += (rdy / rdist) * force;
          }
          targetAlpha = Math.max(targetAlpha, MAX_OPACITY * r.life);
        }
      }

      d.alpha += (targetAlpha - d.alpha) * FADE_SPEED;
      d.x += (tx - d.x) * (inZone || ripples.length > 0 ? PUSH_SPEED : RETURN_SPEED);
      d.y += (ty - d.y) * (inZone || ripples.length > 0 ? PUSH_SPEED : RETURN_SPEED);

      if (d.alpha > 0.01) {
        ctx.globalAlpha = d.alpha;
        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
    requestAnimationFrame(tick);
  }

  tick();
}
