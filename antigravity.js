console.log('Antigravity script loaded (CSS Houdini Version from Bramus)');

export function initAntigravity(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear existing content (like old Three.js canvases)
  container.innerHTML = '';

  // Check if browser supports CSS Paint API
  if (!('paintWorklet' in CSS)) {
    console.warn('CSS Paint API not supported in this browser. The Houdini effect cannot be displayed.');
    return;
  }

  // Load the Houdini Worklet used in the CodePen
  CSS.paintWorklet.addModule('https://unpkg.com/css-houdini-ringparticles/dist/ringparticles.js');

  // Inject the required CSS properties and keyframes dynamically
  const style = document.createElement('style');
  style.innerHTML = `
    @property --ring-x { syntax: '<number>'; inherits: false; initial-value: 50; }
    @property --ring-y { syntax: '<number>'; inherits: false; initial-value: 50; }
    @property --ring-interactive { syntax: '<number>'; inherits: false; initial-value: 0; }
    @property --animation-tick { syntax: '<number>'; inherits: false; initial-value: 0; }
    @property --ring-radius { syntax: '<number> | auto'; inherits: false; initial-value: auto; }

    @keyframes ripple { 
      0% { --animation-tick: 0; } 
      100% { --animation-tick: 1; } 
    }
    @keyframes ring-pulse { 
      0% { --ring-radius: 5; } 
      100% { --ring-radius: 25; } 
    }

    #${containerId} {
      /* Houdini Configuration */
      --ring-radius: 15;
      --ring-thickness: 600;
      --particle-count: 150;
      --particle-rows: 40;
      --particle-size: 2;
      --particle-color: #e7f702; /* InstantFlow Yellow */
      --particle-min-alpha: 0.1;
      --particle-max-alpha: 1.0;
      --seed: 200;

      background-image: paint(ring-particles);
      animation: ripple 6s linear infinite, ring-pulse 6s ease-in-out infinite alternate;
      transition: --ring-x 1s ease-out, --ring-y 1s ease-out, --ring-interactive 0.5s;
      
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: -1;
    }
  `;
  document.head.appendChild(style);

  let isInteractive = false;
  
  // Track mouse movement across the whole window
  window.addEventListener('pointermove', (e) => {
    if (!isInteractive) {
      isInteractive = true;
      container.style.setProperty('--ring-interactive', 1);
    }
    // Calculate percentage position
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    container.style.setProperty('--ring-x', x);
    container.style.setProperty('--ring-y', y);
  });

  window.addEventListener('pointerleave', () => {
    isInteractive = false;
    container.style.setProperty('--ring-interactive', 0);
    // Float back to center when mouse leaves
    container.style.setProperty('--ring-x', 50);
    container.style.setProperty('--ring-y', 50);
  });
}
