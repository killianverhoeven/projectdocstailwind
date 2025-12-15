// Intercept navigation and play exit animation before navigating
(function(){
  const DURATION = 600; // should match CSS --page-transition-duration (ms)
  const html = document.documentElement;

  // target the main page text/title container if present
  const contentSelector = '.container .title, .title, main, .container';
  const contentEl = document.querySelector(contentSelector);

  function addEntering() {
    // read last direction (set by previous page) and apply corresponding class
    const dir = sessionStorage.getItem('pageTransitionDirection');
    if (dir === 'left') {
      html.classList.add('enter-from-left');
      if (contentEl) contentEl.classList.add('content-enter-from-left');
    } else if (dir === 'right') {
      html.classList.add('enter-from-right');
      if (contentEl) contentEl.classList.add('content-enter-from-right');
    }

    // play enter animation on document and on content
    html.classList.add('is-entering');

    // cleanup after animation
    setTimeout(() => {
      html.classList.remove('is-entering', 'enter-from-left', 'enter-from-right');
      if (contentEl) contentEl.classList.remove('content-enter-from-left', 'content-enter-from-right');
      // clear stored direction
      sessionStorage.removeItem('pageTransitionDirection');
    }, DURATION + 80);
  }

  function handleLinkClick(e) {
    // only left-clicks without modifier keys
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    let a = e.target;
    while (a && a.tagName !== 'A') a = a.parentElement;
    if (!a || !a.href) return;

    const href = a.getAttribute('href');
    // ignore anchors, mailto, tel, javascript, downloads, and external links
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
    if (a.target && a.target !== '' && a.target !== '_self') return;
    try {
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return; // external
    } catch (err) {
      return; // malformed
    }

    // allow opting out of transition with data-no-transition
    if (a.hasAttribute('data-no-transition')) return;

    e.preventDefault();

    // determine desired direction: opt-in via data-slide, otherwise heuristics
    const dataDir = a.getAttribute('data-slide');
    let direction = dataDir ? dataDir.toLowerCase() : null;
    if (!direction) {
      // links in the sidebar (vertical-buttons) feel like 'left' entries
      direction = a.closest('.vertical-buttons') ? 'left' : 'right';
    }

    // remember direction for the next page load
    try { sessionStorage.setItem('pageTransitionDirection', direction); } catch (err) {}

    // immediately add exit classes so the correct animation plays on document and content
    if (direction === 'left') {
      html.classList.add('exit-to-left');
      if (contentEl) contentEl.classList.add('content-exit-to-left');
    }
    if (direction === 'right') {
      html.classList.add('exit-to-right');
      if (contentEl) contentEl.classList.add('content-exit-to-right');
    }
    html.classList.add('is-exiting');

    const navigate = () => { location.href = a.href; };

    // wait for animationend if available, otherwise timeout
    const onAnim = (ev) => {
      if (ev && ev.target !== html && ev.target !== document.body) return;
      html.removeEventListener('animationend', onAnim);
      // cleanup classes (not strictly necessary since page will unload)
      html.classList.remove('is-exiting', 'exit-to-left', 'exit-to-right');
      if (contentEl) contentEl.classList.remove('content-exit-to-left', 'content-exit-to-right');
      navigate();
    };
    html.addEventListener('animationend', onAnim);

    // fallback timeout in case animationend doesn't fire
    setTimeout(() => navigate(), DURATION + 80);
  }

  // add listeners
  document.addEventListener('click', handleLinkClick, true);
  document.addEventListener('DOMContentLoaded', addEntering);
})();
