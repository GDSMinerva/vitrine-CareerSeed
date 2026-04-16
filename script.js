/* ═══════════════════════════════════════════
   CAREERSEED – SCRIPT.JS
   Navbar · Dark mode · Scroll reveal
   FAQ accordion · Typing effect · Scroll-top
═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────
     NAVBAR — scroll state
  ───────────────────────────── */
  const navbar     = document.getElementById('navbar');
  const scrollTop  = document.getElementById('scrollTop');

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    scrollTop.classList.toggle('visible', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ─────────────────────────────
     NAVBAR — mobile hamburger
  ───────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

  // Close menu when any nav link is clicked
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ─────────────────────────────
     SCROLL TO TOP
  ───────────────────────────── */
  scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─────────────────────────────
     SCROLL REVEAL
  ───────────────────────────── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay ?? 0);
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  /* ─────────────────────────────
     DARK MODE
  ───────────────────────────── */
  const darkToggle = document.getElementById('darkToggle');
  const body       = document.body;

  function applyThemeImages(isDark) {
    document.querySelectorAll('.theme-image').forEach(img => {
      const src = isDark ? img.dataset.darkSrc : img.dataset.lightSrc;
      if (src) img.src = src;
    });
  }

  // Restore saved preference
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
  }
  applyThemeImages(body.classList.contains('dark-mode'));

  darkToggle?.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyThemeImages(isDark);
  });

  /* ─────────────────────────────
     FAQ ACCORDION
  ───────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all items
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-answer').style.maxHeight = '0';
        fi.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked item if it was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ─────────────────────────────
     TYPING EFFECT — hero subtitle
  ───────────────────────────── */
  const typingTarget = document.getElementById('typingTarget');
  const phrases = [
    "grâce à l'IA",
    "avec un CV optimisé ATS",
    "via le matching intelligent",
    "grâce à la simulation d'entretien"
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  function typeLoop() {
    if (!typingTarget) return;

    const current = phrases[phraseIndex];
    typingTarget.textContent = isDeleting
      ? current.slice(0, --charIndex)
      : current.slice(0, ++charIndex);

    let delay = isDeleting ? 35 : 65;

    if (!isDeleting && charIndex === current.length) {
      delay      = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting  = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay       = 400;
    }

    setTimeout(typeLoop, delay);
  }

  // Start after a brief delay so the page has settled
  setTimeout(typeLoop, 1000);

  /* ─────────────────────────────
     COUNTER ANIMATION — hero stats
  ───────────────────────────── */
  function animateCounter(el, target, duration) {
    const suffix = el.dataset.suffix ?? '';
    const step   = Math.ceil(target / (duration / 16));
    let   value  = 0;

    const tick = setInterval(() => {
      value = Math.min(value + step, target);
      el.textContent = value + suffix;
      if (value >= target) clearInterval(tick);
    }, 16);
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      statsSection.querySelectorAll('.stat-number').forEach(el => {
        const raw    = el.textContent.trim();
        const num    = parseInt(raw.replace(/\D/g, ''));
        const suffix = raw.replace(/\d/g, '');
        el.dataset.suffix = suffix;
        animateCounter(el, num, 1400);
      });
      statsObserver.disconnect();
    }, { threshold: 0.6 });

    statsObserver.observe(statsSection);
  }

  /* ─────────────────────────────
     ACTIVE NAV HIGHLIGHT
  ───────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAnchors.forEach(a => {
      const isActive = a.getAttribute('href') === '#' + current;
      a.style.color  = isActive ? 'var(--primary)' : '';
    });
  }

  /* ─────────────────────────────
     FEATURE VIDEOS — hover to play / leave to pause
     On touch devices: tap overlay to play, tap video to pause
  ───────────────────────────── */
  document.querySelectorAll('.video-player').forEach(player => {
    const video   = player.querySelector('.feature-video');
    const overlay = player.querySelector('.video-overlay');

    function startPlay() {
      video.play().then(() => {
        player.classList.add('playing');
      }).catch(() => {
        // Browser blocked autoplay — silently ignore
      });
    }

    function stopPlay() {
      video.pause();
      video.currentTime = 0;
      player.classList.remove('playing');
    }

    // Desktop: hover
    player.addEventListener('mouseenter', startPlay);
    player.addEventListener('mouseleave', stopPlay);

    // Mobile / touch: tap overlay to play, tap video to pause
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      startPlay();
    });
    video.addEventListener('click', stopPlay);

    // When video ends, reset to poster
    video.addEventListener('ended', () => {
      player.classList.remove('playing');
    });
  });
  /* Add this inside your IIFE in script.js */

// 1. Mouse-move Parallax for Hero Pills
document.addEventListener('mousemove', (e) => {
  const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
  const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
  
  document.querySelectorAll('.float-pill').forEach((pill, index) => {
    const factor = (index + 1) * 1.5;
    pill.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
  });
});

// 2. Button Magnetic Effect
const btns = document.querySelectorAll('.btn-primary');
btns.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = `translate(0, 0)`;
  });
});

})();