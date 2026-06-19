// outcrowd.js — InstantFlow Cinematic Zoom & Liquid Loading
// Cinematic Zoom-In Float · Auto Scroll · Zoom-Out Merge · Liquid Loading
// Desktop ONLY (window.innerWidth > 768)

document.addEventListener("DOMContentLoaded", () => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ═══════════════════════════════════════════════════════════════
    // 1. LENIS — Butter-smooth scroll
    // ═══════════════════════════════════════════════════════════════
    window._lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        infinite: false,
    });

    const lenis = window._lenis;
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0, 0);

    // ═══════════════════════════════════════════════════════════════
    // 2. 3D SCROLL PARALLAX — Objects move as you scroll
    // ═══════════════════════════════════════════════════════════════
    const parallaxTargets = [
        { selector: '.orb1', yFactor: -0.08, xFactor: 0.03 },
        { selector: '.orb2', yFactor: 0.06, xFactor: -0.04 },
        { selector: '.hero-badge', yFactor: -0.04, scale: true },
        { selector: 'h1', yFactor: -0.03 },
        { selector: '.hero p', yFactor: -0.02 },
        { selector: '.fc', yFactor: 0.03, stagger: 0.015 },
        { selector: '.bc', yFactor: 0.04, stagger: 0.015 },
        { selector: '.pc', yFactor: 0.035, stagger: 0.02 },
        { selector: '.stit', yFactor: -0.025 },
        { selector: '.ssub', yFactor: -0.015 },
    ];

    parallaxTargets.forEach(t => {
        gsap.utils.toArray(t.selector).forEach((el, i) => {
            gsap.to(el, {
                y: () => (window.innerHeight) * t.yFactor,
                x: () => t.xFactor ? (window.innerWidth) * t.xFactor : 0,
                scale: t.scale ? 1.08 : 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2,
                }
            });
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // 3. SCROLL-TRIGGERED REVEAL ANIMATIONS
    // ═══════════════════════════════════════════════════════════════
    gsap.utils.toArray('.fc, .bc, .step, .pc').forEach((el, i) => {
        gsap.fromTo(el,
            { y: 70, opacity: 0, rotateX: 10, scale: 0.96 },
            {
                y: 0, opacity: 1, rotateX: 0, scale: 1,
                duration: 0.85,
                delay: (i % 4) * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse',
                }
            }
        );
    });

    gsap.utils.toArray('h2.stit, .ssub, .stag').forEach((el, i) => {
        gsap.fromTo(el,
            { y: 35, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 0.9,
                delay: i * 0.08,
                ease: 'power4.out',
                scrollTrigger: { trigger: el, start: 'top 90%' }
            }
        );
    });

    gsap.utils.toArray('.stat').forEach((el, i) => {
        gsap.fromTo(el,
            { y: 40, opacity: 0, scale: 0.9 },
            {
                y: 0, opacity: 1, scale: 1,
                duration: 0.7,
                delay: i * 0.12,
                ease: 'back.out(1.4)',
                scrollTrigger: { trigger: el, start: 'top 92%' }
            }
        );
    });

    // ═══════════════════════════════════════════════════════════════
    // 3.5 3D CARD TILT ON HOVER (Kept because you liked it before)
    // ═══════════════════════════════════════════════════════════════
    document.addEventListener('mousemove', (e) => {
        document.querySelectorAll('.fc, .bc, .stat, .step, .pc').forEach(card => {
            const r = card.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = (e.clientX - cx) / (r.width / 2);
            const dy = (e.clientY - cy) / (r.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 1.4) {
                gsap.to(card, {
                    rotateX: -dy * 7,
                    rotateY: dx * 7,
                    scale: 1.025,
                    duration: 0.35,
                    ease: 'power2.out',
                    transformPerspective: 900,
                    transformOrigin: 'center center',
                });
            } else {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                });
            }
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // 4. MAGNETIC BUTTONS
    // ═══════════════════════════════════════════════════════════════
    document.querySelectorAll('.btn-y, .btn-g, .nav-cta').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // 5. CINEMATIC ZOOM-IN SCROLLING DOWNLOAD SEQUENCE
    // ═══════════════════════════════════════════════════════════════
    initCinematicDownload();
});

function initCinematicDownload() {
    const heroBtn = document.querySelector('.hero-btns .btn-g');
    const ctaBtn = document.getElementById('cta-download-btn');

    if (!heroBtn || !ctaBtn) return;

    let activated = false;

    heroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (activated) return;
        activated = true;

        startCinematicSequence(heroBtn, ctaBtn);
    });
}

