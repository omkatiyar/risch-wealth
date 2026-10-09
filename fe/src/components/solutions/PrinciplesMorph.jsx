import { useEffect, useMemo, useRef, useState } from 'react';

// The seven investment principles as flip cards that scatter, line up, form
// a circle and then open into an arc as the visitor scrolls. The page's own
// scroll drives it: the section is tall and its stage is `position: sticky`,
// so the wheel and touch are never captured and the page always scrolls on.
// Hover, keyboard focus or a tap turns a card over to its explanation.
// Plain CSS transitions (no animation library). Phones and reduced-motion
// visitors get PrinciplesGrid instead (see Solutions.jsx).
//
//   principles: [{ title, body, icon }]   (src/data/principles.jsx)

const CARD_W = 168;
const lerp = (a, b, t) => a * (1 - t) + b * t;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

function FlipCard({ p, index, target, phase }) {
  const [flipped, setFlipped] = useState(false);
  const { x, y, rotation, scale, opacity, z } = target;
  return (
    <div
      className={'pm-card' + (flipped ? ' is-flipped' : '') + ` is-${phase}`}
      style={{ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`, opacity, zIndex: z }}
      role="group"
      aria-label={`${index + 1}. ${p.title}`}
      tabIndex={0}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((f) => !f); } }}
    >
      <div className="pm-inner">
        <div className="pm-face pm-front">
          <span className="pm-num">{String(index + 1).padStart(2, '0')}</span>
          <span className="pm-icon"><Svg>{p.icon}</Svg></span>
          <strong>{p.title}</strong>
          <span className="pm-hint">Hover to read</span>
        </div>
        <div className="pm-face pm-back">
          <span className="pm-back-num">{String(index + 1).padStart(2, '0')}</span>
          <p>{p.body}</p>
        </div>
      </div>
    </div>
  );
}

export default function PrinciplesMorph({ principles, hint, top }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const areaRef = useRef(null);
  const [size, setSize] = useState({ w: 1200, h: 800 });
  const [phase, setPhase] = useState('scatter');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // intro: scatter, then a line, then a circle, once the stage is on screen
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return undefined;
    let t1 = 0; let t2 = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      t1 = window.setTimeout(() => setPhase('line'), 150);
      t2 = window.setTimeout(() => setPhase('circle'), 1500);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(t1); window.clearTimeout(t2); };
  }, []);

  // page scroll through the tall section drives the morph
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      setProgress(clamp01(-r.top / span));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // first the circle opens into an arc, then the arc slowly slides so every card passes the centre
  const morph = clamp01(progress / 0.3);
  const shuffle = clamp01((progress - 0.3) / 0.7);

  const n = principles.length;
  // a fixed scatter (golden-ratio spacing), so renders are pure and repeatable
  const scatter = useMemo(() => principles.map((_, i) => ({
    x: (((i * 0.618) % 1) - 0.5) * 1400, y: (((i * 0.382 + 0.2) % 1) - 0.5) * 800, rotation: (((i * 0.754) % 1) - 0.5) * 160, scale: 0.6, opacity: 0, z: 1,
  })), [principles]);

  const isMobile = size.w < 820;
  const cardScale = isMobile ? 1.05 : 1.3;

  const targets = principles.map((_, i) => {
    if (phase === 'scatter') return scatter[i];
    if (phase === 'line') {
      const spacing = CARD_W + 14;
      return { x: i * spacing - ((n - 1) * spacing) / 2, y: -30, rotation: 0, scale: 1, opacity: 1, z: 1 };
    }
    const radius = Math.min(size.h * 0.3, size.w * 0.3, 240);
    const ca = (i / n) * Math.PI * 2 - Math.PI / 2;
    const circle = { x: Math.cos(ca) * radius, y: Math.sin(ca) * radius - 20, rotation: (ca * 180) / Math.PI + 90 };

    // arc: a rainbow whose apex sits a little below the centre of the stage
    const arcR = Math.min(size.w, size.h * 1.5) * (isMobile ? 1.5 : 1.15);
    const apexY = size.h * (isMobile ? 0.05 : -0.1);
    const centerY = apexY + arcR;
    const spacingPx = CARD_W * cardScale * 1.03;
    const stepDeg = ((spacingPx / arcR) * 180) / Math.PI;
    const spread = stepDeg * (n - 1);
    const slide = (0.5 - shuffle) * spread * 0.2;
    const angle = -90 - spread / 2 + i * stepDeg + slide;
    const rad = (angle * Math.PI) / 180;
    const off = Math.abs(angle + 90) / stepDeg;
    const boost = 1 + 0.16 * clamp01(1 - off / 1.2); // the card nearest the centre grows a little
    const arc = { x: Math.cos(rad) * arcR, y: Math.sin(rad) * arcR + centerY, rotation: angle + 90, scale: cardScale * boost };
    return {
      x: lerp(circle.x, arc.x, morph),
      y: lerp(circle.y, arc.y, morph),
      rotation: lerp(circle.rotation, arc.rotation, morph),
      scale: lerp(0.75, arc.scale, morph),
      opacity: 1,
      z: 1 + Math.round(boost * 10 - off),
    };
  });

  const introOpacity = phase === 'circle' ? clamp01(1 - morph * 2.4) : 0;
  const headOpacity = clamp01((morph - 0.65) / 0.35);

  return (
    <div className="pm-section" ref={sectionRef}>
      <div className="pm-stage" ref={stageRef}>
        <div className="pm-top">{top}</div>
        <div className="pm-area" ref={areaRef}>
          <div className="pm-intro" style={{ opacity: introOpacity }} aria-hidden="true">
            <p>Seven principles</p>
            <span>Scroll to explore</span>
          </div>
          <p className="pm-hint-line" style={{ opacity: headOpacity }}>{hint}</p>
          <div className="pm-cards">
            {principles.map((p, i) => (
              <FlipCard key={p.title} p={p} index={i} target={targets[i]} phase={phase} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// phones and reduced motion: seven plain cards, no scroll effect
export function PrinciplesGrid({ principles, title }) {
  return (
    <div className="pg">
      <h3>{title}</h3>
      <ol>
        {principles.map((p, i) => (
          <li key={p.title}>
            <span className="pg-n">{String(i + 1).padStart(2, '0')}</span>
            <div><h4>{p.title}</h4><p>{p.body}</p></div>
          </li>
        ))}
      </ol>
    </div>
  );
}
