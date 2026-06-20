if (typeof window !== 'undefined') {
  const collapseNestedDetails = () => {
    const allDetails = document.querySelectorAll('.VPDocOutlineItem details');
    allDetails.forEach(details => {
      const isTopLevel = details.closest('.VPDocOutlineItem.nested') === null;
      
      if (isTopLevel) {
        details.setAttribute('open', '');
      } else if (details.hasAttribute('open')) {
        details.removeAttribute('open');
      }
    });
  };

  const expandActiveSection = () => {
    const activeLink = document.querySelector('.outline-link.active');
    
    if (activeLink) {
      let element = activeLink.parentElement;
      while (element) {
        if (element.tagName === 'DETAILS') {
          element.setAttribute('open', '');
        }
        element = element.parentElement;
      }
    }
  };

  const updateSidebar = () => {
    collapseNestedDetails();
    expandActiveSection();
  };

  const init = () => {
    collapseNestedDetails();
    setTimeout(expandActiveSection, 500);
  };

  window.addEventListener('hashchange', () => {
    collapseNestedDetails();
    setTimeout(expandActiveSection, 100);
  });

  let scrollTimer: number | null = null;
  window.addEventListener('scroll', () => {
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }
    scrollTimer = window.setTimeout(updateSidebar, 150);
  }, { passive: true });

  const initAll = () => {
    init();
    setTimeout(init, 800);
    setTimeout(init, 1500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
}