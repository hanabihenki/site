/* =========================================================
   Global script — safe for all pages
   - SPA nav only for hash/data-page links
   - Sparkles (guarded)
   - Lightbox: event delegation so images always open
   ========================================================= */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSparkles();
    initLightbox();      // <— main fix: delegated click handling
    initFloatIn();
    hardenExternalLinks();
  });

  /* ===========================
     NAVIGATION (SPA guard)
     =========================== */
  function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href') || '';
        const hasDataPage = link.hasAttribute('data-page');
        const isHashLink = href.startsWith('#');

        // Let real .html pages navigate normally
        if (!hasDataPage && !isHashLink) {
          return;
        }

        // SPA mode for data-page / hash
        e.preventDefault();

        const targetPage = hasDataPage ? link.getAttribute('data-page') : href.slice(1);
        const pages = document.querySelectorAll('.page');

        document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
        link.classList.add('active');

        if (pages.length && targetPage) {
          pages.forEach(p => p.classList.remove('active'));
          const targetEl = document.getElementById(targetPage);
          if (targetEl) {
            targetEl.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      });
    });
  }

  /* ===========================
     SPARKLES (guarded)
     =========================== */
  function initSparkles() {
    const sparkleContainer = document.querySelector('.sparkle-container');
    if (!sparkleContainer) return;

    let lastSparkleTime = 0;
    const sparkleDelay = 50;

    document.addEventListener('mousemove', function (e) {
      const now = Date.now();
      if (now - lastSparkleTime > sparkleDelay) {
        createSparkle(e.clientX, e.clientY);
        lastSparkleTime = now;
      }
    });

    function createSparkle(x, y) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';

      const colors = [
        'rgba(255,179,217,0.8)',
        'rgba(212,165,255,0.8)',
        'rgba(168,216,255,0.8)',
        'rgba(255,244,168,0.8)',
        'rgba(196,255,179,0.8)',
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      sparkle.style.left = x + 'px';
      sparkle.style.top = y + 'px';

      const styleShim = document.createElement('style');
      styleShim.textContent = `
        .sparkle:last-child::before,
        .sparkle:last-child::after {
          background: radial-gradient(circle, ${randomColor} 0%, transparent 100%);
        }
      `;
      document.head.appendChild(styleShim);

      sparkleContainer.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
        styleShim.remove();
      }, 1500);
    }

    setInterval(() => {
      if (sparkleContainer.children.length > 50) {
        Array.from(sparkleContainer.children).slice(0, 10).forEach(s => s.remove());
      }
    }, 2000);
  }

  /* =====================================================
     LIGHTBOX (delegated)
     - Works even if the grid is replaced/loaded later
     - Uses data-image OR falls back to <img src>
     - Prev/Next stay consistent across aspect ratios
     ===================================================== */
  function initLightbox() {
    ensureLightboxMarkup(); // inject if not present (uses your existing IDs/classes)

    const lightbox = document.getElementById('lightbox');
    const lbImg   = document.getElementById('lightbox-image');
    const btnPrev = document.querySelector('.lightbox-prev');
    const btnNext = document.querySelector('.lightbox-next');
    const btnClose= document.querySelector('.lightbox-close');

    if (!lightbox || !lbImg) return;

    let currentItems = [];
    let currentIndex = 0;

    // Delegated click: open when clicking a .gallery-item (not .placeholder)
    document.addEventListener('click', function (e) {
      const item = e.target.closest('.gallery-item:not(.placeholder)');
      if (!item) return;

      // Determine the "group" (currentItems): prefer the nearest grid
      const grid = item.closest('.gallery-grid');
      if (grid) {
        currentItems = Array.from(grid.querySelectorAll('.gallery-item:not(.placeholder)'));
      } else {
        // Fallback: all visible items in the active page, or document
        const active = document.querySelector('.page.active') || document;
        currentItems = Array.from(active.querySelectorAll('.gallery-item:not(.placeholder)'));
      }

      currentIndex = Math.max(0, currentItems.indexOf(item));
      const src = item.getAttribute('data-image') ||
                  item.querySelector('img')?.getAttribute('src');

      if (src) {
        openLightbox(src);
      }
    });

    // Controls
    if (btnClose) btnClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    if (btnPrev) btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate(-1);
    });
    if (btnNext) btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate(1);
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    function openLightbox(src) {
      lbImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigate(step) {
      if (!currentItems.length) return;
      currentIndex = (currentIndex + step + currentItems.length) % currentItems.length;
      const nextSrc = currentItems[currentIndex].getAttribute('data-image') ||
                      currentItems[currentIndex].querySelector('img')?.getAttribute('src');
      if (nextSrc) lbImg.src = nextSrc;
    }
  }

  // If your HTML already includes the lightbox, this does nothing.
  function ensureLightboxMarkup() {
    if (document.getElementById('lightbox')) return;

    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.innerHTML = `
      <div class="lightbox-content">
        <span class="lightbox-close" aria-label="Close">&times;</span>
        <img id="lightbox-image" alt="">
        <div class="lightbox-nav">
          <button class="lightbox-prev" type="button" aria-label="Previous">Prev</button>
          <button class="lightbox-next" type="button" aria-label="Next">Next</button>
        </div>
      </div>
    `;
    document.body.appendChild(lb);
  }

  /* ===========================
     Nice-to-haves / safety
     =========================== */
  function initFloatIn() {
    const floating = document.querySelectorAll('.comm-card, .link-button:not(.placeholder)');
    floating.forEach((el, i) => { el.style.animationDelay = `${i * 0.1}s`; });
  }

  function hardenExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(a => {
      a.setAttribute('rel', 'noopener noreferrer');
    });
  }
})();
