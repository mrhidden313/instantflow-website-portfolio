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
    const ham = document.getElementById('ham');
    const mobMenu = document.getElementById('mobMenu');
    const mobClose = document.getElementById('mobClose');

    function closeMenu() {
      ham.classList.remove('open');
      mobMenu.classList.remove('open');
      document.body.style.overflow = '';
    }

    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mobMenu.classList.toggle('open');
      document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
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
        const logoNum = Math.floor(Math.random() * 67) + 1;
        const avatarUrl = `assets/logos/${logoNum}.png`;
        const initialColor = colors[Math.floor(Math.random() * colors.length)];
        return `
          <div class="feed-item">
            <div class="f-av" style="background: ${initialColor}; position: relative; overflow: hidden; flex-shrink: 0;">
              <span style="position: relative; z-index: 1;">${buyer.name.charAt(0)}</span>
              <img src="${avatarUrl}" alt="${buyer.name}" style="position: absolute; top: 0; left: 0; z-index: 2; width: 100%; height: 100%; object-fit: cover; background: #fff;" onerror="this.style.display='none';" />
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