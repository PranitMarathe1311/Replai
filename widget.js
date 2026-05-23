// ============================================================
//  CLIENT CONFIG — EDIT ONLY THIS SECTION FOR EACH CLIENT
// ============================================================

const CLIENT = {

  // -- ASSISTANT IDENTITY --
  name:            "Aria",          // Name shown in chat header
  initials:        "AI",            // Shown in avatar circle if no logo
  logo:            "",              // Direct image URL (leave "" to use initials)
                                    // e.g. "https://example.com/logo.png"

  // -- COLORS --
  primaryColor:    "#0D1B2A",       // Header, bubble button, user messages
  accentColor:     "#00B4D8",       // Glow ring, typing dots, focus borders

  // -- FONT --
  // Options: "'DM Sans', sans-serif" | "'Inter', sans-serif"  |
  //          "'Poppins', sans-serif" | "'Nunito', sans-serif" |
  //          "'Lato', sans-serif"    | "Georgia, serif"
  font:            "'DM Sans', sans-serif",

  // -- MESSAGES --
  welcomeMessage:  "Hi there! 👋 I'm Aria, your AI assistant. How can I help you today?",
  errorMessage:    "Sorry, I'm having a little trouble right now. Please try again in a moment! 🙏",
  placeholder:     "Type your message...",
  footerText:      "Powered by AI",
  statusText:      "● Online — replies instantly",

  // -- SIZE (pixels) --
  chatWidth:       370,             // Chat window width  (recommended: 300–500)
  chatHeight:      520,             // Chat window height (recommended: 380–700)
  bubbleSize:      60,              // Floating button size (recommended: 48–80)

  // -- POSITION --
  bottomOffset:    28,              // Distance from bottom of screen (px)
  rightOffset:     28,              // Distance from right of screen (px)

  // -- CONNECTION --
  webhookUrl:      "YOUR_WEBHOOK_URL_HERE",

};

// ============================================================
//  END OF CLIENT CONFIG — DO NOT EDIT BELOW THIS LINE
// ============================================================

