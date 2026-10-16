(() => {
  'use strict';
  const video = document.querySelector('[data-story-video]');
  if (!video) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // With reduced motion the poster stays on screen instead of a looping animation.
  const apply = () => {
    if (reducedMotion.matches) {
      video.pause();
      video.currentTime = 0;
    } else {
      video.play().catch(() => {});
    }
  };

  reducedMotion.addEventListener('change', apply);
  apply();
})();
