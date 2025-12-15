// Simple lightbox for gallery images and images-with-text
(function(){
  function qs(sel, ctx=document){ return ctx.querySelector(sel); }
  function qsa(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }

  // Build modal elements
  const overlay = document.createElement('div');
  overlay.className = 'glightbox-overlay';
  overlay.innerHTML = '<div class="glightbox-content"><img alt=""/></div>';
  document.body.appendChild(overlay);

  const imgEl = qs('img', overlay);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'glightbox-close';
  closeBtn.type = 'button';
  closeBtn.textContent = 'Sluiten';
  document.body.appendChild(closeBtn);

  function open(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt || '';
    overlay.classList.add('visible');
    closeBtn.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('visible');
    closeBtn.classList.remove('visible');
    document.body.style.overflow = '';
    // release src to free memory
    setTimeout(()=> imgEl.src = '', 200);
  }

  overlay.addEventListener('click', function(e){
    if (e.target === overlay) close();
  });
  closeBtn.addEventListener('click', close);
  window.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });

  // Attach handlers to images in both .gallery and .images-with-text
  function attachAll() {
    qsa('.gallery figure img, .images-with-text figure img').forEach(img => {
      if (img.__glightboxAttached) return; // already attached
      img.__glightboxAttached = true;
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function onClick(e){
        // Play click animation, then open lightbox when animation ends (or fallback)
        if (img.__animating) return; // prevent double clicks
        img.__animating = true;
        img.classList.add('click-animate');

        const doOpen = () => {
          // ensure we only open once
          if (img.__opened) return;
          img.__opened = true;
          open(img.dataset.large || img.src, img.alt);
          // cleanup flags after a tick so subsequent clicks work
          setTimeout(()=> { img.__opened = false; }, 50);
        };

        const cleanup = () => {
          img.__animating = false;
          img.classList.remove('click-animate');
          doOpen();
        };

        img.addEventListener('animationend', cleanup, { once: true });
        // fallback: in case animationend doesn't fire
        setTimeout(() => {
          if (img.__animating) cleanup();
        }, 350);
      });
    });
  }

  // initial attach
  attachAll();

  // If new images are added dynamically, observe and attach
  const observer = new MutationObserver(attachAll);
  observer.observe(document.body, { childList: true, subtree: true });
})();
