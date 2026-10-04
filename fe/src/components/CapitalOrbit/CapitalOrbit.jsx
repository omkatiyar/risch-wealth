import { useEffect, useRef } from 'react';

// The hero visual on Testimonials: "the Capital Orbit", a few hairline arcs
// with sparse nodes and one orange point of focus.
//
// A static SVG of the same idea is part of the prerendered page, so there is
// something right there at first paint. Shortly after load, Three.js is
// fetched in the background and the live scene fades in over it. If WebGL
// isn't available, or the visitor prefers reduced motion, or the screen is
// too narrow, the SVG simply stays and Three.js is never downloaded.

const START_DELAY_MS = 500;

export default function CapitalOrbit() {
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
      import('./orbitScene')
        .then(({ mountOrbitScene }) => {
          if (cancelled || handle) return;
          handle = mountOrbitScene(glRef.current);
          if (!handle) return; // no WebGL: the SVG stays
          root.classList.add('is-live');
          observer = new IntersectionObserver(([entry]) => handle.setActive(entry.isIntersecting));
          observer.observe(root);
        })
        .catch(() => {}); // offline / blocked chunk: the SVG stays
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
    <div className="tx-orbit" ref={rootRef} aria-hidden="true">
      <svg className="tx-orbit-poster" viewBox="-320 -240 640 480" focusable="false">
        <g fill="none" strokeLinecap="round">
          <ellipse cx="0" cy="0" rx="250" ry="108" transform="rotate(-18)" strokeWidth="1.6" opacity=".8" strokeDasharray="1130 560" />
          <ellipse cx="0" cy="0" rx="196" ry="150" transform="rotate(28)" strokeWidth="1.3" opacity=".55" strokeDasharray="880 360" />
          <ellipse cx="0" cy="0" rx="300" ry="70" transform="rotate(-48)" strokeWidth="1.1" opacity=".38" strokeDasharray="700 600" />
          <ellipse cx="0" cy="0" rx="146" ry="146" transform="rotate(8)" strokeWidth="1.1" opacity=".46" strokeDasharray="780 140" />
        </g>
        <g className="tx-orbit-nodes">
          <circle cx="-196" cy="-8" r="4.4" />
          <circle cx="132" cy="-96" r="3.4" />
          <circle cx="62" cy="128" r="4" />
          <circle cx="-118" cy="86" r="3.2" />
        </g>
        <circle className="tx-orbit-focus-glow" cx="212" cy="-84" r="18" />
        <circle className="tx-orbit-focus" cx="212" cy="-84" r="6.5" />
      </svg>
      <div className="tx-orbit-gl" ref={glRef} />
    </div>
  );
}
