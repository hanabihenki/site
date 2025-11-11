document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSparkles();
    initGallery();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            pages.forEach(page => page.classList.remove('active'));
            
            const targetElement = document.getElementById(targetPage);
            if (targetElement) {
                targetElement.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

function initSparkles() {
    const sparkleContainer = document.querySelector('.sparkle-container');
    let mouseX = 0;
    let mouseY = 0;
    let lastSparkleTime = 0;
    const sparkleDelay = 50;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const currentTime = Date.now();
        if (currentTime - lastSparkleTime > sparkleDelay) {
            createSparkle(mouseX, mouseY);
            lastSparkleTime = currentTime;
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
            oldSparkles.forEach(sparkle => sparkle.remove());
        }
    }, 2000);
}

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item:not(.placeholder)');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let currentGalleryItems = [];

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const activeSection = document.querySelector('.page.active');
            currentGalleryItems = Array.from(activeSection.querySelectorAll('.gallery-item:not(.placeholder)'));
            currentImageIndex = currentGalleryItems.indexOf(item);
            
            const imageSrc = this.getAttribute('data-image');
            if (imageSrc) {
                openLightbox(imageSrc);
            }
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateGallery(-1);
    });

    lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateGallery(1);
    });

    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateGallery(-1);
            } else if (e.key === 'ArrowRight') {
                navigateGallery(1);
            }
        }
    });

    function openLightbox(imageSrc) {
        lightboxImage.src = imageSrc;
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
        
        if (currentImageIndex < 0) {
            currentImageIndex = currentGalleryItems.length - 1;
        } else if (currentImageIndex >= currentGalleryItems.length) {
            currentImageIndex = 0;
        }
        
        const newImageSrc = currentGalleryItems[currentImageIndex].getAttribute('data-image');
        if (newImageSrc) {
            lightboxImage.src = newImageSrc;
        }
    }
}

const floatingElements = document.querySelectorAll('.comm-card, .link-button:not(.placeholder)');
floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.1}s`;
});

document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
});
