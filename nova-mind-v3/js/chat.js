/* ─────────────────────────────────────────
   Nova Mind — AI Chat Demo
   Full-Service Tech Agency
   ───────────────────────────────────────── */

let currentScenario = 'nova';
let chatHistory = [];

const SCENARIOS = {
  nova: {
    title: 'Nova Mind Assistant',
    systemPrompt: `You are the Nova Mind AI assistant — representing Nova Mind, a full-service technology agency that builds websites, mobile apps, AI systems, automation tools, e-commerce stores, custom CRMs/ERPs, and any kind of digital solution businesses need.

About Nova Mind:
- Full-service tech agency — we do everything tech: web, mobile, AI, automation, e-commerce, custom systems
- Work with any client type: startups, SMEs, large enterprises, government agencies, municipalities, public institutions, and NGOs
- 80+ projects delivered across 20+ sectors, 50+ happy clients, 5 years experience
- Government/public sector experience: citizen portals, e-service platforms, case management systems, open data tools — built with WCAG accessibility and security compliance
- Typical timelines: Landing page (1-2 weeks), Web app (6-14 weeks), Mobile app (8-16 weeks), Custom system (10-20 weeks), Government portal (12-24 weeks)
- Rough pricing: Landing page from €1,500, Web app from €8,000, Mobile app from €15,000, E-commerce store from €5,000, Custom system from €20,000 — always depends on scope
- Technologies: React, Next.js, React Native, Node.js, Python, AWS/GCP, PostgreSQL, AI/ML tools
- Services: Websites, Web Apps, Mobile Apps (iOS & Android), E-Commerce, AI & Automation, Custom CRM/ERP, UI/UX Design, Cloud & DevOps

Be helpful, honest, and conversational. If someone describes their business need, suggest the right solution and give a rough sense of scope/cost. Always end by inviting them to book a free call or fill the contact form for a precise quote. Keep responses concise — 3-5 sentences max.`,
    greeting: "Hi! I'm the Nova Mind assistant. Tell me about your business and what you want to build — I'll help you figure out the best solution and give you a rough idea of what it takes. What's your project? 👋",
    quickReplies: ['What can you build for my business?', 'How much does a website cost?', 'How long does it take?']
  },
  legal: {
    title: 'Business Advisor AI',
    systemPrompt: `You are a business technology advisor AI — a demo of the kind of AI assistant Nova Mind builds for client-facing businesses.

Your role is to help business owners think through their technology needs:
- Ask about their business, current challenges, and goals
- Recommend the right type of digital solution (website, app, automation, etc.)
- Explain the benefits in plain business language
- Help them understand what's possible with modern tech
- Suggest how to prioritize if they have limited budget

Keep responses practical and business-focused. Avoid jargon. After helping them, mention that Nova Mind can build exactly this kind of AI advisor for their own business — customized to their industry and customers.`,
    greeting: "Hello! I'm a business technology advisor. Tell me about your business — what you do, what problems you're facing, and what you'd like to improve. I'll help you figure out what tech solutions could make a real difference for you. 💼",
    quickReplies: ['I run a small retail shop', 'I have a service business', 'I want to digitize my operations']
  },
  data: {
    title: 'Data & Analytics AI',
    systemPrompt: `You are a data and analytics AI assistant — a demo of the kind of intelligent analytics tool Nova Mind builds for businesses.

You help business owners and managers:
- Understand their key performance metrics
- Identify what data they should be tracking
- Suggest dashboards and reports that would be useful for their business
- Explain how to make data-driven decisions
- Recommend KPIs for different business types (retail, SaaS, services, e-commerce, etc.)

Use plain language. Give concrete examples with hypothetical numbers. After helping, mention that Nova Mind builds custom analytics dashboards, automated reports, and data pipelines — tailored to the client's exact business needs.`,
    greeting: "Hi! I'm a data analytics assistant. Ask me anything about business metrics, KPIs, dashboards, or how to better understand your business performance. What type of business do you run? 📊",
    quickReplies: ['What KPIs should I track?', 'How do I measure customer retention?', 'What should my sales dashboard show?']
  }
};

