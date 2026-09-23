import { useEffect } from 'react';

/**
 * Re-runs the site's scroll-reveal IntersectionObserver whenever the
 * page it's called from mounts (i.e. on every route change), mirroring
 * the original main.js behaviour which ran once per full page load.
 */
export function useScrollReveal(deps = []) {
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!revealEls.length) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: '0px 0px -60px 0px' }
      );
      revealEls.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }

    revealEls.forEach((el) => el.classList.add('in'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
