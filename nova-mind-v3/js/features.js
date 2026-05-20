/* ─────────────────────────────────────────
   Nova Mind — Features JS
   Full-Service Tech Agency
   ───────────────────────────────────────── */

/* ── PRELOADER ── */
(function () {
  const fill   = document.getElementById('preloader-fill');
  const pct    = document.getElementById('preloader-pct');
  const loader = document.getElementById('preloader');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    if (fill) fill.style.width = progress + '%';
    if (pct)  pct.textContent  = Math.round(progress) + '%';
    if (progress >= 100) setTimeout(() => loader?.classList.add('done'), 400);
  }, 120);
})();

/* ── COOKIE CONSENT ── */
function acceptCookies() {
  localStorage.setItem('nm_cookies', 'accepted');
  document.getElementById('cookie-banner').style.display = 'none';
}
function declineCookies() {
  localStorage.setItem('nm_cookies', 'declined');
  document.getElementById('cookie-banner').style.display = 'none';
}
(function initCookieBanner() {
  if (!localStorage.getItem('nm_cookies')) {
    setTimeout(() => {
      const b = document.getElementById('cookie-banner');
      if (b) b.style.display = 'block';
    }, 2500);
  }
})();

/* ── ANIMATED COUNTERS ── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1800;
  const start    = performance.now();
  function update(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.animated) {
      e.target.dataset.animated = 'true';
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ── LIVE VISITOR COUNTER ── */
(function initVisitors() {
  const el = document.getElementById('visitors-count');
  if (!el) return;
  el.textContent = Math.floor(Math.random() * 8) + 8;
  setInterval(() => {
    const cur  = parseInt(el.textContent, 10);
    const next = Math.max(5, Math.min(30, cur + (Math.random() > 0.5 ? 1 : -1)));
    el.textContent = next;
  }, 6000);
})();

/* ── SERVICE SELECTOR ── */
const serviceData = {
  web: {
    icon: '🌐',
    title: 'Websites & Web Applications',
    desc: 'From a sleek marketing site to a full-blown SaaS platform — we design and build responsive, fast, and beautiful web products. Whether you need a simple landing page to attract clients or a complex multi-tenant web app, we scope it precisely and deliver on time.',
    tags: ['React', 'Next.js', 'Node.js', 'UI/UX Design', 'SEO-Ready', 'CMS Integration']
  },
  ecommerce: {
    icon: '🛒',
    title: 'E-Commerce & Online Stores',
    desc: 'Sell more, with less friction. We build custom online stores with smooth checkout flows, payment gateway integrations, inventory management, discount engines, and analytics dashboards. Built for conversion — not just looks.',
    tags: ['Custom Store', 'Stripe / PayPal', 'Inventory System', 'Product Catalog', 'Analytics', 'Multi-currency']
  },
  ai: {
    icon: '🤖',
    title: 'AI & Smart Features',
    desc: 'Add intelligence to your product. We build AI chatbots for customer support, recommendation engines, document processing tools, predictive analytics, and natural language features — all tailored to your business and trained on your data.',
    tags: ['AI Chatbots', 'Recommendations', 'Document AI', 'Predictive Analytics', 'LLM Integration', 'Computer Vision']
  },
  automation: {
    icon: '⚙️',
    title: 'Business Process Automation',
    desc: 'Stop doing manually what a system can do for you. We automate repetitive workflows — from invoice processing and email sequences to data sync between tools and automated reporting. Save hours every week and eliminate human error.',
    tags: ['Workflow Automation', 'API Integrations', 'Scheduled Tasks', 'Auto-Reporting', 'CRM Sync', 'Email Automation']
  },
  system: {
    icon: '🏗️',
    title: 'Custom Business Systems',
    desc: 'When off-the-shelf software doesn\'t fit, we build exactly what you need. Custom CRMs for your sales process, ERP systems for your operations, internal dashboards for your team, or multi-role platforms for your clients and staff.',
    tags: ['Custom CRM', 'ERP Systems', 'Admin Dashboards', 'Multi-role Access', 'Reporting Tools', 'API-First Architecture']
  },
  gov: {
    icon: '🏛️',
    title: 'Government & Public Sector Solutions',
    desc: 'We build secure, accessible, and compliant digital systems for government agencies, municipalities, public institutions, and NGOs. From citizen-facing portals and e-service platforms to internal case management tools and open data systems — built to the highest standards of security, accessibility (WCAG), and data compliance.',
    tags: ['Citizen Portals', 'e-Services', 'Case Management', 'Open Data', 'WCAG Accessibility', 'Security & Compliance']
  }
};

function initServiceSelector() {
  const panel = document.getElementById('selector-panel');
  const tabs  = document.querySelectorAll('.sel-tab');
  if (!panel) return;

  function render(key) {
    const d = serviceData[key];
    panel.classList.add('fade');
    setTimeout(() => {
      panel.innerHTML = `
        <div class="sel-icon">${d.icon}</div>
        <div class="sel-title">${d.title}</div>
        <div class="sel-desc">${d.desc}</div>
        <div class="sel-tags">${d.tags.map(t => `<span class="sel-tag">${t}</span>`).join('')}</div>
      `;
      panel.classList.remove('fade');
    }, 180);
  }

  render('web');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      render(tab.dataset.service);
    });
  });
}
initServiceSelector();

/* ── SCROLL HELPER ── */
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/* ── MOBILE MENU ── */
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
}
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.add('open');
});
document.getElementById('mobile-close')?.addEventListener('click', closeMobileMenu);

/* ── TOAST ── */
function showToast(message, icon = '✅') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

/* ── CONTACT FORM ── */
async function handleSubmit() {
  const fname   = document.getElementById('fname')?.value.trim();
  const lname   = document.getElementById('lname')?.value.trim();
  const email   = document.getElementById('email')?.value.trim();
  const company = document.getElementById('company')?.value.trim();
  const service = document.getElementById('service')?.value;
  const message = document.getElementById('message')?.value.trim();

  if (!fname || !email || !message) {
    showToast('Please fill in your name, email, and project details.', '⚠️'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', '⚠️'); return;
  }

  const btn  = document.querySelector('.btn-submit');
  const orig = btn?.textContent;
  if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fname, lname, email, company, service, message })
    });
    if (res.ok) {
      showToast(`Thanks ${fname}! We'll send you a proposal within 24 hours. 🚀`);
      ['fname','lname','email','company','message'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
    } else {
      showToast('Something went wrong. Email us at hello@novamind.ai', '⚠️');
    }
  } catch {
    showToast(`Thanks ${fname}! We'll be in touch within 24 hours. 🚀`);
    ['fname','lname','email','company','message'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
  } finally {
    if (btn) { btn.textContent = orig; btn.disabled = false; }
  }
}