function startCinematicSequence(heroBtn, ctaBtn) {
    const fromRect = heroBtn.getBoundingClientRect();
    const btnW = fromRect.width;
    const btnH = fromRect.height;

    // ── Create fake floating button
    const fakeBtn = document.createElement('div');
    fakeBtn.className = heroBtn.className;

    // Wrap text in a span so we can scale it smoothly instead of animating font-size
    const textSpan = document.createElement('span');
    textSpan.innerHTML = heroBtn.innerHTML;
    Object.assign(textSpan.style, {
        display: 'inline-block',
        willChange: 'transform',
        transformOrigin: 'center',
        whiteSpace: 'nowrap'
    });

    fakeBtn.innerHTML = '';
    fakeBtn.appendChild(textSpan);

    Object.assign(fakeBtn.style, {
        position: 'fixed',
        boxSizing: 'border-box',
        width: btnW + 'px',
        height: btnH + 'px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: fromRect.top + 'px',
        left: fromRect.left + 'px',
        margin: '0',
        zIndex: '9999',
        pointerEvents: 'none',
        borderRadius: '16px',
        boxShadow: '0 0 30px rgba(231,247,2,0.6), inset 2px 2px 5px rgba(231,247,2,0.8)',
        transition: 'none', // CRITICAL FIX: prevents CSS from fighting GSAP
        // GPU Acceleration flags
        willChange: 'width, height, left, top',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
    });
    document.body.appendChild(fakeBtn);

    // Hide original
    heroBtn.style.visibility = 'hidden';

    // Target large size (ZOOM IN) - Responsive for mobile
    const isMobile = window.innerWidth <= 768;
    const clientWidth = document.documentElement.clientWidth || window.innerWidth;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const largeWidth = isMobile ? clientWidth * 0.9 : clientWidth * 0.6;
    const largeHeight = isMobile ? 80 : 96;
    const centerX = (clientWidth - largeWidth) / 2;
    const centerY = (clientHeight - largeHeight) / 2;

    const tl = gsap.timeline();

    // ── STEP 1: ZOOM IN (GROW LARGE AND CENTER ON SCREEN)
    // Using left/top guarantees perfectly accurate centering without math errors
    tl.to(fakeBtn, {
        left: centerX + 'px',
        top: centerY + 'px',
        width: largeWidth + 'px',
        height: largeHeight + 'px',
        borderRadius: '24px',
        duration: 1.2,
        ease: 'power3.inOut',
    }, 'zoomIn');

    tl.to(textSpan, {
        scale: 1.5,
        duration: 1.2,
        ease: 'power3.inOut',
    }, 'zoomIn');

    // ── STEP 2: HOLD LARGE AND AUTO-SCROLL DOWN
    tl.to(fakeBtn, {
        duration: 3.5, // Hold its position in the center while scrolling
        onStart: () => {
            window._lenis?.scrollTo(ctaBtn, { offset: -150, duration: 3.5 });
        }
    });

    // ── STEP 3: ZOOM OUT (SHRINK AND TOUCH BOTTOM BUTTON)
    tl.to(fakeBtn, {
        duration: 1.0,
        ease: 'power3.inOut',
        onStart: () => {
            const targetRect = ctaBtn.getBoundingClientRect();
            // Using left/top exactly locks onto the CTA button
            gsap.to(fakeBtn, {
                left: targetRect.left + 'px',
                top: targetRect.top + 'px',
                width: targetRect.width + 'px',
                height: targetRect.height + 'px',
                borderRadius: '16px',
                duration: 1.0,
                ease: 'power3.inOut'
            });
            gsap.to(textSpan, {
                scale: 1.0,
                duration: 1.0,
                ease: 'power3.inOut'
            });
        },
        onComplete: () => {
            gsap.to(fakeBtn, { boxShadow: '0 0 80px rgba(231,247,2,1)', duration: 0.15, yoyo: true, repeat: 1 });
        }
    });

    // ── STEP 4: GROW BACK INTO LIQUID LOADING BAR
    tl.to(fakeBtn, {
        duration: 0.8,
        delay: 0.1, // Tiny pause after touching
        ease: 'power3.inOut',
        onStart: () => {
            const targetRect = ctaBtn.getBoundingClientRect();
            const vw70 = isMobile ? window.innerWidth * 0.9 : window.innerWidth * 0.7;
            const newX = (window.innerWidth - vw70) / 2;
            const finalHeight = isMobile ? Math.max(targetRect.height, 80) : Math.max(targetRect.height, 96);

            gsap.to(textSpan, { opacity: 0, duration: 0.2 });

            gsap.to(fakeBtn, {
                left: newX + 'px',
                top: targetRect.top + 'px',
                width: vw70 + 'px',
                height: finalHeight + 'px',
                borderRadius: '22px',
                duration: 0.8,
                ease: 'power3.inOut',
                onComplete: () => {
                    startEpicLiquidDownload(fakeBtn, ctaBtn, heroBtn);
                }
            });
        }
    });
}


