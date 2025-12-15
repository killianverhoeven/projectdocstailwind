// Sidebar navigation: handles hamburger toggle, active link marking, and collapsible sections

(function() {
  const STORAGE_KEY = 'sidebar-expanded';
  let sidebarLoaded = false;
  
  // Load sidebar HTML and inject it into the page
  const loadSidebar = async () => {
    if (sidebarLoaded) return; // prevent double loading
    sidebarLoaded = true;
    
    try {
      const response = await fetch('assets/sidebar.html');
      if (!response.ok) throw new Error('Failed to load sidebar');
      const html = await response.text();
      
      // Find the main layout container
      let mainLayout = document.querySelector('.main-layout');
      
      if (!mainLayout) {
        console.error('No .main-layout found');
        return;
      }
      
      // Create sidebar element from HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html.trim();
      const sidebar = tempDiv.firstElementChild;
      
      if (sidebar) {
        // Insert sidebar at the beginning of main-layout
        mainLayout.insertBefore(sidebar, mainLayout.firstChild);
        
        // Setup sidebar interactions
        setupSidebar();
      }
    } catch (error) {
      console.error('Error loading sidebar:', error);
    }
  };
  
  // Setup sidebar interactions
  const setupSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    if (!sidebar || !hamburger) {
      console.error('Sidebar or hamburger not found');
      return;
    }
    
    // Toggle sidebar on hamburger click
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;
      
      hamburger.setAttribute('aria-expanded', newState);
      sidebar.classList.toggle('open', newState);
      
      // Save state to localStorage
      localStorage.setItem(STORAGE_KEY, newState ? 'true' : 'false');
    });
    
    // Close sidebar when clicking a link
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Don't close if clicking a section toggle
        if (link.classList.contains('section-toggle')) return;
        
        hamburger.setAttribute('aria-expanded', 'false');
        sidebar.classList.remove('open');
        localStorage.setItem(STORAGE_KEY, 'false');
      });
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      const isClickInsideSidebar = sidebar.contains(e.target);
      const isClickOnHamburger = hamburger.contains(e.target);
      
      if (!isClickInsideSidebar && !isClickOnHamburger) {
        if (sidebar.classList.contains('open')) {
          hamburger.setAttribute('aria-expanded', 'false');
          sidebar.classList.remove('open');
        }
      }
    });
    
    // Setup section toggle buttons
    setupSectionToggles();
    
    // Mark the current page as active
    markActiveLink();
    
    // Restore sidebar state from localStorage
    const wasExpanded = localStorage.getItem(STORAGE_KEY) === 'true';
    if (wasExpanded) {
      hamburger.setAttribute('aria-expanded', 'true');
      sidebar.classList.add('open');
    }
  };
  
  // Setup collapsible section toggles
  const setupSectionToggles = () => {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    const sectionToggles = sidebar.querySelectorAll('.section-toggle');
    sectionToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const section = toggle.closest('.sidebar-section');
        if (!section) return;
        
        const isCollapsed = section.classList.contains('collapsed');
        section.classList.toggle('collapsed');
        toggle.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
      });
    });
  };
  
  // Mark the current page link as active
  const markActiveLink = () => {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    // Get current page filename from the URL
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';
    
    const links = sidebar.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === currentFile || (currentFile === '' && href === 'index.html');
      
      if (isActive) {
        link.classList.add('active');
        
        // Expand parent section if this link is inside a collapsible
        const section = link.closest('.sidebar-section');
        if (section && section.classList.contains('collapsed')) {
          section.classList.remove('collapsed');
          const toggle = section.querySelector('.section-toggle');
          if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
          }
        }
      } else {
        link.classList.remove('active');
      }
    });
  };
  
  // Initialize when DOM is ready
  const setHeaderHeights = () => {
    const header = document.querySelector('.site-header');
    if (header) {
      const h = Math.round(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--header-height', h + 'px');
      const mobileH = Math.max(48, Math.round(h - 16));
      document.documentElement.style.setProperty('--header-height-mobile', mobileH + 'px');
    }
  };

  const init = () => {
    // Ensure header size is measured and set before sidebar opens
    setHeaderHeights();
    window.addEventListener('resize', setHeaderHeights);

    // Wait a tick to ensure main-layout exists
    setTimeout(loadSidebar, 0);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
