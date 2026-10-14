(() => {
  'use strict';
  const bands = Array.from(document.querySelectorAll('[data-parallax]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!bands.length || !('IntersectionObserver' in window)) return;

  // Must stay below the 14% overscan of .parallax-media so no edge is ever exposed.
  const STRENGTH = 0.12;
  const visible = new Set();
  let frame = 0;

  const update = () => {
    frame = 0;
    const viewport = window.innerHeight;
    for (const band of visible) {
      const rect = band.getBoundingClientRect();
      const distance = rect.top + rect.height / 2 - viewport / 2;
      const progress = Math.max(-1, Math.min(1, distance / ((viewport + rect.height) / 2)));
      band.style.setProperty('--parallax-shift', `${(progress * rect.height * STRENGTH).toFixed(1)}px`);
    }
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    schedule();
  }, { rootMargin: '100px 0px' });

  const start = () => {
    bands.forEach(band => observer.observe(band));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
  };

  const stop = () => {
    observer.disconnect();
    visible.clear();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    bands.forEach(band => band.style.removeProperty('--parallax-shift'));
  };

  reducedMotion.addEventListener('change', event => (event.matches ? stop() : start()));
  if (!reducedMotion.matches) start();
})();
