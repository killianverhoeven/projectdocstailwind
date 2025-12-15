// Small IntersectionObserver helper to reveal elements with `.animate-on-scroll`
(function(){
  if (typeof window === 'undefined') return;

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function init() {
    const animated = Array.from(document.querySelectorAll('.animate-on-scroll'));
    if (!animated.length) return;

    if (prefersReducedMotion()) {
      // Immediately show all
      animated.forEach(el => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // optional data-delay (ms)
          const delay = parseInt(el.dataset.delay || 0, 10);
          if (delay) el.style.transitionDelay = delay + 'ms';
          el.classList.add('in-view');

          // if data-animate-once is not "false", unobserve
          if (el.dataset.animateOnce !== 'false') {
            obs.unobserve(el);
          }
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    animated.forEach(el => observer.observe(el));

    // observe for dynamically added elements
    const mo = new MutationObserver(muts => {
      muts.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.matches && node.matches('.animate-on-scroll')) {
            observer.observe(node);
          }
          node.querySelectorAll && node.querySelectorAll('.animate-on-scroll').forEach(n => observer.observe(n));
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
