/* ==========================================================================
   AURELISSE — script.js
   Vanilla JS: scroll reveal, nav, tilt 3D, botones magnéticos
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. NAV: fondo al hacer scroll + menú móvil
  ------------------------------------------------------------------ */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const handleNavScroll = () => {
    if (window.scrollY > 24) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  };
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Cierra el menú móvil al elegir una opción
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------
     2. SCROLL REVEAL — Intersection Observer con retraso escalonado
  ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal-up');

  // Asigna el índice de retraso (staggered) según su posición dentro del
  // mismo contenedor padre, salvo que el propio elemento indique data-delay.
  const groups = new Map();
  revealEls.forEach((el) => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, 0);
  });

  revealEls.forEach((el) => {
    if (el.hasAttribute('data-delay')) {
      el.style.setProperty('--stagger', el.getAttribute('data-delay'));
    }
  });

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Sin soporte de IntersectionObserver, o el usuario prefiere menos
    // movimiento: mostrar todo directamente.
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------
     3. TILT 3D en tarjetas de producto
  ------------------------------------------------------------------ */
  if (!prefersReducedMotion) {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    const MAX_TILT = 8;

    tiltCards.forEach((card) => {
      let frame = null;

      const handleMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = x / rect.width - 0.5;
        const py = y / rect.height - 0.5;

        const rotateY = px * MAX_TILT * 2;
        const rotateX = -py * MAX_TILT * 2;

        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          card.style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
      };

      const reset = () => {
        if (frame) cancelAnimationFrame(frame);
        card.style.transform = 'rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', reset);
      card.addEventListener('touchstart', () => reset(), { passive: true });
    });
  }

  /* ------------------------------------------------------------------
     4. BOTONES MAGNÉTICOS
  ------------------------------------------------------------------ */
  if (!prefersReducedMotion) {
    const magneticEls = document.querySelectorAll('[data-magnetic]');
    const STRENGTH = 0.35;

    magneticEls.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ------------------------------------------------------------------
     5. RESPLANDOR DEL HERO — sigue sutilmente al cursor
  ------------------------------------------------------------------ */
  const heroGlow = document.getElementById('heroGlow');
  const hero = document.getElementById('top');

  if (heroGlow && hero && !prefersReducedMotion && window.matchMedia('(min-width: 780px)').matches) {
    let glowFrame = null;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 60;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 60;

      if (glowFrame) cancelAnimationFrame(glowFrame);
      glowFrame = requestAnimationFrame(() => {
        heroGlow.style.transform = `translate(calc(-50% + ${x}px), calc(-20% + ${y}px))`;
      });
    });
  }

  /* ------------------------------------------------------------------
     6. SCROLL SUAVE para enlaces internos (respeta el header fijo)
  ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;

      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  });

});