(function () {

  const FONT_URLS = {
    "'DM Sans', sans-serif":  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap",
    "'Inter', sans-serif":    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    "'Poppins', sans-serif":  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap",
    "'Nunito', sans-serif":   "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600&display=swap",
    "'Lato', sans-serif":     "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap",
  };

  const syneLink = document.createElement('link');
  syneLink.rel = 'stylesheet';
  syneLink.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap';
  document.head.appendChild(syneLink);

  if (FONT_URLS[CLIENT.font]) {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = FONT_URLS[CLIENT.font];
    document.head.appendChild(fontLink);
  }

  const host = document.createElement('div');
  host.id = 'ai-widget-host';
  host.style.cssText = `
    position: fixed; bottom: 0; right: 0;
    width: 0; height: 0;
    overflow: visible;
    z-index: 2147483647;
    pointer-events: none;
  `;
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :host { all: initial; }
    #w-root {
      --primary:     ${CLIENT.primaryColor};
      --accent:      ${CLIENT.accentColor};
      --font:        ${CLIENT.font};
      --chat-width:  ${CLIENT.chatWidth}px;
      --chat-height: ${CLIENT.chatHeight}px;
      --bubble-size: ${CLIENT.bubbleSize}px;
      --bottom:      ${CLIENT.bottomOffset}px;
      --right:       ${CLIENT.rightOffset}px;
      font-family: var(--font);
    }
    #w-toggle {
      position: fixed;
      bottom: var(--bottom); right: var(--right);
      width: var(--bubble-size); height: var(--bubble-size);
      border-radius: 50%;
      background: var(--primary);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      z-index: 2147483647;
      overflow: hidden;
      pointer-events: all;
      transition: transform .25s cubic-bezier(.34,1.56,.64,1);
      animation: pulse 2.5s ease-out infinite;
    }
    @keyframes pulse {
      0%   { box-shadow: 0 4px 24px rgba(0,0,0,.25), 0 0 0 0 rgba(0,180,216,.35); }
      70%  { box-shadow: 0 4px 24px rgba(0,0,0,.25), 0 0 0 14px rgba(0,180,216,0); }
      100% { box-shadow: 0 4px 24px rgba(0,0,0,.25), 0 0 0 0 rgba(0,180,216,0); }
    }
    #w-toggle:hover { transform: scale(1.1); }
    #w-toggle::after {
      content: '';
      position: absolute;
      top: 4px; right: 4px;
      width: 12px; height: 12px;
      background: #EF476F;
      border-radius: 50%;
      border: 2px solid white;
      animation: dot-pop .4s 1.5s cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes dot-pop { from { transform: scale(0); } to { transform: scale(1); } }
    #w-toggle.open::after { display: none; }
    #w-toggle.open .icon-chat  { display: none; }
    #w-toggle.open .icon-close { display: block !important; }
    #w-window {
      position: fixed;
      bottom: calc(var(--bottom) + var(--bubble-size) + 12px);
      right: var(--right);
      width: var(--chat-width); height: var(--chat-height);
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.08);
      display: flex; flex-direction: column;
      overflow: hidden;
      z-index: 2147483646;
      pointer-events: none;
      transform: scale(.85) translateY(20px);
      transform-origin: bottom right;
      opacity: 0;
      transition: transform .3s cubic-bezier(.34,1.56,.64,1), opacity .25s;
    }
    #w-window.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
    .w-header {
      background: var(--primary);
      padding: 14px 18px;
      display: flex; align-items: center; gap: 12px;
      flex-shrink: 0;
    }
    .w-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif;
      font-size: .9rem; font-weight: 800;
      color: var(--primary);
      flex-shrink: 0; position: relative; overflow: hidden;
    }
    .w-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: none; }
    .w-avatar::after {
      content: ''; position: absolute;
      bottom: 1px; right: 1px;
      width: 10px; height: 10px;
      background: #06D6A0; border-radius: 50%;
      border: 2px solid var(--primary); z-index: 1;
    }
    .w-header-info { flex: 1; }
    .w-header-name { font-family: 'Syne', sans-serif; font-size: .92rem; font-weight: 700; color: white; }
    .w-header-status { font-size: .7rem; color: #06D6A0; font-weight: 500; }
    .w-close-btn {
      background: rgba(255,255,255,.1); border: none;
      color: rgba(255,255,255,.7);
      width: 28px; height: 28px; border-radius: 50%;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 1rem; transition: background .2s; pointer-events: all;
    }
    .w-close-btn:hover { background: rgba(255,255,255,.2); color: white; }
    .w-messages {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 10px;
      background: #FAFBFC; scroll-behavior: smooth;
    }
    .w-messages::-webkit-scrollbar { width: 4px; }
    .w-messages::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 2px; }
    .w-msg { display: flex; gap: 8px; align-items: flex-end; animation: msg-in .3s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes msg-in {
      from { opacity: 0; transform: translateY(10px) scale(.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .w-msg.user { flex-direction: row-reverse; }
    .w-msg-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif; font-size: .6rem; font-weight: 800;
      color: var(--primary); flex-shrink: 0; overflow: hidden;
    }
    .w-msg-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
    .w-msg.user .w-msg-avatar { background: var(--primary); color: white; }
    .w-msg-wrap { display: flex; flex-direction: column; max-width: 78%; }
    .w-msg.user .w-msg-wrap { align-items: flex-end; }
    .w-bubble {
      padding: 10px 14px; border-radius: 18px;
      font-size: .875rem; line-height: 1.55;
      color: #1A202C; background: white;
      box-shadow: 0 1px 4px rgba(0,0,0,.07);
      border-bottom-left-radius: 4px;
      word-wrap: break-word; font-family: var(--font);
    }
    .w-msg.user .w-bubble {
      background: var(--primary); color: white;
      border-bottom-left-radius: 18px; border-bottom-right-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,.2);
    }
    .w-msg-time { font-size: .63rem; color: #A0AEC0; margin-top: 3px; }
    .w-msg.user .w-msg-time { text-align: right; }
    .w-typing { display: flex; align-items: center; gap: 8px; animation: msg-in .3s both; }
    .w-typing-dots {
      background: white; box-shadow: 0 1px 4px rgba(0,0,0,.07);
      border-radius: 18px; border-bottom-left-radius: 4px;
      padding: 12px 16px; display: flex; gap: 4px; align-items: center;
    }
    .w-typing-dots span {
      width: 7px; height: 7px; background: var(--accent);
      border-radius: 50%; animation: bounce 1.2s infinite;
    }
    .w-typing-dots span:nth-child(2) { animation-delay: .2s; }
    .w-typing-dots span:nth-child(3) { animation-delay: .4s; }
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: .4; }
      30%            { transform: translateY(-5px); opacity: 1; }
    }
    .w-input-area {
      padding: 10px 14px; background: white;
      border-top: 1px solid #EDF2F7;
      display: flex; gap: 10px; align-items: flex-end; flex-shrink: 0;
    }
    #w-input {
      flex: 1; border: 1.5px solid #E2E8F0; border-radius: 12px;
      padding: 9px 14px; font-family: var(--font); font-size: .875rem;
      color: #1A202C; resize: none; outline: none;
      max-height: 100px; min-height: 40px; line-height: 1.5;
      transition: border-color .2s; background: #FAFBFC;
    }
    #w-input:focus { border-color: var(--accent); background: white; }
    #w-input::placeholder { color: #A0AEC0; }
    #w-send {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--primary); border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s, transform .15s;
      flex-shrink: 0; pointer-events: all;
    }
    #w-send:hover { background: var(--accent); transform: scale(1.05); }
    #w-send:active { transform: scale(.95); }
    #w-send:disabled { background: #E2E8F0; cursor: not-allowed; transform: none; }
    .w-footer {
      padding: 5px 14px 9px; text-align: center;
      font-size: .63rem; color: #CBD5E0; background: white; letter-spacing: .03em;
    }
    @media (max-width: 420px) { #w-window { width: calc(100vw - 24px); right: 12px; } }
  `;
  shadow.appendChild(style);

  const root = document.createElement('div');
  root.id = 'w-root';
  root.innerHTML = `
    <button id="w-toggle" aria-label="Open chat">
      <svg class="icon-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg class="icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" style="display:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div id="w-window">
      <div class="w-header">
        <div class="w-avatar">
          <img id="w-logo" src="" alt=""/>
          <span id="w-initials">${CLIENT.initials}</span>
        </div>
        <div class="w-header-info">
          <div class="w-header-name">${CLIENT.name}</div>
          <div class="w-header-status">${CLIENT.statusText}</div>
        </div>
        <button class="w-close-btn" id="w-close">✕</button>
      </div>
      <div class="w-messages" id="w-messages"></div>
      <div class="w-input-area">
        <textarea id="w-input" rows="1" placeholder="${CLIENT.placeholder}"></textarea>
        <button id="w-send">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <div class="w-footer">${CLIENT.footerText}</div>
    </div>
  `;
  shadow.appendChild(root);

  if (CLIENT.logo) {
    const img = shadow.getElementById('w-logo');
    img.src = CLIENT.logo;
    img.style.display = 'block';
    shadow.getElementById('w-initials').style.display = 'none';
  }

  const toggle   = shadow.getElementById('w-toggle');
  const chatWin  = shadow.getElementById('w-window');
  const closeBtn = shadow.getElementById('w-close');
  const input    = shadow.getElementById('w-input');
  const sendBtn  = shadow.getElementById('w-send');
  const messages = shadow.getElementById('w-messages');

  let isOpen = false, isWaiting = false, welcomed = false;

  function toggleChat() {
    isOpen = !isOpen;
    chatWin.classList.toggle('open', isOpen);
    toggle.classList.toggle('open', isOpen);
    if (isOpen && !welcomed) {
      setTimeout(() => addMsg('bot', CLIENT.welcomeMessage), 400);
      welcomed = true;
      input.focus();
    }
  }
  toggle.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function addMsg(sender, text) {
    const isUser = sender === 'user';
    const wrap = document.createElement('div');
    wrap.className = 'w-msg ' + (isUser ? 'user' : 'bot');
    const av = document.createElement('div');
    av.className = 'w-msg-avatar';
    if (!isUser && CLIENT.logo) {
      const img = document.createElement('img');
      img.src = CLIENT.logo;
      av.appendChild(img);
    } else {
      av.textContent = isUser ? 'You' : CLIENT.initials;
    }
    const bw = document.createElement('div');
    bw.className = 'w-msg-wrap';
    const b = document.createElement('div');
    b.className = 'w-bubble';
    b.textContent = text;
    const t = document.createElement('div');
    t.className = 'w-msg-time';
    t.textContent = getTime();
    bw.appendChild(b);
    bw.appendChild(t);
    wrap.appendChild(av);
    wrap.appendChild(bw);
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const w = document.createElement('div');
    w.className = 'w-typing'; w.id = 'w-typing';
    const av = document.createElement('div');
    av.className = 'w-msg-avatar';
    av.textContent = CLIENT.initials;
    const d = document.createElement('div');
    d.className = 'w-typing-dots';
    d.innerHTML = '<span></span><span></span><span></span>';
    w.appendChild(av); w.appendChild(d);
    messages.appendChild(w);
    messages.scrollTop = messages.scrollHeight;
  }
  function hideTyping() {
    const el = shadow.getElementById('w-typing');
    if (el) el.remove();
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isWaiting) return;
    addMsg('user', text);
    input.value = '';
    input.style.height = 'auto';
    isWaiting = true;
    sendBtn.disabled = true;
    showTyping();
    try {
      const res  = await fetch(CLIENT.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      hideTyping();
      addMsg('bot', data.reply || data.message || data.response || 'Got it!');
    } catch {
      hideTyping();
      addMsg('bot', CLIENT.errorMessage);
    }
    isWaiting = false;
    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

})();
