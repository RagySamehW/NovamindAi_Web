/* ─────────────────────────────────────────
   Nova Mind — Main JavaScript
   ───────────────────────────────────────── */

/* ── SMOOTH SCROLL HELPER ── */
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

/* ── CUSTOM CURSOR ── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

const hoverTargets = 'button, a, .srv-item, .wc, .team-card, .test-card, .stat-item, .af-item, .srv-card';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

/* ── SCROLL PROGRESS BAR ── */
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('scroll-bar').style.width = pct + '%';
});

/* ── SCROLL FADE-IN ── */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

/* ── PARTICLE CANVAS BACKGROUND ── */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r  = Math.random() * 1.2 + 0.3;
    this.a  = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '79,127,255' : '157,120,255';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.a})`;
    ctx.fill();
  }
}

const particles = Array.from({ length: 80 }, () => new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79,127,255,${(1 - dist / 120) * 0.06})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }
}

(function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateCanvas);
})();

/* ── MOUSE PARALLAX ON PARTICLES ── */
let targetMouseX = 0, targetMouseY = 0;
document.addEventListener('mousemove', e => {
  targetMouseX = (e.clientX / W - 0.5) * 0.3;
  targetMouseY = (e.clientY / H - 0.5) * 0.3;
});

/* ── NAV SCROLL BEHAVIOR ── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 100) {
    navbar.style.top = currentScroll > lastScroll ? '-80px' : '20px';
  }
  lastScroll = currentScroll;
}, { passive: true });

/* ── TOAST NOTIFICATION ── */
function showToast(message, icon = '✅') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ── CONTACT FORM HANDLER ── */
function handleSubmit() {
  const fname   = document.getElementById('fname')?.value.trim();
  const email   = document.getElementById('email')?.value.trim();
  const message = document.getElementById('message')?.value.trim();

  if (!fname || !email || !message) {
    showToast('Please fill in the required fields.', '⚠️');
    return;
  }
  if (!email.includes('@')) {
    showToast('Please enter a valid email address.', '⚠️');
    return;
  }

  // In production: replace this with your real form endpoint (e.g. Formspree, Netlify Forms, EmailJS)
  showToast(`Thanks ${fname}! We'll be in touch within 24 hours.`, '🚀');

  // Clear form
  ['fname','lname','email','company','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

/* ── STAGGER ANIMATION ON SERVICE ITEMS ── */
document.querySelectorAll('.srv-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 60}ms`;
});

/* ── ACTIVE NAV LINK HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? '#fff'
          : '';
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));
