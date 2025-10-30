(() => {
  const SELECTORS = {
    inViewTrigger: '.js-inview-trigger',
    faqSection: '.faq-accordion',
    faqToggle: '[data-faq-toggle]'
  };

  const CLASSES = {
    inView: 'is-inview',
    faqOpen: 'is-open'
  };

  const ATTRIBUTES = {
    faqPanel: 'data-faq-panel'
  };

  const state = {
    observer: null,
    resizeFrame: 0
  };

  const reduceMotionQuery = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  const prefersReducedMotion = () => Boolean(reduceMotionQuery && reduceMotionQuery.matches);
  const hasIntersectionObserver = typeof window.IntersectionObserver === 'function';
  const docElement = document.documentElement;

  const setReducedMotionAttribute = () => {
    if (!docElement) return;
    if (prefersReducedMotion()) {
      docElement.setAttribute('data-reduced-motion', 'true');
    } else {
      docElement.removeAttribute('data-reduced-motion');
    }
  };

  const disconnectObserver = () => {
    if (!state.observer) return;
    state.observer.disconnect();
    state.observer = null;
  };

  const applyInViewClass = (elements) => {
    elements.forEach((element) => element.classList.add(CLASSES.inView));
  };

  const handleObserverEntries = (entries, observerInstance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add(CLASSES.inView);
      observerInstance.unobserve(entry.target);
    });
  };

  const observeTriggers = () => {
    const triggers = document.querySelectorAll(SELECTORS.inViewTrigger);

    if (!triggers.length) {
      disconnectObserver();
      return;
    }

    if (prefersReducedMotion() || !hasIntersectionObserver) {
      disconnectObserver();
      applyInViewClass(triggers);
      return;
    }

    disconnectObserver();

    state.observer = new IntersectionObserver(handleObserverEntries, {
      root: null,
      threshold: 0.25,
      rootMargin: '0px 0px -15% 0px'
    });

    triggers.forEach((trigger) => {
      if (state.observer) {
        state.observer.observe(trigger);
      }
    });
  };

  const getPanelForToggle = (toggle) => {
    if (!toggle) return null;
    const panelId = toggle.getAttribute('aria-controls');
    if (!panelId) return null;

    return (
      document.querySelector(`[${ATTRIBUTES.faqPanel}="${panelId}"]`) ||
      document.getElementById(panelId)
    );
  };

  const setPanelHeight = (panel, expanded) => {
    if (!panel) return;
    if (prefersReducedMotion()) {
      panel.style.maxHeight = expanded ? 'none' : '0px';
      return;
    }
    panel.style.maxHeight = expanded ? `${panel.scrollHeight}px` : '0px';
  };

  const collapsePanel = (toggle, panel) => {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    setPanelHeight(panel, false);
    panel.classList.remove(CLASSES.faqOpen);
  };

  const expandPanel = (toggle, panel) => {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    setPanelHeight(panel, true);
    panel.classList.add(CLASSES.faqOpen);
  };

  const toggleFaqPanel = (event) => {
    const toggle = event.currentTarget;
    const panel = getPanelForToggle(toggle);
    const container = toggle.closest(SELECTORS.faqSection);

    if (!panel || !container) return;

    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

    container.querySelectorAll(SELECTORS.faqToggle).forEach((button) => {
      if (button === toggle) return;
      collapsePanel(button, getPanelForToggle(button));
    });

    if (isExpanded) {
      collapsePanel(toggle, panel);
    } else {
      expandPanel(toggle, panel);
    }
  };

  const handleFaqKeydown = (event) => {
    const { key } = event;
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return;

    const toggle = event.currentTarget;
    const container = toggle.closest(SELECTORS.faqSection);
    if (!container) return;

    const toggles = Array.from(container.querySelectorAll(SELECTORS.faqToggle));
    if (!toggles.length) return;

    const currentIndex = toggles.indexOf(toggle);
    if (currentIndex === -1) return;

    event.preventDefault();

    let nextIndex = currentIndex;
    if (key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % toggles.length;
    } else if (key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + toggles.length) % toggles.length;
    } else if (key === 'Home') {
      nextIndex = 0;
    } else if (key === 'End') {
      nextIndex = toggles.length - 1;
    }

    toggles[nextIndex].focus();
  };

  const initializeAccordion = (container) => {
    const toggles = container.querySelectorAll(SELECTORS.faqToggle);
    if (!toggles.length) return;

    toggles.forEach((toggle) => {
      const panel = getPanelForToggle(toggle);
      if (!panel) return;

      if (toggle.getAttribute('aria-expanded') === 'true') {
        expandPanel(toggle, panel);
      } else {
        collapsePanel(toggle, panel);
      }

      toggle.removeEventListener('click', toggleFaqPanel);
      toggle.addEventListener('click', toggleFaqPanel);

      toggle.removeEventListener('keydown', handleFaqKeydown);
      toggle.addEventListener('keydown', handleFaqKeydown);
    });
  };

  const syncAccordionHeights = () => {
    document
      .querySelectorAll(`${SELECTORS.faqSection} ${SELECTORS.faqToggle}[aria-expanded="true"]`)
      .forEach((toggle) => {
        const panel = getPanelForToggle(toggle);
        if (panel) {
          setPanelHeight(panel, true);
        }
      });
  };

  const queueAccordionSync = () => {
    if (state.resizeFrame) {
      cancelAnimationFrame(state.resizeFrame);
    }
    state.resizeFrame = window.requestAnimationFrame(syncAccordionHeights);
  };

  const initializeAccordions = () => {
    document.querySelectorAll(SELECTORS.faqSection).forEach(initializeAccordion);
    syncAccordionHeights();
  };

  const startInteractions = () => {
    setReducedMotionAttribute();
    observeTriggers();
    initializeAccordions();
  };

  const reinitialize = () => {
    observeTriggers();
    initializeAccordions();
  };

  const handleMotionPreferenceChange = () => {
    setReducedMotionAttribute();
    observeTriggers();
    syncAccordionHeights();
  };

  const readyStates = ['interactive', 'complete'];
  if (readyStates.includes(document.readyState)) {
    startInteractions();
  } else {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        startInteractions();
      },
      { once: true }
    );
  }

  document.addEventListener('shopify:section:load', reinitialize);
  document.addEventListener('shopify:section:unload', reinitialize);
  document.addEventListener('shopify:section:select', reinitialize);
  window.addEventListener('pagehide', disconnectObserver);
  window.addEventListener('resize', queueAccordionSync);

  if (reduceMotionQuery) {
    if (typeof reduceMotionQuery.addEventListener === 'function') {
      reduceMotionQuery.addEventListener('change', handleMotionPreferenceChange);
    } else if (typeof reduceMotionQuery.addListener === 'function') {
      reduceMotionQuery.addListener(handleMotionPreferenceChange);
    }
  }
})();
