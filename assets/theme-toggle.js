// Theme Toggle: Dark/Light mode switcher with localStorage persistence

(function() {
  const THEME_KEY = 'theme-preference';
  
  // Detect system preference
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  
  // Get saved preference or system default
  const getSavedTheme = () => localStorage.getItem(THEME_KEY) || getSystemTheme();
  
  // Apply theme to HTML element
  const setTheme = (theme) => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
    
    // Update toggle switch position if it exists
    updateToggleUI();
  };
  
  // Create toggle button with switch UI
  const createToggle = () => {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark/light theme');
    toggle.innerHTML = `
      <span class="track"></span>
      <span class="knob">
        <span class="icon">☀</span>
      </span>
    `;
    
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
    
    return toggle;
  };
  
  // Update toggle UI to reflect current theme
  const updateToggleUI = () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    
    const isDark = document.documentElement.classList.contains('dark');
    const icon = toggle.querySelector('.icon');
    if (icon) {
      icon.textContent = isDark ? '☽' : '☀';
    }
  };
  
  // Inject toggle into header nav
  const injectToggle = () => {
    const headerNav = document.querySelector('.header-nav ul');
    if (!headerNav) return;
    
    // Check if toggle already exists
    if (document.querySelector('.theme-toggle')) return;
    
    // Create list item for toggle
    const li = document.createElement('li');
    li.className = 'theme-toggle-item';
    li.appendChild(createToggle());
    
    // Add to the end of nav
    headerNav.appendChild(li);
  };
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTheme(getSavedTheme());
      injectToggle();
    });
  } else {
    setTheme(getSavedTheme());
    injectToggle();
  }
  
  // Listen to system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only apply if no saved preference
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
})();
