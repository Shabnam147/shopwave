(function () {
  'use strict';

  /* =====================================================
     Mobile navigation
     ===================================================== */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* =====================================================
     Hero terminal — single orchestrated type-on sequence
     ===================================================== */
  var terminalBody = document.getElementById('terminalBody');

  if (terminalBody && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var lines = [
      { type: 'cmd', text: 'shopwave diagnose --site my-business.com' },
      { type: 'out', text: '✓ SSL valid   ✓ Mobile responsive   ✗ 3 broken links' },
      { type: 'cmd', text: 'shopwave automate --task rename-invoices' },
      { type: 'out', text: '✓ 214 files organized in 4.2s' },
      { type: 'cmd', text: 'shopwave quote --service "landing page"' },
      { type: 'out', text: '→ Starting from ₹1,499' }
    ];

    var lineIndex = 0;
    var charIndex = 0;
    var currentEl = null;

    function typeNext() {
      if (lineIndex >= lines.length) {
        var cursor = document.createElement('span');
        cursor.className = 'terminal__cursor';
        terminalBody.appendChild(cursor);
        return;
      }

      var line = lines[lineIndex];

      if (charIndex === 0) {
        currentEl = document.createElement('div');
        currentEl.className = 'terminal__line';
        if (line.type === 'cmd') {
          var prompt = document.createElement('span');
          prompt.className = 'terminal__prompt';
          prompt.textContent = '$ ';
          currentEl.appendChild(prompt);
        } else {
          currentEl.classList.add('terminal__out');
        }
        terminalBody.appendChild(currentEl);
      }

      if (charIndex < line.text.length) {
        currentEl.appendChild(document.createTextNode(line.text.charAt(charIndex)));
        charIndex++;
        setTimeout(typeNext, line.type === 'cmd' ? 26 : 10);
      } else {
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNext, line.type === 'cmd' ? 260 : 420);
      }
    }

    setTimeout(typeNext, 450);
  } else if (terminalBody) {
    // Reduced motion: render final state instantly, no animation.
    terminalBody.innerHTML =
      '<div class="terminal__line"><span class="terminal__prompt">$ </span>shopwave quote --service "landing page"</div>' +
      '<div class="terminal__line terminal__out">→ Starting from ₹1,499</div>';
  }

  /* =====================================================
     FAQ accordion
     ===================================================== */
  var faqButtons = document.querySelectorAll('.faq-item__q');

  faqButtons.forEach(function (btn) {
    var answer = btn.nextElementSibling;

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      faqButtons.forEach(function (otherBtn) {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherBtn.nextElementSibling.style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
    });
  });

  /* =====================================================
     Portfolio filtering
     ===================================================== */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var portfolioCards = document.querySelectorAll('.portfolio-card');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      filterButtons.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      portfolioCards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.hidden = !match;
      });
    });
  });

  /* =====================================================
     Portfolio "View Project" — inline detail panel
     (No real project pages exist yet, so this expands
     an honest detail note rather than linking nowhere.)
     ===================================================== */
  var projectDetails = {
    web1: 'This is a concept layout showing how a 5-page local business site could be structured: Home, Services, About, Gallery, and Contact — built mobile-first with a simple content-managed structure in mind.',
    web2: 'A single-page layout focused on one product or offer, with one clear call to action, fast load times, and a short form to capture interest.',
    python1: 'A concept script that watches a folder, detects file type, and sorts files into dated subfolders automatically — the kind of small automation that saves a few minutes every day.',
    it1: 'A walkthrough of setting up a fresh Linux server: user accounts, SSH key access, firewall basics, and automatic security updates.',
    security1: 'An example review covering HTTPS configuration, exposed admin pages, outdated software versions, and basic header hardening for a small website.'
  };

  document.querySelectorAll('.portfolio-card__view').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.portfolio-card');
      var existing = card.querySelector('.portfolio-card__detail');

      if (existing) {
        existing.remove();
        btn.textContent = 'View Project';
        return;
      }

      // Close any other open detail panel first.
      document.querySelectorAll('.portfolio-card__detail').forEach(function (el) {
        var openCard = el.closest('.portfolio-card');
        el.remove();
        var openBtn = openCard.querySelector('.portfolio-card__view');
        if (openBtn) openBtn.textContent = 'View Project';
      });

      var key = btn.getAttribute('data-view');
      var detail = document.createElement('p');
      detail.className = 'portfolio-card__detail';
      detail.style.margin = '0 24px 20px';
      detail.style.fontSize = '0.88rem';
      detail.style.color = 'var(--ink-600)';
      detail.style.borderTop = '1px solid var(--line)';
      detail.style.paddingTop = '14px';
      detail.textContent = projectDetails[key] || 'More detail coming soon.';

      btn.insertAdjacentElement('beforebegin', detail);
      btn.textContent = 'Hide Details';
    });
  });

  /* =====================================================
     3D tilt-on-hover for cards (skipped for reduced motion)
     ===================================================== */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducedMotion) {
    var tiltSelectors = '.service-card, .package-card, .who-card, .why-card, .portfolio-card';
    var tiltMax = 7; // degrees — kept subtle for a professional feel

    document.querySelectorAll(tiltSelectors).forEach(function (card) {
      card.classList.add('tilt-card');

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotateY = (x - 0.5) * tiltMax;
        var rotateX = (0.5 - y) * tiltMax;

        card.style.transform =
          'perspective(800px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-4px)';
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });

    // The terminal panel gets a lighter tilt so it feels like it's
    // floating in front of the 3D scene behind it.
    var terminalPanel = document.getElementById('terminalPanel');
    var heroVisual = document.getElementById('heroVisual');

    if (terminalPanel && heroVisual) {
      heroVisual.addEventListener('mousemove', function (e) {
        var rect = heroVisual.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotateY = (x - 0.5) * 10;
        var rotateX = (0.5 - y) * 8;
        terminalPanel.style.transform =
          'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg)';
      });
      heroVisual.addEventListener('mouseleave', function () {
        terminalPanel.style.transform = '';
      });
    }

    // Soft parallax on background glow blobs as the page scrolls —
    // one restrained depth cue rather than motion on every section.
    var blobs = document.querySelectorAll('.glow-blob');
    if (blobs.length) {
      var ticking = false;
      function updateBlobs() {
        var scrollY = window.scrollY;
        blobs.forEach(function (blob) {
          var speed = parseFloat(blob.getAttribute('data-speed')) || 0.15;
          blob.style.transform = 'translateY(' + (scrollY * speed * -0.3) + 'px)';
        });
        ticking = false;
      }
      window.addEventListener('scroll', function () {
        if (!ticking) {
          requestAnimationFrame(updateBlobs);
          ticking = true;
        }
      }, { passive: true });
      updateBlobs();
    }
  }

  /* =====================================================
     Contact form validation
     ===================================================== */
  var form = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  function showError(fieldId, show) {
    var field = document.getElementById(fieldId);
    var wrapper = field.closest('.form-field');
    wrapper.classList.toggle('is-invalid', show);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var phone = document.getElementById('phone');
      var service = document.getElementById('service');
      var budget = document.getElementById('budget');
      var details = document.getElementById('details');

      var valid = true;

      var nameOk = name.value.trim().length > 1;
      showError('name', !nameOk);
      valid = valid && nameOk;

      var emailOk = isValidEmail(email.value.trim());
      showError('email', !emailOk);
      valid = valid && emailOk;

      var phoneOk = phone.value.trim().length >= 7;
      showError('phone', !phoneOk);
      valid = valid && phoneOk;

      var serviceOk = service.value !== '';
      showError('service', !serviceOk);
      valid = valid && serviceOk;

      var budgetOk = budget.value !== '';
      showError('budget', !budgetOk);
      valid = valid && budgetOk;

      var detailsOk = details.value.trim().length > 9;
      showError('details', !detailsOk);
      valid = valid && detailsOk;

      if (!valid) {
        formStatus.textContent = 'Please fix the highlighted fields and try again.';
        formStatus.classList.remove('is-success');
        var firstInvalid = form.querySelector('.is-invalid input, .is-invalid select, .is-invalid textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // No backend is connected yet, so we clearly communicate that
      // rather than pretending the message was sent somewhere.
      formStatus.textContent = 'Thanks — your details look good. Since this demo site isn\u2019t connected to a live inbox yet, please also reach out via WhatsApp or email below to send this request.';
      formStatus.classList.add('is-success');
      form.reset();
    });

    // Clear individual field errors as the user fixes them.
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.closest('.form-field').classList.remove('is-invalid');
      });
      field.addEventListener('change', function () {
        field.closest('.form-field').classList.remove('is-invalid');
      });
    });
  }

  /* =====================================================
     WhatsApp / Email placeholder links
     ===================================================== */
  ['whatsappLink', 'emailLink'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', function (e) {
      e.preventDefault();
      formStatus && (formStatus.textContent = '');
      alert('This contact channel is a placeholder. ShopWave\u2019s WhatsApp number and email will be added here once available — please use the form for now.');
    });
  });

})();