// ───────────────────────────────────────────────────────────────────
// FULL-BUTTON LIQUID WATER LOADING SEQUENCE
// ───────────────────────────────────────────────────────────────────
function startEpicLiquidDownload(fakeBtn, toBtn, fromBtn) {
    fakeBtn.innerHTML = '';
    Object.assign(fakeBtn.style, {
        overflow: 'hidden',
        background: '#000000',
        border: '3px solid #e7f702',
        boxShadow: '0 0 40px rgba(231,247,2,0.3), inset 0 0 20px rgba(0,85,255,0.4)',
        position: 'fixed', // ensure it acts as a positioning container for children
    });

    // Inject realistic liquid keyframes for the rushing front edge and top waves
    if (!document.getElementById('liquid-wave-styles')) {
        const style = document.createElement('style');
        style.id = 'liquid-wave-styles';
        style.innerHTML = `
            @keyframes liquidSpin {
                0% { transform: translateY(-50%) rotate(0deg); }
                100% { transform: translateY(-50%) rotate(360deg); }
            }
            @keyframes waveScrollX {
                0% { background-position-x: 0px; }
                100% { background-position-x: 1000px; }
            }
            @keyframes bubbleRiseBg {
                0% { background-position: 0 0, 0 0, 0 0, 0 0, 0 0; }
                100% { background-position: 0 -120px, 0 -160px, 0 -90px, 0 -180px, 0 0; }
            }
            .water-bg-realistic {
                position: absolute;
                top: 0; bottom: 0; left: 0;
                background-image: 
                    radial-gradient(circle at 20% 30%, rgba(100,255,255,0.7) 1px, transparent 2px),
                    radial-gradient(circle at 70% 60%, rgba(150,255,255,0.8) 1.5px, transparent 2.5px),
                    radial-gradient(circle at 40% 80%, rgba(200,255,255,0.6) 1px, transparent 2px),
                    radial-gradient(circle at 80% 20%, rgba(100,255,255,0.9) 2px, transparent 3px),
                    linear-gradient(180deg, #005ce6 5%, #001a4d 50%, #000511 100%);
                background-size: 120px 120px, 160px 160px, 90px 90px, 180px 180px, 100% 100%;
                animation: bubbleRiseBg 6s linear infinite;
            }
            .top-wave-1 {
                position: absolute;
                top: -5px; left: 0; right: 0; height: 50px;
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 60" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%2366ccff"/><stop offset="100%" stop-color="%23005ce6"/></linearGradient></defs><path d="M0,35 Q100,10 200,35 T400,35 T600,35 T800,35 L800,60 L0,60 Z" fill="url(%23g)"/><path d="M0,35 Q100,10 200,35 T400,35 T600,35 T800,35" fill="none" stroke="%23ffffff" stroke-width="2" opacity="0.8"/></svg>') repeat-x;
                background-size: 500px 100%;
                animation: waveScrollX 4s linear infinite;
                z-index: 2;
            }
            .top-wave-2 {
                position: absolute;
                top: 5px; left: 0; right: 0; height: 50px;
                background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 60" preserveAspectRatio="none"><path d="M0,45 Q100,60 200,45 T400,45 T600,45 T800,45 L800,60 L0,60 Z" fill="%23002277"/><path d="M0,45 Q100,60 200,45 T400,45 T600,45 T800,45" fill="none" stroke="%233399ff" stroke-width="1.5" opacity="0.6"/></svg>') repeat-x;
                background-size: 700px 100%;
                animation: waveScrollX 6s linear infinite reverse;
                z-index: 1;
            }
            .splash-front {
                position: absolute;
                top: 50%;
                width: 80px; height: 150%;
                transform: translate(-50%, -50%);
                z-index: 3;
            }
            .splash-front::after {
                content: '';
                position: absolute; inset: 0;
                background: linear-gradient(90deg, #0044cc, #00aaff);
                border-radius: 40%;
                animation: liquidSpin 1.5s linear infinite;
                box-shadow: 0 0 25px rgba(0, 150, 255, 0.8);
            }
            .splash-front::before {
                content: '';
                position: absolute; inset: -10px;
                background: rgba(0, 150, 255, 0.5);
                border-radius: 45%;
                animation: liquidSpin 2s linear infinite reverse;
            }
        `;
        document.head.appendChild(style);
    }

    // Determine target width to ensure the water background spans the whole width instantly
    const isMobile = window.innerWidth <= 768;
    const targetWidth = isMobile ? window.innerWidth * 0.9 : window.innerWidth * 0.7;

    // 1. Full-width realistic water container (static, but masked)
    const waterBg = document.createElement('div');
    waterBg.className = 'water-bg-realistic';
    Object.assign(waterBg.style, {
        width: targetWidth + 'px',
    });

    const topWave1 = document.createElement('div'); topWave1.className = 'top-wave-1';
    const topWave2 = document.createElement('div'); topWave2.className = 'top-wave-2';
    waterBg.appendChild(topWave2);
    waterBg.appendChild(topWave1);

    // 2. The Mask (Reveals the water left-to-right)
    const liquidMask = document.createElement('div');
    Object.assign(liquidMask.style, {
        position: 'absolute',
        top: '0', bottom: '0', left: '0',
        width: '0%', // Animates from 0% to 100%
        overflow: 'hidden', // Clips the waterBg perfectly
        zIndex: '1',
    });
    liquidMask.appendChild(waterBg);

    // 3. The Front Splashing Edge (Covers the straight line of the mask)
    const splashFront = document.createElement('div');
    splashFront.className = 'splash-front';
    splashFront.style.left = '0%'; // Animates alongside the mask

    fakeBtn.appendChild(liquidMask);
    fakeBtn.appendChild(splashFront);

    // 2. The Content Layer (Text goes above the liquid)
    const content = document.createElement('div');
    Object.assign(content.style, {
        position: 'absolute',
        inset: '0',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 12px' : '0 32px',
        zIndex: '2',
        fontFamily: 'Inter, sans-serif',
        boxSizing: 'border-box',
    });

    const svgSize = isMobile ? 24 : 42;
    const titleSize = isMobile ? '0.8rem' : '1.4rem';
    const subSize = isMobile ? '0.6rem' : '0.95rem';
    const pctSize = isMobile ? '1.2rem' : '2.2rem';

    content.innerHTML = `
        <div style="display:flex;align-items:center;gap:${isMobile ? '8px' : '16px'};">
            <svg viewBox="0 0 24 24" width="${svgSize}" height="${svgSize}" fill="#e7f702" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); flex-shrink: 0;">
                <path d="M17.6 9.48l1.84-3.18a.33.33 0 0 0-.12-.46.33.33 0 0 0-.45.12l-1.87 3.23a11.16 11.16 0 0 0-10 0L5.13 5.96a.33.33 0 0 0-.45-.12.33.33 0 0 0-.12.46l1.84 3.18C3.12 11.16 1 14.33 1 18h22c0-3.67-2.12-6.84-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
            </svg>
            <div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px;">
                <span style="color:#e7f702;font-size:${titleSize};font-weight:800;text-shadow: 0 2px 4px rgba(0,0,0,0.8); white-space: nowrap;">InstantFlow.apk</span>
                <span style="color:#ffffff;font-size:${subSize};font-weight:600;text-shadow: 0 1px 3px rgba(0,0,0,0.8); white-space: nowrap;">88.3 MB</span>
            </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">
            <div id="dl-pct" style="color:#e7f702;font-size:${pctSize};font-weight:800;line-height:1;text-shadow: 0 2px 4px rgba(0,0,0,0.8);">0%</div>
            <div id="dl-spd" style="color:#ffffff;font-size:${subSize};font-weight:600;text-shadow: 0 1px 3px rgba(0,0,0,0.8); white-space: nowrap;">─</div>
        </div>
    `;
    fakeBtn.appendChild(content);

    const pctSpan = content.querySelector('#dl-pct');
    const spdSpan = content.querySelector('#dl-spd');

    // Animate Progress
    const speeds = ['1.2 MB/s', '2.5 MB/s', '4.0 MB/s', '1.8 MB/s', '4.8 MB/s', '3.1 MB/s'];
    let si = 0;
    const speedInt = setInterval(() => {
        si = (si + 1) % speeds.length;
        spdSpan.textContent = speeds[si];
    }, 700);

    gsap.to({}, {
        duration: 3.8, // 3.8 seconds to download
        ease: 'power2.inOut',
        onUpdate: function () {
            const p = Math.round(this.progress() * 100);
            liquidMask.style.width = p + '%';
            splashFront.style.left = p + '%';
            pctSpan.textContent = p + '%';
        },
        onComplete: () => {
            clearInterval(speedInt);
            pctSpan.textContent = '100%';
            spdSpan.textContent = '✓ Complete';
            liquidMask.style.width = '100%';

            // Remove the splashing blobs and mask clip when complete
            splashFront.style.display = 'none';
            topWave1.style.display = 'none';
            topWave2.style.display = 'none';

            // Celebration flash
            gsap.to(fakeBtn, {
                boxShadow: '0 0 80px rgba(231,247,2,1), 0 0 120px rgba(0,85,255,0.6)',
                duration: 0.2,
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    // Trigger Actual Download
                    const a = document.createElement('a');
                    a.href = 'app-release.apk';
                    a.download = 'InstantFlow.apk';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    // Proceed to merge
                    setTimeout(() => mergeToCTA(fakeBtn, toBtn, fromBtn), 500);
                }
            });
        }
    });
}


