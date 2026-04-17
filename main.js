document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  initVideoModal();
  initContactForm();
});

function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!menuToggle || !navLinks) {
    return;
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initScrollReveal() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('.section, .project-card, .metric-card, .testimonial-card, .stack-card');

  if (!revealTargets.length) {
    return;
  }

  if (reduced || !('IntersectionObserver' in window)) {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealTargets.forEach((target) => observer.observe(target));
}

function initVideoModal() {
  const openBtn = document.getElementById('open-video');
  const closeBtn = document.getElementById('close-video');
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('demo-video');

  if (!openBtn || !closeBtn || !modal || !video) {
    return;
  }

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    video.pause();
  };

  openBtn.addEventListener('click', () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    video.play().catch(() => {
      // Browser policy may block autoplay; controls are available for manual start.
    });
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form || !feedback) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      feedback.textContent = 'Please fill out all required fields.';
      feedback.className = 'error';
      return;
    }

    feedback.textContent = 'Sending...';
    feedback.className = 'pending';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({ ok: false }));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Request failed');
      }

      feedback.textContent = 'Message sent. Thanks, I will reply shortly.';
      feedback.className = 'success';
      form.reset();
    } catch (error) {
      feedback.textContent = 'Unable to send right now. Please email directly at jacob@jacobbritten.com.';
      feedback.className = 'error';
      console.error('Contact form error:', error);
    }
  });
}
