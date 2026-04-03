/* ═══════════════════════════════════════════
   CAREERSEED – SCRIPT.JS
   Interactions: Navbar, Carousel, FAQ,
   Scroll animations, Particles, Video modal
═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Navbar scroll ─── */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    scrollTopBtn.classList.toggle('visible', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Mobile hamburger ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ─── Scroll to top ─── */
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── Scroll reveal (IntersectionObserver) ─── */
  const fadeEls = document.querySelectorAll('.fade-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => revealObserver.observe(el));

  /* ─── Carousel ─── */
  const track       = document.getElementById('carouselTrack');
  const prevBtn     = document.getElementById('carouselPrev');
  const nextBtn     = document.getElementById('carouselNext');
  const dotsWrap    = document.getElementById('carouselDots');
  const labelEl     = document.getElementById('carouselLabel');
  const slides      = track ? Array.from(track.querySelectorAll('.carousel-slide')) : [];
  let currentSlide  = 0;
  let autoInterval  = null;

  if (slides.length) {
    // Build dots
    slides.forEach((sl, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function updateCarousel() {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dotsWrap.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
      if (labelEl) labelEl.textContent = slides[currentSlide].dataset.label || '';
    }

    function goTo(idx) {
      currentSlide = (idx + slides.length) % slides.length;
      updateCarousel();
    }

    prevBtn.addEventListener('click', () => { goTo(currentSlide - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { goTo(currentSlide + 1); resetAuto(); });

    function startAuto() {
      autoInterval = setInterval(() => goTo(currentSlide + 1), 4500);
    }
    function resetAuto() {
      clearInterval(autoInterval);
      startAuto();
    }

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(currentSlide + (diff > 0 ? 1 : -1));
      resetAuto();
    });

    updateCarousel();
    startAuto();
  }

  /* ─── FAQ accordion ─── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-answer').style.maxHeight = '0';
        fi.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ─── Dark Mode Toggle ─── */
  const darkToggle = document.getElementById('darkToggle');
  const body = document.body;

  function updateThemeImages() {
    const isDark = body.classList.contains('dark-mode');
    document.querySelectorAll('.theme-image').forEach(img => {
      if (isDark && img.dataset.darkSrc) {
        img.src = img.dataset.darkSrc;
      } else if (!isDark && img.dataset.lightSrc) {
        img.src = img.dataset.lightSrc;
      }
    });
  }

  if(darkToggle) {
    if (localStorage.getItem('theme') === 'dark') {
      body.classList.add('dark-mode');
    }
    updateThemeImages();
    darkToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
      updateThemeImages();
    });
  }

  /* ─── Video playback & Volume Toggle ─── */
  const demoVideo = document.getElementById('demoVideo');
  const muteToggleBtn = document.getElementById('muteToggleBtn');
  const iconMuted = document.getElementById('icon-muted');
  const iconUnmuted = document.getElementById('icon-unmuted');

  if (demoVideo && muteToggleBtn) {
    muteToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      demoVideo.muted = !demoVideo.muted;
      if (demoVideo.muted) {
        iconMuted.style.display = 'block';
        iconUnmuted.style.display = 'none';
      } else {
        iconMuted.style.display = 'none';
        iconUnmuted.style.display = 'block';
      }
    });
  }

  /* ─── Hero particles ─── */
  function spawnParticles(containerId, count) {
    const container = document.getElementById(containerId);
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      const colors = ['rgba(79,70,229,.6)', 'rgba(124,58,237,.5)', 'rgba(6,182,212,.5)', 'rgba(255,255,255,.4)'];
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration:${Math.random() * 12 + 8}s;
        animation-delay:${Math.random() * 8}s;
      `;
      container.appendChild(p);
    }
  }
  spawnParticles('heroParticles', 30);
  spawnParticles('ctaParticles', 20);

  /* ─── Smooth active nav link highlight ─── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function highlightNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navAnchors.forEach(a => {
      a.style.opacity = a.getAttribute('href') === '#' + current ? '1' : '';
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ─── Number counter animation ─── */
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const suffix = el.dataset.suffix || '';
    const interval = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = start + suffix;
      if (start >= target) clearInterval(interval);
    }, 16);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        const txt = el.textContent.trim();
        const num = parseInt(txt.replace(/\D/g, ''));
        const suffix = txt.replace(/\d/g, '');
        el.dataset.suffix = suffix;
        animateCounter(el, num, 1500);
      });
      statsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ─── Typing effect for hero title accent ─── */
  const phrases = [
    "grâce à l'Intelligence Artificielle",
    "avec un CV optimisé ATS",
    "grâce au matching intelligent",
    "via la simulation d'entretien"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  const typingTarget = document.querySelector('.hero-title .gradient-text');

  function typeLoop() {
    if (!typingTarget) return;
    const current = phrases[phraseIndex];
    if (isDeleting) {
      charIndex--;
      typingTarget.textContent = current.slice(0, charIndex);
    } else {
      charIndex++;
      typingTarget.textContent = current.slice(0, charIndex);
    }
    let delay = isDeleting ? 40 : 70;
    if (!isDeleting && charIndex === current.length) {
      delay = 2500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }
    typingTimeout = setTimeout(typeLoop, delay);
  }
  // Start typing after a short delay
  setTimeout(typeLoop, 1200);

  /* ─── Feature card hover glow ─── */
  document.querySelectorAll('.feature-card, .advantage-card, .step-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  /* ─── Testimonial card tilt ─── */
  document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── Progress bar animation (gallery slide 5) ─── */
  const progressObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.sp-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            bar.style.transition = 'width 1.2s cubic-bezier(.4,0,.2,1)';
            bar.style.width = w;
          });
        });
      });
      progressObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.progress-mockup').forEach(el => progressObserver.observe(el));

})();
