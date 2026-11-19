(() => {
  'use strict';

  const WA_NUMBER = '447927521756';
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const form = document.getElementById('bookingForm');
  const feedback = document.getElementById('formFeedback');
  const dateInput = form?.querySelector('[name="date"]');

  // Keep the date picker from accepting a date in the visitor's past.
  if (dateInput) {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    dateInput.min = localDate;
  }

  // Accessible mobile navigation.
  const closeMenu = () => {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Відкрити меню');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Закрити меню' : 'Відкрити меню');
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!nav?.classList.contains('open')) return;
    if (nav.contains(event.target) || menuToggle?.contains(event.target)) return;
    closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Keep the FAQ tidy: at most one answer is open at a time.
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-item').forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const parsed = new Date(`${isoDate}T12:00:00`);
    if (Number.isNaN(parsed.getTime())) return isoDate;
    return new Intl.DateTimeFormat('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(parsed);
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (feedback) feedback.textContent = '';
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const route = String(data.get('route') || '').trim();
    const date = formatDate(String(data.get('date') || '').trim());
    const passengers = String(data.get('passengers') || '').trim();
    const service = String(data.get('service') || '').trim();
    const notes = String(data.get('notes') || '').trim();

    const message = [
      'Вітаю! Хочу залишити заявку на EURO DRIVE.',
      '',
      `Ім’я: ${name}`,
      `Телефон для зв’язку: ${phone}`,
      `Послуга: ${service}`,
      `Напрямок: ${route}`,
      `Бажана дата: ${date}`,
      `Кількість пасажирів: ${passengers}`,
      notes ? `Додаткова інформація: ${notes}` : null,
      '',
      'Будь ласка, повідомте про наявність місць та умови.'
    ].filter(Boolean).join('\n');

    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

    // Create the WhatsApp tab directly from the user gesture. This avoids
    // relying on window.open()'s return value, which can be null with noopener.
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();

    if (feedback) {
      feedback.textContent = 'WhatsApp відкриється з готовою заявкою. Перевірте повідомлення та натисніть «Надіслати». Якщо нова вкладка не відкрилася, скористайтеся кнопкою WhatsApp ще раз.';
    }
  });


  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

// Refined motion system: reveal sections as they enter view, with subtle stagger.
(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealTargets = [
    '.section-heading', '.service-card', '.routes-copy', '.route-card', '.route-note',
    '.fleet-copy', '.fleet-visual', '.comfort-item', '.about-copy', '.about-photo',
    '.about-facts', '.benefits-heading', '.benefit', '.booking-copy', '.booking-form',
    '.trust-copy', '.social-post', '.social-follow-card', '.faq-intro', '.faq-item',
    '.contact-band-inner', '.footer-main > *'
  ];
  const nodes = document.querySelectorAll(revealTargets.join(','));
  if (!nodes.length || motionPreference.matches || !('IntersectionObserver' in window)) return;

  nodes.forEach((node, index) => {
    node.classList.add('reveal');
    if (node.matches('.fleet-copy,.routes-copy,.about-copy,.booking-copy,.trust-copy,.faq-intro')) {
      node.dataset.reveal = 'left';
    } else if (node.matches('.fleet-visual,.about-photo,.booking-form,.social-post,.social-follow-card')) {
      node.dataset.reveal = 'scale';
    }
    const siblings = Array.from(node.parentElement?.children || []).filter(el => el.classList.contains(node.classList[0]) || el.matches(revealTargets.join(',')));
    const siblingIndex = Math.max(0, siblings.indexOf(node));
    node.style.setProperty('--reveal-delay', `${Math.min(siblingIndex * 75, 300)}ms`);
  });

  document.documentElement.classList.add('reveal-ready');
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  nodes.forEach(node => observer.observe(node));

  motionPreference.addEventListener?.('change', event => {
    if (event.matches) {
      document.documentElement.classList.remove('reveal-ready');
      nodes.forEach(node => node.classList.add('is-visible'));
      observer.disconnect();
    }
  });
})();

// Load and play the cinematic hero video only on desktop and only while visible.
(() => {
  const video = document.querySelector('.hero-video');
  if (!video) return;
  const sourceUrl = video.dataset.src;
  const desktop = window.matchMedia('(min-width: 901px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData === true;
  let attached = false;
  let inView = !('IntersectionObserver' in window);

  const canPlay = () => desktop.matches && !reducedMotion.matches && !saveData && inView && !document.hidden;
  const syncVideo = () => {
    if (!desktop.matches || saveData || reducedMotion.matches) {
      video.pause();
      if (attached) {
        video.removeAttribute('src');
        video.load();
        attached = false;
      }
      return;
    }
    if (!attached && sourceUrl) {
      video.src = sourceUrl;
      video.load();
      attached = true;
    }
    if (canPlay()) video.play().catch(() => {});
    else video.pause();
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      syncVideo();
    }, { threshold: 0.05 });
    observer.observe(video);
  }
  syncVideo();
  desktop.addEventListener?.('change', syncVideo);
  reducedMotion.addEventListener?.('change', syncVideo);
  document.addEventListener('visibilitychange', syncVideo);
})();
