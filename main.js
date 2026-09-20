// Scroll reveal
    const obs = new IntersectionObserver(els => els.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    // Nav scroll
    window.addEventListener('scroll', () => document.getElementById('nav').classList.toggle('scrolled', scrollY > 60));

    // Counter animation
    function animCount(el, target, suffix = '') {
      let start = 0, dur = 2000, step = dur / 60;
      const inc = target / (dur / step);
      const timer = setInterval(() => {
        start += inc;
        if (start >= target) { start = target; clearInterval(timer); }
        if (target >= 1000000) el.textContent = (start / 1000000).toFixed(0) + 'M+';
        else if (target >= 1000) el.textContent = (start / 1000).toFixed(0) + 'K+';
        else el.textContent = Math.floor(start) + (suffix ? suffix : '+');
      }, step);
    }
    const cobs = new IntersectionObserver(els => els.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = 1;
        animCount(e.target, +e.target.dataset.count);
      }
    }), { threshold: .5 });
    document.querySelectorAll('[data-count]').forEach(el => cobs.observe(el));

    // Hamburger menu
    const hams = document.querySelectorAll('.ham');
    const mobMenu = document.getElementById('mobMenu');
    const mobClose = document.getElementById('mobClose');

    function closeMenu() {
      hams.forEach(h => h.classList.remove('open'));
      if (mobMenu) mobMenu.classList.remove('open');
      document.body.style.overflow = '';
    }

    hams.forEach(h => {
      h.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobMenu.classList.toggle('open');
        hams.forEach(el => el.classList.toggle('open', isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    });

    if (mobClose) mobClose.addEventListener('click', closeMenu);

    document.querySelectorAll('.mob-link').forEach(a => {
      a.addEventListener('click', closeMenu);
    });

    // Live Users Feed Logic
    const feedList = document.getElementById('feedList');
    if (feedList) {
      const allBuyers = [
        { name: 'Ali Hassan', product: 'sent a 5,000 Contacts Broadcast', time: 'just now' },
        { name: 'Sarah Khan', product: 'connected WhatsApp Business API', time: '1m ago' },
        { name: 'Usman Raza', product: 'upgraded to Enterprise Plan', time: '2m ago' },
        { name: 'Fatima Noor', product: 'deployed an AI Support Chatbot', time: '3m ago' },
        { name: 'Hamza Malik', product: 'imported 10k contacts', time: '5m ago' },
        { name: 'Ayesha Tariq', product: 'sent a promotional campaign', time: '8m ago' },
        { name: 'Bilal Ahmed', product: 'automated WhatsApp replies', time: '10m ago' },
        { name: 'Zara Sheikh', product: 'connected Shopify integration', time: '12m ago' },
        { name: 'Omar Farooq', product: 'created a drip campaign', time: '15m ago' },
        { name: 'Hina Butt', product: 'added 3 new team members', time: '18m ago' }
      ];

      const colors = [
        'linear-gradient(135deg, #8b5cf6, #a855f7)',
        'linear-gradient(135deg, #16a34a, #059669)',
        'linear-gradient(135deg, #f59e0b, #d97706)',
        'linear-gradient(135deg, #3b82f6, #2563eb)',
        'linear-gradient(135deg, #ec4899, #db2777)',
        'linear-gradient(135deg, #06b6d4, #0891b2)'
      ];

      // Shuffle array
      const shuffled = [...allBuyers].sort(() => 0.5 - Math.random());

      function createFeedItemHtml(buyer) {
        const initialColor = colors[Math.floor(Math.random() * colors.length)];
        return `
          <div class="feed-item">
            <div class="f-av" style="background: ${initialColor}; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
              <span>${buyer.name.charAt(0)}</span>
            </div>
            <div class="f-info">
              <div class="f-name">${buyer.name}</div>
              <div class="f-act">${buyer.product}</div>
            </div>
            <div class="f-time" style="flex-shrink: 0;">${buyer.time}</div>
          </div>
        `;
      }

      // Initial render (4 items)
      let htmlContent = '';
      for (let i = 0; i < 4; i++) {
        htmlContent += createFeedItemHtml(shuffled[i]);
      }
      feedList.innerHTML = htmlContent;

      let currentIndex = 4;
      let isHovered = false;

      feedList.addEventListener('mouseenter', () => isHovered = true);
      feedList.addEventListener('mouseleave', () => isHovered = false);

      // 2-second step-by-step scroll
      setInterval(() => {
        if (isHovered) return;

        const buyer = shuffled[currentIndex % shuffled.length];
        currentIndex++;

        feedList.insertAdjacentHTML('beforeend', createFeedItemHtml(buyer));

        const firstChild = feedList.firstElementChild;
        // Calculate offset to slide up (height + gap of 0.8rem ~ 13px)
        const offset = firstChild.offsetHeight + 13;

        feedList.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        feedList.style.transform = `translateY(-${offset}px)`;

        setTimeout(() => {
          feedList.style.transition = 'none';
          feedList.style.transform = 'translateY(0)';
          feedList.removeChild(firstChild);
        }, 500);
      }, 2000);
    }

    // Product Showcase Tabs Switcher
    const tabButtons = document.querySelectorAll('.showcase-tab-btn');
    const tabPanes = document.querySelectorAll('.showcase-content-pane');
    const windowUrl = document.getElementById('window-url');

    const tabUrls = {
      'tab-dashboard': 'https://user.instantflow.online/dashboard/analytics',
      'tab-inbox': 'https://user.instantflow.online/inbox/live-chats',
      'tab-automation': 'https://user.instantflow.online/chatbot/workflows',
      'tab-settings': 'https://user.instantflow.online/settings/meta-cloud-api'
    };

    if (tabButtons.length > 0) {
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTab = btn.getAttribute('data-tab');

          tabButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          tabPanes.forEach(pane => pane.classList.remove('active'));

          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');

          const activePane = document.getElementById(targetTab);
          if (activePane) activePane.classList.add('active');

          if (windowUrl && tabUrls[targetTab]) {
            windowUrl.textContent = tabUrls[targetTab];
          }
        });
      });
    }

    // ==========================================================================
    // ENTERPRISE CAPTCHA VERIFICATION GATE FOR LEAD FORM
    // ==========================================================================
    let pendingLeadPayload = null;
    let isCaptchaVerifying = false;

    function initCaptchaModal() {
      const overlay = document.getElementById('captchaOverlay');
      const closeBtn = document.getElementById('captchaCloseBtn');
      const widgetBox = document.getElementById('captchaWidgetBox');
      const statusNote = document.getElementById('captchaStatusNote');
      const label = document.getElementById('captchaLabel');

      if (!overlay || !widgetBox) return;

      function resetCaptcha() {
        isCaptchaVerifying = false;
        widgetBox.classList.remove('verifying', 'verified');
        if (label) label.textContent = 'I am human';
        if (statusNote) {
          statusNote.textContent = 'Click the box to verify and connect.';
          statusNote.style.color = '#64748b';
        }
      }

      function openCaptcha(payload) {
        pendingLeadPayload = payload;
        resetCaptcha();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      function closeCaptcha() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        resetCaptcha();
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', closeCaptcha);
      }

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeCaptcha();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
          closeCaptcha();
        }
      });

      function triggerVerification() {
        if (isCaptchaVerifying || widgetBox.classList.contains('verified')) return;
        isCaptchaVerifying = true;
        widgetBox.classList.add('verifying');
        if (label) label.textContent = 'Verifying security...';
        if (statusNote) {
          statusNote.textContent = 'Checking cryptographic integrity...';
          statusNote.style.color = 'var(--y, #e7f702)';
        }

        setTimeout(() => {
          widgetBox.classList.remove('verifying');
          widgetBox.classList.add('verified');
          if (label) label.textContent = 'Verification successful';
          if (statusNote) {
            statusNote.textContent = 'Verified! Routing to WhatsApp...';
            statusNote.style.color = '#22c55e';
          }

          setTimeout(() => {
            closeCaptcha();
            if (pendingLeadPayload) {
              const encodedMessage = encodeURIComponent(pendingLeadPayload);
              const targetUrl = `https://wa.me/923184780005?text=${encodedMessage}`;
              window.open(targetUrl, '_blank', 'noopener,noreferrer');
              
              const leadForm = document.getElementById('leadForm');
              if (leadForm) leadForm.reset();
              pendingLeadPayload = null;
            }
          }, 700);
        }, 1100);
      }

      widgetBox.addEventListener('click', triggerVerification);
      widgetBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerVerification();
        }
      });

      window.openLeadCaptcha = openCaptcha;
    }

    // Enterprise Consultation Lead Form Submission
    function handleLeadSubmit(event) {
      event.preventDefault();
      const name = document.getElementById('leadName')?.value.trim() || '';
      const company = document.getElementById('leadCompany')?.value.trim() || '';
      const phone = document.getElementById('leadPhone')?.value.trim() || '';
      const volume = document.getElementById('leadVolume')?.value || '';
      const notes = document.getElementById('leadNotes')?.value.trim() || 'N/A';

      const message = `Hello InstantFlow Team, I would like to request an Enterprise Consultation and Demo.\n\n*Name:* ${name}\n*Company:* ${company}\n*WhatsApp:* ${phone}\n*Monthly Volume:* ${volume}\n*Requirements:* ${notes}`;

      if (typeof window.openLeadCaptcha === 'function') {
        window.openLeadCaptcha(message);
      } else {
        const encodedMessage = encodeURIComponent(message);
        const targetUrl = `https://wa.me/923184780005?text=${encodedMessage}`;
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    }
    window.handleLeadSubmit = handleLeadSubmit;

    // ==========================================================================
    // ENTERPRISE COOKIE CONSENT BANNER LOGIC
    // ==========================================================================
    function initCookieConsent() {
      const consent = localStorage.getItem('instantflow_cookie_consent');
      if (consent) return;

      let cookieBanner = document.getElementById('cookieBanner');
      if (!cookieBanner) {
        cookieBanner = document.createElement('aside');
        cookieBanner.id = 'cookieBanner';
        cookieBanner.className = 'cookie-banner';
        cookieBanner.setAttribute('role', 'dialog');
        cookieBanner.setAttribute('aria-label', 'Cookie Preferences');
        cookieBanner.innerHTML = `
          <div class="cookie-head">
            <span class="cookie-icon" aria-hidden="true">🍪</span>
            <h3 class="cookie-title">Cookie Preferences</h3>
          </div>
          <p class="cookie-text">
            We use strictly necessary cookies to ensure secure sessions and analytics to optimize your experience. Read our <a href="/privacy-policy">Privacy Policy</a>.
          </p>
          <div class="cookie-actions">
            <button type="button" class="cookie-btn-accept" id="cookieAcceptBtn">Accept All</button>
            <button type="button" class="cookie-btn-decline" id="cookieDeclineBtn">Essential Only</button>
          </div>
        `;
        document.body.appendChild(cookieBanner);
      }

      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1200);

      const acceptBtn = document.getElementById('cookieAcceptBtn');
      const declineBtn = document.getElementById('cookieDeclineBtn');

      if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
          localStorage.setItem('instantflow_cookie_consent', 'accepted');
          cookieBanner.classList.remove('show');
        });
      }

      if (declineBtn) {
        declineBtn.addEventListener('click', () => {
          localStorage.setItem('instantflow_cookie_consent', 'essential');
          cookieBanner.classList.remove('show');
        });
      }
    }

    // Initialize interactive modules safely
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initCookieConsent();
        initCaptchaModal();
      });
    } else {
      initCookieConsent();
      initCaptchaModal();
    }