function setScenario(key) {
  currentScenario = key;
  chatHistory = [];

  document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('active'));
  document.querySelector(`[data-scenario="${key}"]`)?.classList.add('active');

  const titleEl = document.getElementById('chat-title');
  if (titleEl) titleEl.textContent = SCENARIOS[key].title;

  const messagesEl = document.getElementById('chat-messages');
  if (messagesEl) {
    messagesEl.innerHTML = '';
    appendMessage('assistant', SCENARIOS[key].greeting);
  }

  const qr = document.getElementById('quick-replies');
  if (qr) {
    qr.innerHTML = SCENARIOS[key].quickReplies
      .map(r => `<button onclick="sendQuick('${r.replace(/'/g, "\\'")}')">${r}</button>`)
      .join('');
  }
}

function clearChat() { setScenario(currentScenario); }

function appendMessage(role, text) {
  const messagesEl = document.getElementById('chat-messages');
  if (!messagesEl) return;
  const msg    = document.createElement('div');
  msg.className = `chat-msg ${role}`;
  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  avatar.textContent = role === 'assistant' ? 'NM' : 'You';
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.textContent = text;
  msg.appendChild(avatar);
  msg.appendChild(bubble);
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return bubble;
}

function appendTyping() {
  const messagesEl = document.getElementById('chat-messages');
  if (!messagesEl) return null;
  const msg    = document.createElement('div');
  msg.className = 'chat-msg assistant';
  msg.id = 'typing-indicator';
  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  avatar.textContent = 'NM';
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble typing';
  bubble.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  msg.appendChild(avatar);
  msg.appendChild(bubble);
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return msg;
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  appendMessage('user', text);
  chatHistory.push({ role: 'user', content: text });

  const typingEl = appendTyping();

  try {
    const scenario = SCENARIOS[currentScenario];
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 350,
        system: scenario.systemPrompt,
        messages: chatHistory
      })
    });
    const data  = await response.json();
    const reply = data.content?.[0]?.text || 'Sorry, I had trouble responding. Please try again.';
    chatHistory.push({ role: 'assistant', content: reply });
    typingEl?.remove();
    appendMessage('assistant', reply);
  } catch {
    typingEl?.remove();
    const fallback = getFallback(currentScenario, text);
    chatHistory.push({ role: 'assistant', content: fallback });
    appendMessage('assistant', fallback);
  }
}

function sendQuick(text) {
  const input = document.getElementById('chat-input');
  if (input) input.value = text;
  sendMessage();
}

function getFallback(scenario, msg) {
  const m = msg.toLowerCase();
  if (scenario === 'nova') {
    if (m.includes('website') || m.includes('web')) return "A standard business website with a modern design starts from around €1,500-3,000 and takes 1-2 weeks. A more complex web app or platform typically starts from €8,000 and takes 6-14 weeks depending on features. Want to book a free 30-min call so we can scope your project precisely?";
    if (m.includes('app') || m.includes('mobile')) return "A cross-platform mobile app (iOS + Android) typically starts from €15,000 and takes 8-16 weeks. We use React Native so you get both platforms from one codebase — much more cost-effective. What kind of app are you thinking of building?";
    if (m.includes('cost') || m.includes('price') || m.includes('how much')) return "It really depends on what you need! A landing page starts from €1,500. A web app from €8,000. A mobile app from €15,000. A custom system from €20,000. The best way to get an accurate number is a free 30-min call — we'll scope it together and send you a clear proposal within 48 hours.";
    if (m.includes('time') || m.includes('long') || m.includes('fast')) return "We move fast. A simple website takes 1-2 weeks. A web app 6-14 weeks. A mobile app 8-16 weeks. We work in sprints and give you weekly updates — no surprises. What's your target launch date?";
    return "Great question! Nova Mind builds pretty much anything tech-related — websites, apps, AI tools, automation, e-commerce, custom systems. Tell me more about your business and what problem you're trying to solve, and I'll tell you exactly what we'd recommend building.";
  }
  if (scenario === 'legal') {
    return "That's a really common situation. The right tech solution depends on your specific workflow and goals. Could you tell me a bit more — how many people are in your team, and what's the biggest time-waster or bottleneck in your day-to-day operations right now?";
  }
  if (scenario === 'data') {
    return "Great starting point! The most important KPIs depend on your business model. For most businesses I'd start with: Revenue (total + by channel), Customer Acquisition Cost, Customer Lifetime Value, and Churn Rate. What type of business do you run? I can give you a much more specific list.";
  }
  return "Thanks for your message! To experience the full AI capabilities with real-time responses, the API needs to be connected. Contact Nova Mind to see a full live demo tailored to your business.";
}
