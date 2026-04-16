/**
 * main.js — Jacob Britten Portfolio (Rewrite)
 *
 * CHANGES:
 * - Added try/catch around each feature block (error boundaries)
 * - Removed dead hero-bg-video parallax code (element doesn't exist)
 * - Fixed double-observation of bento cards (removed from main observer)
 * - Kept: mobile nav, hero entrance, scroll in-view, navbar shadow, active nav
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── MOBILE NAV ──────────────────────────────────────
  try {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks   = document.getElementById('nav-links');
    let lastFocus;

    if (menuToggle && navLinks) {
      menuToggle.setAttribute('aria-expanded', 'false');

      const openMenu = () => {
        lastFocus = document.activeElement;
        navLinks.classList.add('open');
        menuToggle.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        const first = navLinks.querySelector('a');
        if (first) first.focus();
      };

      const closeMenu = () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
      };

      menuToggle.addEventListener('click', () => {
        navLinks.classList.contains('open') ? closeMenu() : openMenu();
      });

      navLinks.querySelectorAll('a').forEach(link =>
        link.addEventListener('click', closeMenu)
      );

      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
      });

      navLinks.addEventListener('keydown', e => {
        if (e.key !== 'Tab') return;
        const focusable = [...navLinks.querySelectorAll('a, button')];
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (!navLinks.classList.contains('open')) return;
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
      });
    }
  } catch (err) {
    console.warn('Mobile nav init failed:', err);
  }

  // ─── HERO ENTRANCE ─────────────────────────────────
  try {
    const heroEls = document.querySelectorAll('[data-animate]');
    if (heroEls.length) {
      setTimeout(() => {
        heroEls.forEach(el => {
          const delay = (parseInt(el.dataset.delay || '0', 10)) * 80;
          setTimeout(() => el.classList.add('is-visible'), delay);
        });
      }, 80);
    }
  } catch (err) {
    console.warn('Hero entrance init failed:', err);
  }

  // ─── SCROLL IN-VIEW ────────────────────────────────
  // Note: bento cards are excluded here — they have their own stagger observer below
  try {
    const inviewSelectors = [
      '[data-inview]',
      '.stat-bar',
      '.infra-row',
      '.card:not(.bento-card)', // exclude bento from this observer
      '.profile-image',
      '.profile-text',
      '.brief-left',
      '.brief-right',
      '.case',
    ];

    const allInview = document.querySelectorAll(inviewSelectors.join(', '));

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      );
      allInview.forEach(el => observer.observe(el));
    } else {
      allInview.forEach(el => el.classList.add('is-visible'));
    }
  } catch (err) {
    console.warn('Scroll in-view init failed:', err);
  }

  // ─── STAGGER BENTO CARDS (dedicated observer) ──────
  try {
    const bentoCards = document.querySelectorAll('.bento-card');
    if ('IntersectionObserver' in window && bentoCards.length) {
      const bentoObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const siblings = [...entry.target.parentElement.children];
              const idx = siblings.indexOf(entry.target);
              setTimeout(() => entry.target.classList.add('is-visible'), idx * 80);
              bentoObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      bentoCards.forEach(card => {
        card.classList.remove('is-visible');
        bentoObs.observe(card);
      });
    }
  } catch (err) {
    console.warn('Bento stagger init failed:', err);
  }

  // ─── NAVBAR SCROLL SHADOW ──────────────────────────
  try {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      const onScroll = () => {
        if (window.scrollY > 40) {
          navbar.style.background = 'rgba(11,13,20,0.97)';
          navbar.style.borderBottomColor = 'rgba(0,255,200,0.1)';
        } else {
          navbar.style.background = 'rgba(11,13,20,0.88)';
          navbar.style.borderBottomColor = 'rgba(255,255,255,0.08)';
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  } catch (err) {
    console.warn('Navbar scroll init failed:', err);
  }

  // ─── ACTIVE NAV HIGHLIGHT ──────────────────────────
  try {
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    const highlightNav = () => {
      const scrollY = window.scrollY + 120;
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
          if (scrollY >= top && scrollY < top + height) {
            navAnchors.forEach(a => a.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();
  } catch (err) {
    console.warn('Active nav highlight init failed:', err);
  }

});
