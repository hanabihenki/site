<script>
document.addEventListener('DOMContentLoaded', function () {
  initNavigation();
  initSparkles();
  initGallery();
  initFloatIn();
  hardenExternalLinks();
});

/* ===========================
   NAVIGATION (SPA only for hash/data-page)
   =========================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href') || '';
      const hasDataPage = link.hasAttribute('data-page');
      const isHashLink = href.startsWith('#');

      // If this is a real page nav (e.g., "gallery-2d.html"), allow normal navigation.
      if (!hasDataPage && !isHashLink) {
        return; // don't preventDefault, don't touch classes/pages
      }

      // SPA behavior only for data-page or #hash links
      e.preventDefault();

      const targetPage = hasDataPage ? link.getAttribute('data-page') : href.slice(1);
      const pages = document.querySelectorAll('.page');

      // Update active state in navbar
      document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
      link.classList.add('active');

      // If we have swappable sections on this page, show the target one
      if (pages.length && targetPage) {
        pages.forEach(page => page.classList.remove('active'));
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

  let mouseX = 0;
  let mouseY = 0;
  let lastSparkleTime = 0;
  const sparkleDelay = 50;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const now = Date.now();
    if (now - lastSparkleTime > sparkleDelay) {
      createSparkle(mouseX, mouseY);
      lastSparkleTime = now;
    }
  });

  function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';

    const colors = [
      'rgba(255, 179, 217, 0.8)',
      'rgba(212, 165, 255, 0.8)',
      'rgba(168, 216, 255, 0.8)',
      'rgba(255, 244, 168, 0.8)',
      'rgba(196, 255, 179, 0.8)'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';

    const beforeElement = document.createElement('style');
    beforeElement.textContent = `
      .sparkle:last-child::before,
      .sparkle:last-child::after {
        background: radial-gradient(circle, ${randomColor} 0%, transparent 100%);
      }
    `;
    document.head.appendChild(beforeElement);

    sparkleContainer.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
      beforeElement.remove();
    }, 1500);
  }

  setInterval(() => {
    if (sparkleContainer.children.length > 50) {
      const oldSparkles = Array.from(sparkleContainer.children).slice(0, 10);
      oldSparkles.forEach(s => s.remove());
    }
  }, 2000);
}

/* ===========================
   GALLERY / LIGHTBOX (guarded)
   =========================== */
function initGallery() {
  // Only run if there is a lightbox on this page
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  if (!lightbox || !lightboxImage) return; // nothing to do on pages without lightbox

  const galleryItems = document.querySelectorAll('.gallery-item:not(.placeholder)');
  let currentImageIndex = 0;
  let currentGalleryItems = [];

  galleryItems.forEach((item) => {
    item.addEventListener('click', function () {
      // Prefer images inside the currently visible section if present
      const activeSection = document.querySelector('.page.active');
      if (activeSection) {
        currentGalleryItems = Array.from(activeSection.querySelectorAll('.gallery-item:not(.placeholder)'));
      } else {
        currentGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not(.placeholder)'));
      }

      currentImageIndex = currentGalleryItems.indexOf(item);

      const imageSrc = this.getAttribute('data-image');
      if (imageSrc) openLightbox(imageSrc);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      navigateGallery(-1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      navigateGallery(1);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') navigateGallery(-1);
    else if (e.key === 'ArrowRight') navigateGallery(1);
  });

  function openLightbox(src) {
    lightboxImage.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function navigateGallery(direction) {
    if (currentGalleryItems.length === 0) return;
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = currentGalleryItems.length - 1;
    if (currentImageIndex >= currentGalleryItems.length) currentImageIndex = 0;
    const newSrc = currentGalleryItems[currentImageIndex].getAttribute('data-image');
    if (newSrc) lightboxImage.src = newSrc;
  }
}

/* ===========================
   Nice-to-haves / safety
   =========================== */
function initFloatIn() {
  const floatingElements = document.querySelectorAll('.comm-card, .link-button:not(.placeholder)');
  floatingElements.forEach((el, i) => {
    el.style.animationDelay = `${i * 0.1}s`;
  });
}

function hardenExternalLinks() {
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
  });
}
</script>
