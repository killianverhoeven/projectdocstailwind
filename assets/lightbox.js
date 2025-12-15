// Lightbox: click any image to expand it in a fullscreen modal overlay

(function() {
  const createLightbox = () => {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close image">✕</button>
        <img class="lightbox-image" src="" alt="Enlarged image" />
        <button class="lightbox-prev" aria-label="Previous image">‹</button>
        <button class="lightbox-next" aria-label="Next image">›</button>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  };

  let lightboxModal = null;
  let currentImageIndex = 0;
  let images = [];

  const openLightbox = (img, allImages) => {
    if (!lightboxModal) {
      lightboxModal = createLightbox();
      setupLightboxEvents();
    }

    images = Array.from(allImages);
    currentImageIndex = images.indexOf(img);

    const lightboxImg = lightboxModal.querySelector('.lightbox-image');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  const showImage = (index) => {
    if (images.length === 0) return;
    currentImageIndex = (index + images.length) % images.length;
    const lightboxImg = lightboxModal.querySelector('.lightbox-image');
    lightboxImg.src = images[currentImageIndex].src;
    lightboxImg.alt = images[currentImageIndex].alt;
  };

  const setupLightboxEvents = () => {
    // Close on close button click
    lightboxModal.querySelector('.lightbox-close').addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    // Close on overlay click
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('open')) {
        closeLightbox();
      }
    });

    // Navigation buttons
    lightboxModal.querySelector('.lightbox-prev').addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentImageIndex - 1);
    });

    lightboxModal.querySelector('.lightbox-next').addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentImageIndex + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightboxModal && lightboxModal.classList.contains('open')) {
        if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
      }
    });
  };

  // Attach click listeners to all images
  const attachImageListeners = () => {
    const galleryImages = document.querySelectorAll('.gallery img, .images-with-text img');
    galleryImages.forEach((img) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(img, galleryImages);
      });
    });
  };

  // Initialize when DOM is ready
  const init = () => {
    attachImageListeners();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
