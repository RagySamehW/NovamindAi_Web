/* ─────────────────────────────────────────
   Nova Mind — Creative Effects
   ───────────────────────────────────────── */
'use strict';

/* ── THEME TOGGLE ── */
(function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    btn.textContent = t === 'dark' ? '☀' : '☾';
    btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  applyTheme(localStorage.getItem('nm-theme') || 'dark');

  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('nm-theme', next);
    applyTheme(next);
  });
})();

/* ── CURSOR TRAIL ── */
(function initCursorTrail() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const N = 12;
  const dots = Array.from({ length: N }, () => {
    const d = document.createElement('div');
    d.className = 'trail-dot';
    document.body.appendChild(d);
    return d;
  });
  const pos = Array.from({ length: N }, () => ({ x: -200, y: -200 }));
  let mx = -200, my = -200;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function tick() {
    pos[0].x += (mx - pos[0].x) * 0.28;
    pos[0].y += (my - pos[0].y) * 0.28;
    for (let i = 1; i < N; i++) {
      pos[i].x += (pos[i - 1].x - pos[i].x) * 0.28;
      pos[i].y += (pos[i - 1].y - pos[i].y) * 0.28;
    }
    dots.forEach((d, i) => {
      const t = 1 - i / N;
      const sz = Math.max(1, t * 8);
      d.style.left    = pos[i].x + 'px';
      d.style.top     = pos[i].y + 'px';
      d.style.opacity = t * 0.45;
      d.style.width   = sz + 'px';
      d.style.height  = sz + 'px';
    });
    requestAnimationFrame(tick);
  })();
})();

/* ── TEXT SCRAMBLE (hero subtitle) ── */
(function initScramble() {
  const el = document.querySelector('.hero-sub');
  if (!el) return;
  const original = el.textContent.replace(/\s+/g, ' ').trim();
  const chars = '!@#$%ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let started = false;

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || started) return;
    started = true;
    obs.disconnect();

    // Brief delay so it runs after preloader exits
    setTimeout(() => {
      let frame = 0;
      const TOTAL = 55;
      const id = setInterval(() => {
        el.textContent = original.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          const revealAt = (i / original.length) * TOTAL * 0.55;
          return frame > revealAt + 8
            ? ch
            : chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        if (++frame > TOTAL + 12) { clearInterval(id); el.textContent = original; }
      }, 22);
    }, 600);
  }, { threshold: 0.5 });

  obs.observe(el);
})();

/* ── 3D CARD TILT ── */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const sel = '.wc, .team-card, .test-card, .srv-card, .af-item, .scenario-card, .av-main, .booking-card';

  document.querySelectorAll(sel).forEach(card => {
    const shine = document.createElement('div');
    shine.className = 'tilt-shine';
    card.appendChild(shine);

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.12s ease, box-shadow 0.2s';
    });

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(6px)`;
      shine.style.background = `radial-gradient(circle at ${(x + .5) * 100}% ${(y + .5) * 100}%, rgba(255,255,255,0.07), transparent 65%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.7s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s';
      card.style.transform  = '';
      shine.style.background = '';
      setTimeout(() => { card.style.transition = ''; }, 700);
    });
  });
})();

/* ── MAGNETIC BUTTONS ── */
(function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.btn-glow, .btn-outline, .btn-submit, .nav-pill').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });

    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.3;
      const y = (e.clientY - r.top  - r.height / 2) * 0.3;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.65s cubic-bezier(0.23,1,0.32,1)';
      btn.style.transform  = '';
      setTimeout(() => { btn.style.transition = ''; }, 650);
    });
  });
})();

/* ── SECTION SPOTLIGHT ── */
(function initSpotlight() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('section').forEach(sec => {
    const sp = document.createElement('div');
    sp.className = 'sec-spotlight';
    sec.appendChild(sp);

    sec.addEventListener('mousemove', e => {
      const r = sec.getBoundingClientRect();
      sp.style.setProperty('--sx', `${e.clientX - r.left}px`);
      sp.style.setProperty('--sy', `${e.clientY - r.top}px`);
      sp.style.opacity = '1';
    });
    sec.addEventListener('mouseleave', () => { sp.style.opacity = '0'; });
  });
})();

/* ── PORTFOLIO HOVER OVERLAY ── */
(function initPortfolioOverlay() {
  document.querySelectorAll('.wc').forEach(card => {
    const thumb = card.querySelector('.wc-thumb');
    if (!thumb) return;
    const ov = document.createElement('div');
    ov.className = 'wc-overlay';
    ov.innerHTML = '<span class="wc-overlay-text">View Project ↗</span>';
    thumb.appendChild(ov);
  });
})();

/* ── STAGGERED CARD ENTRANCE ── */
(function initStagger() {
  [
    { sel: '.work-grid .wc',         delay: 80 },
    { sel: '.team-grid .team-card',  delay: 90 },
    { sel: '.test-grid .test-card',  delay: 100 },
    { sel: '.about-features .af-item', delay: 80 },
  ].forEach(({ sel, delay }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.transitionDelay = `${i * delay}ms`;
    });
  });
})();

