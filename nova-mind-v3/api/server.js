/**
 * Nova Mind — Backend Server
 * Node.js + Express + SQLite + Nodemailer
 *
 * Setup:
 *   npm install
 *   node server.js
 */

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const nodemailer = require('nodemailer');
const Database   = require('better-sqlite3');
const path       = require('path');
const fs         = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── ENV CONFIG ── */
const CONFIG = {
  EMAIL_FROM:   process.env.EMAIL_FROM   || 'hello@novamind.ai',
  EMAIL_TO:     process.env.EMAIL_TO     || 'hello@novamind.ai',
  SMTP_HOST:    process.env.SMTP_HOST    || 'smtp.gmail.com',
  SMTP_PORT:    parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER:    process.env.SMTP_USER    || '',
  SMTP_PASS:    process.env.SMTP_PASS    || '',
};

/* ── DATABASE ── */
const db = new Database(path.join(__dirname, 'nova-mind.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    fname     TEXT NOT NULL,
    lname     TEXT,
    email     TEXT NOT NULL,
    company   TEXT,
    service   TEXT,
    message   TEXT NOT NULL,
    ip        TEXT,
    created   DATETIME DEFAULT CURRENT_TIMESTAMP,
    emailed   INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS visitors (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    date    TEXT NOT NULL,
    count   INTEGER DEFAULT 0,
    UNIQUE(date)
  );
`);

/* ── MIDDLEWARE ── */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

/* ── RATE LIMITER ── */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many submissions. Please try again in 15 minutes.' }
});

/* ── EMAIL TRANSPORTER ── */
let transporter = null;
if (CONFIG.SMTP_USER && CONFIG.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host:   CONFIG.SMTP_HOST,
    port:   CONFIG.SMTP_PORT,
    secure: CONFIG.SMTP_PORT === 465,
    auth: { user: CONFIG.SMTP_USER, pass: CONFIG.SMTP_PASS }
  });
}

/* ── HELPERS ── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]*>/g, '').trim().slice(0, 2000);
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
}

/* ── ROUTES ── */

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Contact form submission
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { fname, lname, email, company, service, message } = req.body;

    // Validate
    if (!fname || !email || !message) {
      return res.status(400).json({ error: 'First name, email, and message are required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    // Sanitize
    const safe = {
      fname:   sanitize(fname),
      lname:   sanitize(lname),
      email:   sanitize(email).toLowerCase(),
      company: sanitize(company),
      service: sanitize(service),
      message: sanitize(message),
      ip:      getClientIP(req)
    };

    // Store in DB
    const stmt = db.prepare(`
      INSERT INTO contacts (fname, lname, email, company, service, message, ip)
      VALUES (@fname, @lname, @email, @company, @service, @message, @ip)
    `);
    const result = stmt.run(safe);

    // Send email notification
    let emailed = 0;
    if (transporter) {
      try {
        await transporter.sendMail({
          from:    `"Nova Mind" <${CONFIG.EMAIL_FROM}>`,
          to:      CONFIG.EMAIL_TO,
          subject: `New contact from ${safe.fname} ${safe.lname} — ${safe.service || 'General Inquiry'}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h2 style="color:#4f7fff;margin-bottom:1rem">New Nova Mind Inquiry</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#888;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${safe.fname} ${safe.lname}</td></tr>
                <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#888">Company</td><td style="padding:8px 0">${safe.company || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#888">Service</td><td style="padding:8px 0">${safe.service || '—'}</td></tr>
              </table>
              <div style="margin-top:1rem;background:#f5f5f5;padding:1rem;border-radius:8px">
                <p style="color:#888;font-size:0.8rem;margin-bottom:0.5rem">Message:</p>
                <p style="margin:0;white-space:pre-wrap">${safe.message}</p>
              </div>
              <p style="margin-top:1.5rem;font-size:0.8rem;color:#aaa">Submitted at ${new Date().toISOString()} · ID #${result.lastInsertRowid}</p>
            </div>
          `
        });

        // Also send confirmation to the lead
        await transporter.sendMail({
          from:    `"Nova Mind" <${CONFIG.EMAIL_FROM}>`,
          to:      safe.email,
          subject: `We received your message, ${safe.fname}!`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h2 style="color:#4f7fff">Thanks for reaching out, ${safe.fname}!</h2>
              <p>We've received your message and will get back to you within <strong>24 hours</strong>.</p>
              <p style="color:#888">In the meantime, feel free to explore our work at <a href="https://novamind.ai">novamind.ai</a> or book a discovery call directly on Calendly.</p>
              <div style="margin:2rem 0">
                <a href="https://calendly.com/novamind/discovery" style="background:#4f7fff;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Book a Call →</a>
              </div>
              <p style="color:#aaa;font-size:0.8rem">Nova Mind · hello@novamind.ai</p>
            </div>
          `
        });

        emailed = 1;
        db.prepare('UPDATE contacts SET emailed = 1 WHERE id = ?').run(result.lastInsertRowid);
      } catch (emailErr) {
        console.error('Email send failed:', emailErr.message);
      }
    }

    res.json({
      success: true,
      id: result.lastInsertRowid,
      emailed,
      message: `Thank you ${safe.fname}! We'll be in touch within 24 hours.`
    });

  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Server error. Please try again or email us directly.' });
  }
});

// Get all contacts (protected — add auth in production)
app.get('/api/admin/contacts', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== (process.env.ADMIN_TOKEN || 'change-this-token')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const contacts = db.prepare('SELECT * FROM contacts ORDER BY created DESC').all();
  res.json({ contacts, total: contacts.length });
});

// Visitor counter — GET (returns today's count) and POST (increments)
app.get('/api/visitors', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const row = db.prepare('SELECT count FROM visitors WHERE date = ?').get(today);
  const count = row ? row.count : 0;
  // Simulate online count (base count ±10%)
  const online = Math.max(1, Math.round(count * 0.12) + Math.floor(Math.random() * 5) + 3);
  res.json({ date: today, pageviews: count, online });
});

app.post('/api/visitors/track', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  db.prepare(`
    INSERT INTO visitors (date, count) VALUES (?, 1)
    ON CONFLICT(date) DO UPDATE SET count = count + 1
  `).run(today);
  res.json({ success: true });
});

// Export contacts as CSV
app.get('/api/admin/contacts/csv', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token !== (process.env.ADMIN_TOKEN || 'change-this-token')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const contacts = db.prepare('SELECT * FROM contacts ORDER BY created DESC').all();
  const header = 'ID,First Name,Last Name,Email,Company,Service,Message,IP,Created,Emailed';
  const rows = contacts.map(c =>
    [c.id, c.fname, c.lname, c.email, c.company, c.service,
     `"${(c.message||'').replace(/"/g,'""')}"`,
     c.ip, c.created, c.emailed ? 'Yes' : 'No'].join(',')
  );
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="nova-mind-contacts.csv"');
  res.send([header, ...rows].join('\n'));
});

/* ── START ── */
app.listen(PORT, () => {
  console.log(`\n🚀 Nova Mind backend running on http://localhost:${PORT}`);
  console.log(`   Admin contacts: GET /api/admin/contacts (set x-admin-token header)`);
  console.log(`   Contact form:   POST /api/contact`);
  console.log(`   Visitors:       GET /api/visitors`);
  if (!transporter) {
    console.log('\n⚠️  Email not configured — set SMTP_USER and SMTP_PASS env vars to enable email notifications');
  }
  console.log('');
});

module.exports = app;
