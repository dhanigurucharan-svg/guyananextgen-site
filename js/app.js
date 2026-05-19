/* ── Guyana Next Gen — Frontend App JS ── */

(function () {
  'use strict';

  // ── State ──
  let currentUser = null;

  // ── API Helper ──
  async function api(url, options = {}) {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  }

  // ── Auth State ──
  async function checkAuth() {
    try {
      const data = await api('/api/auth/me');
      currentUser = data.user;
      updateAuthUI();
    } catch {
      currentUser = null;
      updateAuthUI();
    }
  }

  function updateAuthUI() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    if (currentUser) {
      navActions.innerHTML = `
        <span style="font-size:13px;color:rgba(255,255,255,0.7);letter-spacing:0.04em;">
          ${escapeHtml(currentUser.name)}
        </span>
        <button class="btn-login" id="btn-logout">Log Out</button>
      `;
      document.getElementById('btn-logout').addEventListener('click', handleLogout);
    } else {
      navActions.innerHTML = `
        <button class="btn-login" id="btn-open-login">Log In</button>
        <button class="btn-signup" id="btn-open-signup">Sign Up</button>
      `;
      document.getElementById('btn-open-login').addEventListener('click', () => openModal('login'));
      document.getElementById('btn-open-signup').addEventListener('click', () => openModal('signup'));
    }
  }

  async function handleLogout() {
    try {
      await api('/api/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    currentUser = null;
    updateAuthUI();
  }

  // ── Modal System ──
  function createModalOverlay() {
    if (document.getElementById('gng-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'gng-modal-overlay';
    overlay.style.cssText = `
      display:none; position:fixed; inset:0; z-index:9999;
      background:rgba(11,30,20,0.6); backdrop-filter:blur(4px);
      justify-content:center; align-items:center;
    `;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    const box = document.createElement('div');
    box.id = 'gng-modal-box';
    box.style.cssText = `
      background:#fff; border-radius:8px; padding:36px 32px;
      width:100%; max-width:400px; position:relative;
      box-shadow:0 24px 64px rgba(11,30,20,0.25);
      font-family:'DM Sans',sans-serif;
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  function openModal(type) {
    createModalOverlay();
    const overlay = document.getElementById('gng-modal-overlay');
    const box = document.getElementById('gng-modal-box');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (type === 'login') {
      box.innerHTML = `
        <div style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:#0b2e1f;margin-bottom:4px;">Welcome Back</div>
        <div style="font-size:13px;color:rgba(11,30,20,0.55);margin-bottom:24px;">Log in to your Guyana Next Gen account</div>
        <div id="modal-error" style="display:none;background:#fef2f2;color:#b91c1c;font-size:13px;padding:10px 14px;border-radius:4px;margin-bottom:16px;"></div>
        <form id="login-form">
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,30,20,0.5);margin-bottom:6px;">Email</label>
          <input type="email" name="email" required placeholder="you@example.com" style="width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;border:1px solid rgba(11,30,20,0.15);border-radius:3px;margin-bottom:14px;outline:none;" />
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,30,20,0.5);margin-bottom:6px;">Password</label>
          <input type="password" name="password" required placeholder="Your password" style="width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;border:1px solid rgba(11,30,20,0.15);border-radius:3px;margin-bottom:20px;outline:none;" />
          <button type="submit" style="width:100%;padding:14px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#fff;background:#0b2e1f;border:none;border-radius:3px;cursor:pointer;">Log In</button>
        </form>
        <div style="text-align:center;margin-top:16px;font-size:13px;color:rgba(11,30,20,0.55);">
          Don't have an account? <a href="#" id="switch-to-signup" style="color:#2a7a50;font-weight:600;text-decoration:none;">Sign Up</a>
        </div>
      `;
      document.getElementById('login-form').addEventListener('submit', handleLogin);
      document.getElementById('switch-to-signup').addEventListener('click', (e) => { e.preventDefault(); openModal('signup'); });
    }

    if (type === 'signup') {
      box.innerHTML = `
        <div style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:#0b2e1f;margin-bottom:4px;">Create Account</div>
        <div style="font-size:13px;color:rgba(11,30,20,0.55);margin-bottom:24px;">Join the Guyana Next Gen community</div>
        <div id="modal-error" style="display:none;background:#fef2f2;color:#b91c1c;font-size:13px;padding:10px 14px;border-radius:4px;margin-bottom:16px;"></div>
        <form id="signup-form">
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,30,20,0.5);margin-bottom:6px;">Full Name</label>
          <input type="text" name="name" required placeholder="e.g. Marcus James" style="width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;border:1px solid rgba(11,30,20,0.15);border-radius:3px;margin-bottom:14px;outline:none;" />
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,30,20,0.5);margin-bottom:6px;">Email</label>
          <input type="email" name="email" required placeholder="you@example.com" style="width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;border:1px solid rgba(11,30,20,0.15);border-radius:3px;margin-bottom:14px;outline:none;" />
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,30,20,0.5);margin-bottom:6px;">Password</label>
          <input type="password" name="password" required minlength="6" placeholder="At least 6 characters" style="width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;border:1px solid rgba(11,30,20,0.15);border-radius:3px;margin-bottom:20px;outline:none;" />
          <button type="submit" style="width:100%;padding:14px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#0b2e1f;background:#90c94a;border:none;border-radius:3px;cursor:pointer;">Create Account</button>
        </form>
        <div style="text-align:center;margin-top:16px;font-size:13px;color:rgba(11,30,20,0.55);">
          Already have an account? <a href="#" id="switch-to-login" style="color:#2a7a50;font-weight:600;text-decoration:none;">Log In</a>
        </div>
      `;
      document.getElementById('signup-form').addEventListener('submit', handleSignup);
      document.getElementById('switch-to-login').addEventListener('click', (e) => { e.preventDefault(); openModal('login'); });
    }

    if (type === 'event-register') {
      box.innerHTML = `
        <div style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:#0b2e1f;margin-bottom:4px;">Register for Event</div>
        <div style="font-size:13px;color:rgba(11,30,20,0.55);margin-bottom:24px;" id="event-modal-desc"></div>
        <div id="modal-error" style="display:none;background:#fef2f2;color:#b91c1c;font-size:13px;padding:10px 14px;border-radius:4px;margin-bottom:16px;"></div>
        <div id="modal-success" style="display:none;background:#f0fdf4;color:#166534;font-size:13px;padding:10px 14px;border-radius:4px;margin-bottom:16px;"></div>
        <form id="event-register-form">
          <input type="hidden" name="event_name" />
          <input type="hidden" name="event_date" />
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,30,20,0.5);margin-bottom:6px;">Full Name</label>
          <input type="text" name="name" required placeholder="e.g. Marcus James" value="${currentUser ? escapeAttr(currentUser.name) : ''}" style="width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;border:1px solid rgba(11,30,20,0.15);border-radius:3px;margin-bottom:14px;outline:none;" />
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,30,20,0.5);margin-bottom:6px;">Email</label>
          <input type="email" name="email" required placeholder="you@example.com" value="${currentUser ? escapeAttr(currentUser.email) : ''}" style="width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;border:1px solid rgba(11,30,20,0.15);border-radius:3px;margin-bottom:20px;outline:none;" />
          <button type="submit" style="width:100%;padding:14px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#0b2e1f;background:#90c94a;border:none;border-radius:3px;cursor:pointer;">Register Now</button>
        </form>
      `;
      document.getElementById('event-register-form').addEventListener('submit', handleEventRegister);
    }

    if (type === 'contact') {
      box.innerHTML = `
        <div style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:#0b2e1f;margin-bottom:4px;">Contact Us</div>
        <div style="font-size:13px;color:rgba(11,30,20,0.55);margin-bottom:24px;">We'd love to hear from you</div>
        <div id="modal-error" style="display:none;background:#fef2f2;color:#b91c1c;font-size:13px;padding:10px 14px;border-radius:4px;margin-bottom:16px;"></div>
        <div id="modal-success" style="display:none;background:#f0fdf4;color:#166534;font-size:13px;padding:10px 14px;border-radius:4px;margin-bottom:16px;"></div>
        <form id="contact-form">
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,30,20,0.5);margin-bottom:6px;">Full Name</label>
          <input type="text" name="name" required placeholder="Your name" value="${currentUser ? escapeAttr(currentUser.name) : ''}" style="width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;border:1px solid rgba(11,30,20,0.15);border-radius:3px;margin-bottom:14px;outline:none;" />
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,30,20,0.5);margin-bottom:6px;">Email</label>
          <input type="email" name="email" required placeholder="you@example.com" value="${currentUser ? escapeAttr(currentUser.email) : ''}" style="width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;border:1px solid rgba(11,30,20,0.15);border-radius:3px;margin-bottom:14px;outline:none;" />
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,30,20,0.5);margin-bottom:6px;">Subject</label>
          <input type="text" name="subject" placeholder="What's this about?" style="width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;border:1px solid rgba(11,30,20,0.15);border-radius:3px;margin-bottom:14px;outline:none;" />
          <label style="display:block;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,30,20,0.5);margin-bottom:6px;">Message</label>
          <textarea name="message" required rows="4" placeholder="Your message..." style="width:100%;padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;border:1px solid rgba(11,30,20,0.15);border-radius:3px;margin-bottom:20px;outline:none;resize:vertical;"></textarea>
          <button type="submit" style="width:100%;padding:14px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#fff;background:#0b2e1f;border:none;border-radius:3px;cursor:pointer;">Send Message</button>
        </form>
      `;
      document.getElementById('contact-form').addEventListener('submit', handleContact);
    }
  }

  function closeModal() {
    const overlay = document.getElementById('gng-modal-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  function showModalError(msg) {
    const el = document.getElementById('modal-error');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
    const s = document.getElementById('modal-success');
    if (s) s.style.display = 'none';
  }

  function showModalSuccess(msg) {
    const el = document.getElementById('modal-success');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
    const e = document.getElementById('modal-error');
    if (e) e.style.display = 'none';
  }

  // ── Form Handlers ──
  async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Logging in...';
    btn.disabled = true;

    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: {
          email: form.email.value,
          password: form.password.value,
        },
      });
      currentUser = data.user;
      updateAuthUI();
      closeModal();
    } catch (err) {
      showModalError(err.message);
      btn.textContent = 'Log In';
      btn.disabled = false;
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Creating account...';
    btn.disabled = true;

    try {
      const data = await api('/api/auth/signup', {
        method: 'POST',
        body: {
          name: form.name.value,
          email: form.email.value,
          password: form.password.value,
        },
      });
      currentUser = data.user;
      updateAuthUI();
      closeModal();
    } catch (err) {
      showModalError(err.message);
      btn.textContent = 'Create Account';
      btn.disabled = false;
    }
  }

  async function handleEventRegister(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Registering...';
    btn.disabled = true;

    try {
      await api('/api/register-event', {
        method: 'POST',
        body: {
          name: form.name.value,
          email: form.email.value,
          event_name: form.event_name.value,
          event_date: form.event_date.value,
        },
      });
      showModalSuccess('You\'re registered! We\'ll send confirmation to your email.');
      btn.textContent = 'Registered';
    } catch (err) {
      showModalError(err.message);
      btn.textContent = 'Register Now';
      btn.disabled = false;
    }
  }

  async function handleContact(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      await api('/api/contact', {
        method: 'POST',
        body: {
          name: form.name.value,
          email: form.email.value,
          subject: form.subject.value,
          message: form.message.value,
        },
      });
      showModalSuccess('Message sent! We\'ll get back to you soon.');
      btn.textContent = 'Sent';
    } catch (err) {
      showModalError(err.message);
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }
  }

  // ── Newsletter Subscribe (inline forms) ──
  async function handleSubscribe(form, btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Subscribing...';
    btn.disabled = true;

    // Gather interests from active tags within the form's parent
    const container = form.closest('.newsletter-form') || form.closest('.ss-form') || form.closest('section') || form.parentElement;
    const activeTags = container.querySelectorAll('.nf-tag.active');
    const interests = Array.from(activeTags).map(t => t.textContent.trim());

    const emailInput = form.querySelector('input[type="email"]') || form.querySelector('input[name="email"]');
    const nameInput = form.querySelector('input[type="text"]') || form.querySelector('input[name="name"]');

    try {
      await api('/api/subscribe', {
        method: 'POST',
        body: {
          name: nameInput ? nameInput.value : '',
          email: emailInput.value,
          interests,
        },
      });
      btn.textContent = 'Subscribed!';
      btn.style.background = '#2a7a50';
      btn.style.color = '#fff';
      if (emailInput) emailInput.value = '';
      if (nameInput) nameInput.value = '';
    } catch (err) {
      btn.textContent = originalText;
      btn.disabled = false;
      alert(err.message);
    }
  }

  // ── Utility ──
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ── Init ──
  function init() {
    // Check auth state
    checkAuth();

    // Keyboard: Escape closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Wire up newsletter subscribe buttons (index.html main form)
    const subscribeButtons = document.querySelectorAll('.btn-subscribe');
    subscribeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const form = btn.closest('.newsletter-form') || btn.closest('div');
        handleSubscribe(form, btn);
      });
    });

    // Wire up sidebar subscribe form (newsletter.html)
    const ssBtns = document.querySelectorAll('.ss-btn');
    ssBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const form = btn.closest('.ss-form');
        handleSubscribe(form, btn);
      });
    });

    // Wire up event registration links
    document.querySelectorAll('[data-event-register]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const eventName = link.getAttribute('data-event-name') || 'Event';
        const eventDate = link.getAttribute('data-event-date') || '';
        openModal('event-register');
        const desc = document.getElementById('event-modal-desc');
        if (desc) desc.textContent = eventName + (eventDate ? ' — ' + eventDate : '');
        const form = document.getElementById('event-register-form');
        if (form) {
          form.event_name.value = eventName;
          form.event_date.value = eventDate;
        }
      });
    });

    // Wire up contact links
    document.querySelectorAll('[data-contact]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('contact');
      });
    });
  }

  // Expose for external use
  window.GNG = { openModal, closeModal, checkAuth };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
