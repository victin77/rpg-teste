// Minimal JS: menu toggle, smooth scroll, subtle parallax
(() => {
  const btn = document.querySelector('.hamburger');
  const menu = document.getElementById('menu');
  const bg = document.querySelector('.bg');
  const year = document.getElementById('year');

  year.textContent = new Date().getFullYear();

  function setOpen(open){
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
  }

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });

  // Close if clicking outside
  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('open')) return;
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    setOpen(false);
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Subtle parallax on background (very slight)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      const offset = Math.min(18, y * 0.03);
      bg.style.transform = `translate3d(0, ${-offset}px, 0) scale(1.02)`;
      ticking = false;
    });
  }, { passive: true });
})();
