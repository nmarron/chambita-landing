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
  const STORE_URLS = {
    ios: 'https://apps.apple.com/app/id6762499947',
    android: 'https://play.google.com/store/apps/details?id=com.chambita',
  };
  const detectStoreUrl = () => {
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) return STORE_URLS.ios;
    if (/Android/.test(ua)) return STORE_URLS.android;
    return null;
  };
  // On phones, send the header download link straight to the store instead of the page section.
  const downloadLink = header.querySelector('.download-link');
  const storeUrl = detectStoreUrl();
  if (downloadLink && storeUrl) downloadLink.href = storeUrl;
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
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const focusTarget = target => {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  };
  const afterScroll = callback => {
    // Safari cancels a smooth scroll if focus moves mid-animation, so focus only once it settles.
    let timer = 0;
    const done = () => {
      window.removeEventListener('scroll', onScroll);
      callback();
    };
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(done, 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    timer = setTimeout(done, 120);
  };
  header.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const hash = link.getAttribute('href');
      const target = document.querySelector(hash);
      setMenu(false);
      if (!target) return;
      event.preventDefault();
      history.pushState(null, '', hash);
      target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      afterScroll(() => focusTarget(target));
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
