// Highlight the active nav link based on which section is in view
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.topnav a');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
});

// Ensure resume download links work: verify `resume.pdf` exists before download
document.addEventListener('click', async (e) => {
  const anchor = e.target.closest('a[href]');
  if (!anchor) return;
  const href = anchor.getAttribute('href') || '';
  // Only target links that point to resume.pdf
  if (!href.split('?')[0].toLowerCase().endsWith('resume.pdf')) return;

  // Make sure the anchor has a download attribute
  if (!anchor.hasAttribute('download')) anchor.setAttribute('download', 'resume.pdf');

  // Try to verify the file exists via HEAD; fall back to GET if HEAD fails
  try {
    const head = await fetch(href, { method: 'HEAD' });
    if (head.ok) return; // file exists — allow default behavior
    e.preventDefault();
    alert('Resume not found. Please upload a file named resume.pdf into this folder.');
  } catch (err) {
    // HEAD may fail on file:// or due to CORS — try a GET as a best-effort check
    try {
      const get = await fetch(href);
      if (get.ok) return; // file exists
      e.preventDefault();
      alert('Resume not found. Please upload a file named resume.pdf into this folder.');
    } catch (err2) {
      // Unable to verify (e.g., file:// or network error) — allow default behavior
      return;
    }
  }
});

  // Theme toggle: persist user's choice and respect system preference
  (function() {
    const toggle = document.getElementById('theme-toggle');
    const themeIcon = toggle ? toggle.querySelector('.theme-icon') : null;
    const storageKey = 'site-theme';

    const applyTheme = (theme) => {
      if (theme === 'dark') document.body.classList.add('dark-theme');
      else document.body.classList.remove('dark-theme');
      if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
      if (toggle) toggle.setAttribute('aria-pressed', theme === 'dark');
    };

    const getStored = () => localStorage.getItem(storageKey);

    // initial: stored preference -> system -> default light
    let theme = getStored();
    if (!theme) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    applyTheme(theme);

    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const current = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(storageKey, next);
      applyTheme(next);
    });
  })();

  // Reveal and skill animations: add 'reveal' class, observe visibility, and animate skill bars
  document.addEventListener('DOMContentLoaded', () => {
    // Elements to reveal
    const revealEls = document.querySelectorAll('main .section, .project-card, .cert-card, .about-illustration, .sidebar-top');
    revealEls.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));

    // Animate skill bars: derive width from the visible percentage text and animate when #skills is visible
    const fills = document.querySelectorAll('.skill-fill');
    const skillsSection = document.getElementById('skills');

    const animateFills = () => {
      fills.forEach((fill, i) => {
        let target = '';
        const row = fill.closest('.skill-row');
        if (row) {
          const pctEl = row.querySelector('.skill-pct');
          if (pctEl) {
            const m = pctEl.textContent.match(/(\d{1,3})/);
            if (m) target = m[1] + '%';
          }
        }

        // fallback to inline style if no pct text found
        if (!target) {
          const inline = fill.getAttribute('style') || '';
          const mm = inline.match(/width\s*:\s*([^;]+)/i);
          if (mm) target = mm[1].trim();
        }

        fill.style.width = '0';
        const delay = 200 + i * 80;
        setTimeout(() => {
          if (target) fill.style.width = target;
        }, delay);
      });
    };

    if (skillsSection) {
      const skillsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateFills();
            obs.disconnect();
          }
        });
      }, { threshold: 0.25 });
      skillsObserver.observe(skillsSection);
    } else {
      // fallback: animate immediately
      animateFills();
    }
  });

  // Mobile sidebar toggle (hamburger) — create overlay and toggle body class
  (function() {
    const BODY_CLASS = 'sidebar-open';
    const toggle = document.getElementById('nav-toggle');
    if (!toggle) return;

    // ensure overlay element exists
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);
    }

    const setOpen = (open) => {
      document.body.classList.toggle(BODY_CLASS, open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      // when open, prevent page scroll on mobile
      document.documentElement.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => setOpen(!document.body.classList.contains(BODY_CLASS)));

    overlay.addEventListener('click', () => setOpen(false));

    // close with Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains(BODY_CLASS)) setOpen(false);
    });
  })();

   