/* ── SERVICE ITEM NUMBER GLOW ── */
(function initServiceGlow() {
  document.querySelectorAll('.srv-item').forEach(item => {
    const num = item.querySelector('.srv-num');
    if (!num) return;
    item.addEventListener('mouseenter', () => {
      num.style.color = 'var(--a1)';
      num.style.textShadow = '0 0 12px rgba(79,127,255,0.6)';
      num.style.transition = 'color 0.2s, text-shadow 0.2s';
    });
    item.addEventListener('mouseleave', () => {
      num.style.color = '';
      num.style.textShadow = '';
    });
  });
})();

/* ── TYPING ANIMATION ── */
(function initTyping() {
  const el     = document.querySelector('.typed-word');
  const cursor = document.querySelector('.typed-cursor');
  if (!el) return;
  const words = ['websites', 'mobile apps', 'AI systems', 'automation', 'e-commerce', 'custom software'];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; return setTimeout(tick, 1800); }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        return setTimeout(tick, 320);
      }
    }
    setTimeout(tick, deleting ? 55 : 95);
  }
  setTimeout(tick, 1400);
})();

/* ── PARALLAX DEPTH ── */
(function initParallax() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const layers = [
    { sel: '.hero-title',   speed: 0.11 },
    { sel: '.hero-sub',     speed: 0.17 },
    { sel: '.hero-actions', speed: 0.22 },
    { sel: '.stats-strip',  speed: 0.28 },
    { sel: '.hs1',          speed: -0.16 },
    { sel: '.hs2',          speed: -0.23 },
    { sel: '.hs3',          speed: -0.10 },
  ];
  const resolved = layers
    .map(({ sel, speed }) => ({ el: document.querySelector(sel), speed }))
    .filter(l => l.el);

  function onScroll() {
    const sy = window.scrollY;
    resolved.forEach(({ el, speed }) => {
      el.style.transform = `translateY(${sy * speed}px)`;
    });
  }
  /* Delay so hero CSS animations finish before we start overriding transform */
  setTimeout(() => window.addEventListener('scroll', onScroll, { passive: true }), 1400);
})();

/* ── HORIZONTAL SCROLL SHOWCASE ── */
(function initHorizontalScroll() {
  const outer = document.querySelector('.showcase-sticky-outer');
  const track = document.querySelector('.showcase-track');
  const dots  = document.querySelectorAll('.sp-dot');
  if (!outer || !track) return;

  function update() {
    const rect     = outer.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1,
      -rect.top / (rect.height - window.innerHeight)
    ));
    const maxX = -(track.scrollWidth - track.parentElement.clientWidth);
    track.style.transform = `translateX(${maxX * progress}px)`;

    if (dots.length) {
      const idx = Math.min(dots.length - 1, Math.round(progress * (dots.length - 1)));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── SVG PROCESS PATH ── */
(function initProcessPath() {
  const path    = document.querySelector('.process-path');
  const glow    = document.querySelector('.process-path-glow');
  const section = document.getElementById('process');
  const steps   = document.querySelectorAll('.ps-item');
  if (!path || !section) return;

  const len = path.getTotalLength();
  [path, glow].forEach(p => {
    if (!p) return;
    p.style.strokeDasharray  = len;
    p.style.strokeDashoffset = len;
  });

  function update() {
    const rect     = section.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1,
      (window.innerHeight - rect.top) / (window.innerHeight + rect.height * 0.4)
    ));
    const offset = len * (1 - progress);
    path.style.strokeDashoffset = offset;
    if (glow) glow.style.strokeDashoffset = offset;

    steps.forEach((s, i) => {
      s.classList.toggle('active', progress > (i / steps.length) * 0.9);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── MOMENTUM SCROLL — disabled; native scroll preserved ── */

/* ── BACK TO TOP ── */
(function initBackToTop() {
  const btn  = document.getElementById('back-to-top');
  if (!btn) return;
  const ring = btn.querySelector('.btt-ring');
  const C    = 2 * Math.PI * 18;   // circumference r=18
  ring.style.strokeDasharray  = C;
  ring.style.strokeDashoffset = C;

  window.addEventListener('scroll', () => {
    const sy  = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;
    const pct = max > 0 ? sy / max : 0;
    ring.style.strokeDashoffset = C * (1 - pct);
    btn.classList.toggle('visible', sy > 400);
  }, { passive: true });

  btn.addEventListener('click', () => document.documentElement.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── PAGE TRANSITION ── */
(function initPageTransition() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  if (sessionStorage.getItem('nm-pt')) {
    sessionStorage.removeItem('nm-pt');
    overlay.classList.add('entering');
    setTimeout(() => {
      overlay.classList.remove('entering');
      overlay.classList.add('leaving');
    }, 520);
    setTimeout(() => overlay.classList.remove('leaving'), 1120);
  }

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('tel') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('entering');
      sessionStorage.setItem('nm-pt', '1');
      setTimeout(() => { window.location.href = href; }, 560);
    });
  });
})();
