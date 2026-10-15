import { useCallback, useEffect, useRef } from 'react';

// A 3D ring of cards: they sit round a circle you can spin by dragging (or
// with the arrow keys and buttons) and drift slowly on their own. Plain CSS
// 3D transforms, no library: each card is turned to its place on the circle
// and pushed out to its radius, and the ring is turned as a whole. Cards on
// the far side show between the gaps, dimmed. Cards facing away are inert,
// so only the ones you can read can be clicked or tabbed to.
// `items`: [{ key, content }]

const AUTO_DEG_PER_SEC = 6;
const TILT_DEG = -7;

export default function RingSlider({ items, label }) {
  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const s = useRef({
    rot: 0, vel: 0, target: null, dragging: false, down: false, hover: false, visible: true, last: 0, lastX: 0, lastT: 0, startX: 0,
  });
  const step = 360 / items.length;

  const paint = useCallback(() => {
    const st = s.current;
    if (ringRef.current) ringRef.current.style.transform = `rotateX(${TILT_DEG}deg) rotateY(${st.rot}deg)`;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const facing = (Math.cos(((i * step + st.rot) * Math.PI) / 180) + 1) / 2;
      el.style.opacity = (0.3 + 0.7 * facing).toFixed(3);
      const front = facing > 0.55;
      if (el.inert !== !front) el.inert = !front;
    });
  }, [step]);

  useEffect(() => {
    const st = s.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const loop = (t) => {
      const dt = st.last ? Math.min(0.05, (t - st.last) / 1000) : 0.016;
      st.last = t;
      if (!st.dragging && st.visible) {
        if (st.target !== null) {
          st.rot += (st.target - st.rot) * Math.min(1, dt * 7);
          if (Math.abs(st.target - st.rot) < 0.05) { st.rot = st.target; st.target = null; }
        } else if (Math.abs(st.vel) > 0.02) {
          st.rot += st.vel * dt * 60;
          st.vel *= 0.94;
        } else if (!reduce && !st.hover) {
          st.rot += AUTO_DEG_PER_SEC * dt;
        }
      }
      paint();
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; st.last = 0; }, { threshold: 0.05 });
    if (rootRef.current) io.observe(rootRef.current);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [paint]);

  const onDown = (e) => {
    const st = s.current;
    st.down = true; st.dragging = false; st.target = null; st.vel = 0;
    st.startX = e.clientX; st.lastX = e.clientX; st.lastT = performance.now();
  };
  const onMove = (e) => {
    const st = s.current;
    if (!st.down) return;
    if (!st.dragging) {
      if (Math.abs(e.clientX - st.startX) < 6) return;
      st.dragging = true; st.lastX = e.clientX;
      rootRef.current.setPointerCapture?.(e.pointerId);
    }
    const now = performance.now();
    const deg = (e.clientX - st.lastX) * 0.3;
    st.rot += deg;
    st.vel = deg / Math.max(1, (now - st.lastT) / 16.7);
    st.lastX = e.clientX; st.lastT = now;
  };
  const onUp = (e) => {
    const st = s.current;
    st.down = false; st.dragging = false;
    if (rootRef.current.hasPointerCapture?.(e.pointerId)) rootRef.current.releasePointerCapture(e.pointerId);
  };

  const nudge = (dir) => {
    const st = s.current;
    st.vel = 0;
    st.target = Math.round(st.rot / step) * step + dir * step;
  };
  const onKey = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); nudge(-1); }
  };

  return (
    <div className="ring3d-wrap">
      <div
        ref={rootRef}
        className="ring3d"
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerEnter={() => { s.current.hover = true; }}
        onPointerLeave={() => { s.current.hover = false; }}
        onFocus={() => { s.current.hover = true; }}
        onBlur={() => { s.current.hover = false; }}
        onKeyDown={onKey}
      >
        <div className="ring3d-ring" ref={ringRef}>
          {items.map((it, i) => (
            <div
              key={it.key}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="ring3d-card"
              style={{ transform: `rotateY(${i * step}deg) translateZ(var(--r))` }}
            >
              {it.content}
            </div>
          ))}
        </div>
      </div>
      <div className="ring3d-controls">
        <button type="button" onClick={() => nudge(1)} aria-label="Previous discipline">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span>Drag to turn</span>
        <button type="button" onClick={() => nudge(-1)} aria-label="Next discipline">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}