// ───────────────────────────────────────────────────────────────────
// PHASE 4: MERGE DOWNLOAD BAR INTO ORIGINAL CTA BUTTON
// ───────────────────────────────────────────────────────────────────
function mergeToCTA(fakeBtn, toBtn, fromBtn) {
    const targetRect = toBtn.getBoundingClientRect();
    const tw = targetRect.width;
    const th = targetRect.height;

    // 3D flip + shrink into final position
    gsap.timeline()
        .to(fakeBtn, {
            rotateY: 45,
            scale: 0.8,
            opacity: 0.6,
            duration: 0.35,
            ease: 'power3.in',
        })
        .to(fakeBtn, {
            left: targetRect.left + 'px',
            top: targetRect.top + 'px',
            width: tw + 'px',
            height: th + 'px',
            rotateY: 0,
            scale: 1,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
            onComplete: () => {
                fakeBtn.innerHTML = '✅ Downloaded!';
                Object.assign(fakeBtn.style, {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(231,247,2,0.98), rgba(200,213,2,0.88))',
                    color: '#000',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '800',
                    fontSize: '1rem',
                    border: '1px solid rgba(231,247,2,0.6)',
                    boxShadow: '0 0 30px rgba(231,247,2,0.4)',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    flexDirection: 'row',
                });

                fakeBtn.addEventListener('click', () => {
                    const a = document.createElement('a');
                    a.href = 'app-release.apk';
                    a.download = 'InstantFlow.apk';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });

                gsap.fromTo(fakeBtn,
                    { scale: 1.15 },
                    { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' }
                );

                fromBtn.innerHTML = '✅ Downloaded!';
                fromBtn.style.visibility = 'visible';

                // Destroy fakeBtn after 2.5 seconds with a thick smoke/soil explosion
                setTimeout(() => {
                    const currentRect = fakeBtn.getBoundingClientRect();
                    const scrollY = window.scrollY || document.documentElement.scrollTop;
                    const scrollX = window.scrollX || document.documentElement.scrollLeft;

                    // Hide the button instantly so it looks like it turned into smoke
                    fakeBtn.style.visibility = 'hidden';

                    // Create 18 thick smoke puffs (reduced by 40%)
                    for (let i = 0; i < 18; i++) {
                        const smoke = document.createElement('div');
                        smoke.style.position = 'absolute';

                        // Large base size for thick smoke
                        const size = Math.random() * 40 + 30;
                        smoke.style.width = size + 'px';
                        smoke.style.height = size + 'px';

                        // Smoke colors: Yellow/Golden colors
                        const colors = ['#e7f702', '#c8d502', '#ffff00', '#d4df00', '#f9ff42'];
                        smoke.style.background = colors[Math.floor(Math.random() * colors.length)];

                        smoke.style.borderRadius = '50%';
                        smoke.style.left = (scrollX + currentRect.left + (Math.random() * currentRect.width) - size / 2) + 'px';
                        smoke.style.top = (scrollY + currentRect.top + (Math.random() * currentRect.height) - size / 2) + 'px';
                        smoke.style.pointerEvents = 'none';
                        smoke.style.zIndex = '999999';

                        // Blur to make it look like gas/smoke rather than solid circles
                        smoke.style.filter = 'blur(' + (Math.random() * 10 + 5) + 'px)';
                        smoke.style.opacity = '0.9';

                        document.body.appendChild(smoke);

                        // Animate them expanding and rolling upwards
                        gsap.to(smoke, {
                            x: (Math.random() - 0.5) * 150, // spread horizontally
                            y: -150 - Math.random() * 250,  // fly upwards like smoke
                            scale: 2 + Math.random() * 3,   // expand massively
                            opacity: 0,                     // fade out
                            rotation: (Math.random() - 0.5) * 180, // roll slightly
                            duration: 4 + Math.random() * 2, // Slowed down speed
                            ease: 'power1.out',
                            onComplete: () => smoke.remove()
                        });
                    }

                    // Remove fakeBtn completely from DOM after smoke clears
                    setTimeout(() => {
                        fakeBtn.remove();
                    }, 4000);
                }, 800);
            }
        });
}
