/* Disclosure navigation: native links/buttons, no ARIA application-menu roles. */
(() => {
  'use strict';
  const header = document.querySelector('[data-navigation]');
  if (!header) return;
  const nav = header.querySelector('.landing-nav');
  const toggle = header.querySelector('.nav-toggle');
  const trigger = header.querySelector('.nav-disclosure-trigger');
  const panel = header.querySelector('#audience-panel');
  const mobile = window.matchMedia('(max-width: 800px)');
  const setAudience = open => {
    trigger.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };
  const setMenu = open => {
    header.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.inert = mobile.matches && !open;
    if (!open) setAudience(false);
  };
  header.classList.add('nav-ready');
  header.querySelector('.nav-fallback').hidden = true;
  trigger.hidden = false;
  toggle.hidden = false;
  setMenu(false);
  trigger.addEventListener('click', () => setAudience(panel.hidden));
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setMenu(false);
  });
  header.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!panel.hidden) { setAudience(false); trigger.focus(); }
    else if (header.classList.contains('is-menu-open')) { setMenu(false); toggle.focus(); }
  });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) setMenu(false);
  });
  header.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      // Move keyboard focus to the destination before hiding the focused link.
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
      setMenu(false);
    });
  });
  mobile.addEventListener('change', () => {
    const focusWillHide = mobile.matches && nav.contains(document.activeElement);
    setMenu(false);
    if (focusWillHide) toggle.focus();
  });
  let frame = 0;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 32);
    frame = 0;
  };
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
  update();
})();
