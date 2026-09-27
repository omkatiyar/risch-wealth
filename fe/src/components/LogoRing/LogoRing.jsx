import { useEffect, useRef } from 'react';
import { SEGMENTS, svgPath } from './ringGeometry';

// The ring behind the RISCH wordmark in the nav.
//
// The SVG is prerendered and starts spinning straight away with a CSS
// animation, which costs nothing. A few seconds after the page has loaded,
// Three.js is fetched in the background and a WebGL canvas takes over at
// the exact same angle, then the SVG is paused. Keeping Three.js out of
// the initial load keeps first paint and interactivity fast. If WebGL
// isn't available the CSS spin simply carries on; with reduced motion the
// ring stays still and Three.js is never downloaded.

// Delay after the load event before Three.js is fetched.
const HANDOFF_DELAY_MS = 4000;
const PERIOD_MS = 18000; // keep in step with logoSpin in styles.css

export default function LogoRing() {
  const rootRef = useRef(null);
  const glRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let cancelled = false;
    let handle = null;
    let themeObserver = null;

    const readStyle = () => {
      const cs = getComputedStyle(root);
      const num = (name) => parseFloat(cs.getPropertyValue(name));
      const color = (name) => cs.getPropertyValue(name).trim();
      return {
        strongColor: color('--lr-strong-color'),
        mediumColor: color('--lr-medium-color'),
        lightColor: color('--lr-light-color'),
        faintColor: color('--lr-faint-color'),
        strong: num('--lr-strong'),
        medium: num('--lr-medium'),
        light: num('--lr-light'),
        faint: num('--lr-faint'),
      };
    };

    const start = () => {
      import('./logoRingScene')
        .then(({ mountLogoRing }) => {
          if (cancelled) return;
          const svg = root.querySelector('.logo-ring-svg');
          const spin = svg.getAnimations?.()[0];
          const elapsed = spin && typeof spin.currentTime === 'number' ? spin.currentTime % PERIOD_MS : 0;
          handle = mountLogoRing(glRef.current, readStyle, (elapsed / PERIOD_MS) * 2 * Math.PI);
          if (!handle) return; // no WebGL: the CSS spin just carries on
          root.classList.add('is-live');
          // once the canvas has faded in, stop animating the hidden SVG
          window.setTimeout(() => { if (!cancelled) spin?.pause(); }, 900);
          themeObserver = new MutationObserver(() => handle.applyStyle());
          themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        })
        .catch(() => {}); // offline / blocked chunk: the CSS spin carries on
    };

    let delayId = 0;
    let idleId = 0;
    const hasIdle = 'requestIdleCallback' in window;
    const schedule = () => {
      delayId = window.setTimeout(() => {
        idleId = hasIdle ? window.requestIdleCallback(start, { timeout: 3000 }) : window.setTimeout(start, 0);
      }, HANDOFF_DELAY_MS);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
      window.clearTimeout(delayId);
      if (hasIdle) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      themeObserver?.disconnect();
      handle?.dispose();
      root.classList.remove('is-live');
      root.querySelector('.logo-ring-svg')?.getAnimations?.()[0]?.play();
    };
  }, []);

  return (
    <span className="logo-ring" ref={rootRef} aria-hidden="true">
      <svg className="logo-ring-svg" viewBox="-1.02 -1.02 2.04 2.04" focusable="false">
        {SEGMENTS.map((seg) => (
          <path key={seg.tone} className={`lr-${seg.tone}`} d={svgPath(seg)} />
        ))}
      </svg>
      <span className="logo-ring-gl" ref={glRef}></span>
    </span>
  );
}
