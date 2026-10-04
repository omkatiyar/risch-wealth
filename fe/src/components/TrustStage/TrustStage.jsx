import { useEffect, useRef } from 'react';
import poster from '../../assets/trust-shield.png';

// The hero graphic on Testimonials: a gold shield with a check mark inside a
// copper ring, a mark of trust.
//
// A still of the scene is part of the prerendered page, so there is
// something right there at first paint. Shortly after load, Three.js is
// fetched in the background and a live 3D version fades in over it. If WebGL
// isn't available, or the visitor prefers reduced motion, or the screen is
// too narrow to show it, the still stays (or the stage stays hidden) and
// Three.js is never downloaded.

const START_DELAY_MS = 400;

export default function TrustStage() {
  const rootRef = useRef(null);
  const glRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const wide = window.matchMedia('(min-width: 900px)');
    let handle = null;
    let cancelled = false;
    let observer = null;
    let timer = 0;

    const start = () => {
      if (handle || cancelled || !wide.matches) return;
      import('./trustScene')
        .then(({ mountTrustScene }) => {
          if (cancelled || handle) return;
          handle = mountTrustScene(glRef.current);
          if (!handle) return; // no WebGL: the still stays
          root.classList.add('is-live');
          observer = new IntersectionObserver(([entry]) => handle.setActive(entry.isIntersecting));
          observer.observe(root);
        })
        .catch(() => {}); // offline / blocked chunk: the still stays
    };
    const schedule = () => { timer = window.setTimeout(start, START_DELAY_MS); };

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    wide.addEventListener('change', start);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener('load', schedule);
      wide.removeEventListener('change', start);
      observer?.disconnect();
      handle?.dispose();
      root.classList.remove('is-live');
    };
  }, []);

  return (
    <div className="ts-stage" ref={rootRef} aria-hidden="true">
      <img className="ts-poster" src={poster} alt="" width="1010" height="784" decoding="async" />
      <div className="ts-stage-gl" ref={glRef} />
    </div>
  );
}
