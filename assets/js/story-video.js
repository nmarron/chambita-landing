(() => {
  'use strict';
  const videos = Array.from(document.querySelectorAll('[data-story-video]'));
  const hero = document.querySelector('.hero');
  if (!videos.length || !hero) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;

  const apply = () => {
    const shouldPlay = visible && !document.hidden && !reducedMotion.matches;
    videos.forEach(video => {
      if (shouldPlay) video.play().catch(() => {});
      else video.pause();
    });
  };

  reducedMotion.addEventListener('change', apply);
  document.addEventListener('visibilitychange', apply);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      apply();
    }).observe(hero);
  }
  apply();
})();
