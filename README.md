# Nova Mind — Portfolio Website

Full-stack AI portfolio website with live AI chat demo, ROI calculator, contact form backend, and more.

---

## 📁 Project Structure

```
nova-mind/
├── index.html              ← Main website page
├── sitemap.xml             ← SEO sitemap
├── robots.txt              ← SEO robots file
├── package.json            ← Backend dependencies
│
├── css/
│   ├── style.css           ← Core styles
│   └── features.css        ← Feature styles (ROI, chat, etc.)
│
├── js/
│   ├── main.js             ← Core JS (cursor, canvas, nav, scroll)
│   ├── features.js         ← Preloader, cookie, selector, counters
│   ├── chat.js             ← AI chat demo (Anthropic API)
│   └── roi.js              ← ROI calculator logic
│
├── api/
│   └── server.js           ← Node.js backend (Express + SQLite)
│
└── pages/
    ├── case-orion.html     ← Orion case study page
    └── case-legal.html     ← Legal AI case study page
```

---

## ✅ Features Included

| Feature | Status |
|---|---|
| Animated preloader | ✅ |
| Custom cursor + particle canvas | ✅ |
| Floating pill navigation | ✅ |
| Scroll progress bar | ✅ |
| Live visitor counter | ✅ |
| Animated stats counters | ✅ |
| Press / "As featured in" strip | ✅ |
| Client logo marquee | ✅ |
| Interactive service selector | ✅ |
| ROI calculator (sliders) | ✅ |
| AI chat demo (3 scenarios) | ✅ |
| Portfolio grid with case studies | ✅ |
| Case study pages | ✅ |
| Team section | ✅ |
| Testimonials | ✅ |
| Booking / Calendly section | ✅ |
| Contact form | ✅ |
| GDPR cookie consent | ✅ |
| Backend API (Node.js) | ✅ |
| SQLite database | ✅ |
| Email notifications (Nodemailer) | ✅ |
| Admin contacts endpoint | ✅ |
| Rate limiting | ✅ |
| SEO meta tags + sitemap | ✅ |
| robots.txt | ✅ |
| Mobile responsive | ✅ |

---

## 🚀 Quick Start

### Frontend only (no backend)
Just open `index.html` in a browser — everything works except the contact form submission (it falls back gracefully).

### With backend
```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (see below)

# 3. Start the server
npm start

# The server serves the frontend + backend on http://localhost:3000
```

---

## ⚙️ Environment Variables

Create a `.env` file (or set these in your hosting dashboard):

```env
# Server
PORT=3000

# Email (Gmail example — use App Password, not your real password)
EMAIL_FROM=hello@novamind.ai
EMAIL_TO=hello@novamind.ai
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password

# Admin panel (change this!)
ADMIN_TOKEN=your-secret-admin-token
```

### Setting up Gmail
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate a password for "Mail"
4. Use that as `SMTP_PASS`

---

## 🤖 Enabling the AI Chat Demo

The chat demo uses the Anthropic API. To enable it:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. The frontend calls the Anthropic API directly (for the demo)

**For production**, move the API call to your backend `server.js` to keep your API key secret:
```javascript
// In api/server.js, add:
app.post('/api/chat', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
});
```
Then update `chat.js` to call `/api/chat` instead of the Anthropic API directly.

---

## 📊 Viewing Contact Submissions

```bash
# View all contacts (JSON)
curl -H "x-admin-token: your-secret-admin-token" http://localhost:3000/api/admin/contacts

# Download as CSV
curl -H "x-admin-token: your-secret-admin-token" http://localhost:3000/api/admin/contacts/csv > contacts.csv
```

---

## 🌐 Hosting Options

### Option 1 — Netlify (frontend only, free)
1. Go to [netlify.com](https://netlify.com)
2. Drag the project folder onto the dashboard
3. Done — live in 60 seconds
4. Add custom domain in Settings → Domain Management
> Note: Contact form will use fallback mode (no email). Use Netlify Forms or Formspree for emails.

### Option 2 — Railway (frontend + backend, recommended)
1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub"
3. Push this folder to GitHub, connect the repo
4. Set environment variables in Railway dashboard
5. Done — auto-deploys on every push
> Railway gives you a free tier and a managed PostgreSQL if you want to upgrade from SQLite.

### Option 3 — Render (free tier)
1. Go to [render.com](https://render.com)
2. Create a "Web Service" → connect GitHub repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Set environment variables
6. Free tier sleeps after 15 min inactivity (upgrade to avoid)

### Option 4 — VPS (DigitalOcean / Hetzner)
```bash
# On your server
git clone your-repo nova-mind
cd nova-mind
npm install
# Install PM2 to keep it running
npm install -g pm2
pm2 start api/server.js --name nova-mind
pm2 startup  # Auto-restart on reboot
```
Use Nginx as a reverse proxy and Certbot for SSL.

---

## 📝 Customization Checklist

Before going live, update these:

- [ ] Team names, roles, and bios in `index.html`
- [ ] Portfolio project descriptions
- [ ] Client names in the marquee
- [ ] Calendly link (search for `calendly.com/novamind`)
- [ ] Email address (search for `novamind.ai`)
- [ ] Google Analytics ID (uncomment in `<head>`)
- [ ] `sitemap.xml` — update domain from `novamind.ai` to your real domain
- [ ] `robots.txt` — update sitemap URL
- [ ] ADMIN_TOKEN in `.env`

---

## 📬 Contact

hello@novamind.ai | novamind.ai
