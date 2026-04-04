document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile nav ──
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  mobileBtn.addEventListener('click', () => navLinks.classList.toggle('active'));

  // ── Reveal on scroll ──
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add('active'); obs.unobserve(e.target); });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => io.observe(el));

  // ── FAQ ──
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-toggle').addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('active'); i.querySelector('.faq-content').style.maxHeight = null; });
      if (!isActive) { item.classList.add('active'); item.querySelector('.faq-content').style.maxHeight = item.querySelector('.faq-content').scrollHeight + 'px'; }
    });
  });

  // ── Countdown ──
  const target = new Date('2026-04-14T10:00:00+05:30');
  function updateCountdown() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-days').textContent = String(d).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
    document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ── Canvas particles ──
  const canvas = document.getElementById('network-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const mouse = { x: null, y: null };
  window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
  window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', () => { resize(); initParticles(); });

  class P {
    constructor() {
      this.x = this.bx = Math.random() * W;
      this.y = this.by = Math.random() * H;
      this.dx = (Math.random() - 0.5) * 0.4;
      this.dy = (Math.random() - 0.5) * 0.4;
      this.s = Math.random() * 1.5 + 0.5;
      this.density = Math.random() * 25 + 5;
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,178,${Math.random() * 0.4 + 0.4})`; ctx.fill();
    }
    update() {
      if (mouse.x !== null) {
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) { this.x -= (dx/dist) * ((130 - dist) / 130) * this.density; this.y -= (dy/dist) * ((130 - dist) / 130) * this.density; }
        else { this.x += (this.bx - this.x) / 12; this.y += (this.by - this.y) / 12; }
      }
      this.bx += this.dx; this.by += this.dy;
      if (this.bx < 0 || this.bx > W) this.dx *= -1;
      if (this.by < 0 || this.by > H) this.dy *= -1;
      if (mouse.x === null) { this.x = this.bx; this.y = this.by; }
      this.draw();
    }
  }

  function initParticles() { particles = []; const n = (W * H) / 10000; for (let i = 0; i < n; i++) particles.push(new P()); }
  function connect() {
    for (let a = 0; a < particles.length; a++) for (let b = a+1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x, dy = particles[a].y - particles[b].y;
      const d = dx*dx + dy*dy, max = (W/5) * (H/5);
      if (d < max) { ctx.strokeStyle = `rgba(0,255,178,${(1 - d/max) * 0.06})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke(); }
    }
  }
  function animate() { requestAnimationFrame(animate); ctx.clearRect(0,0,W,H); particles.forEach(p => p.update()); connect(); }
  resize(); initParticles(); animate();
});

// ── Timeline toggle (global) ──
function toggleTimeline(item) {
  item.classList.toggle('open');
}

// ── Checklist toggle (global) ──
function toggleCheck(el) {
  el.classList.toggle('checked');
  const card = el.closest('.checklist-card');
  const items = card.querySelectorAll('.check-item');
  const checked = card.querySelectorAll('.check-item.checked').length;
  const total = items.length;
  card.querySelector('.cl-count').textContent = `${checked} / ${total}`;
  card.querySelector('.progress-fill').style.width = `${(checked / total) * 100}%`;
}