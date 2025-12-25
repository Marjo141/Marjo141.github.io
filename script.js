// script.js
const homePhoto = document.querySelector(".home-photo img");

const originalSrc = "oten.jpg";
const hoverSrc = "gwapo.jpg";  

homePhoto.addEventListener("mouseenter", () => {
  homePhoto.src = hoverSrc;
});

homePhoto.addEventListener("mouseleave", () => {
  homePhoto.src = originalSrc;
});
 
(() => {
  // Elements
  const themeToggle = document.getElementById('theme-toggle');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('nav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const yearEl = document.getElementById('year');

  // Set current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();
 
  const THEME_KEY = 'portfolio_theme';
  const body = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      body.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
    } else {
      body.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
    }
    localStorage.setItem(THEME_KEY, theme);
  }
 
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    applyTheme(saved);
  } else { 
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
 
  mobileMenuToggle.addEventListener('click', () => {
    if (nav.style.display === 'flex' || nav.style.display === '') {
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.background = 'var(--glass)';
      nav.style.position = 'absolute';
      nav.style.right = '1rem';
      nav.style.top = '64px';
      nav.style.padding = '0.6rem';
      nav.style.borderRadius = '8px';
    } else {
      nav.style.display = 'flex';
    }
  });
 
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth < 700) nav.style.display = 'none';
    });
  });
 
  const sections = navLinks.map(l => document.querySelector(l.getAttribute('href')));
  function onScroll() {
    const scrollPos = window.scrollY + (window.innerHeight / 3);
    sections.forEach((sec, idx) => {
      if (!sec) return;
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(x => x.classList.remove('active'));
        navLinks[idx].classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', onScroll);
 
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        status.textContent = 'Please fill in all fields.';
        return;
      }
 
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        return;
      }
 
const mailto = `mailto:jomarpermangil29@gmail.com?subject=${encodeURIComponent('Portfolio message from ' + name)}&body=${encodeURIComponent(message + '\n\nContact: ' + email)}`;

status.textContent = 'Opening your email client...';
window.location.href = mailto; 
    });
  }

})();