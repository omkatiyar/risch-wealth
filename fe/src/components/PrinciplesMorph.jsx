import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion, useInView, useMotionValueEvent, useScroll, useSpring,
} from 'framer-motion';

// The seven investment principles as flip cards that scatter, line up, form
// a circle and then open into an arc as the visitor scrolls (adapted from
// the "scroll morph hero" component: JSX and plain CSS instead of
// TypeScript and Tailwind).
//
// Unlike the original, the page's own scroll drives the morph: the section
// is tall and the stage inside it is `position: sticky`, so the wheel and
// touch scrolling are never captured and the visitor can always scroll on.
// Hover, keyboard focus or a tap turns a card over to its explanation.
//
//   principles: [{ title, body, icon }]   (src/data/principles.jsx)

const CARD_W = 150;
const CARD_H = 212;
const lerp = (a, b, t) => a * (1 - t) + b * t;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

function FlipCard({ p, index, target }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      className={'pm-card' + (flipped ? ' is-flipped' : '')}
      animate={{
        x: target.x, y: target.y, rotate: target.rotation, scale: target.scale, opacity: target.opacity,
      }}
      transition={{ type: 'spring', stiffness: 46, damping: 16 }}
      style={{ width: CARD_W, height: CARD_H, zIndex: target.z }}
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
    </motion.div>
  );
}

export default function PrinciplesMorph({ principles, eyebrow, title, sub }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const [size, setSize] = useState({ w: 1200, h: 800 });
  const [phase, setPhase] = useState('scatter');
  const [morph, setMorph] = useState(0);
  const [shuffle, setShuffle] = useState(0);
  const inView = useInView(stageRef, { amount: 0.35, once: true });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  // intro: scatter -> line -> circle, once the stage is on screen
  useEffect(() => {
    if (!inView) return undefined;
    const t1 = setTimeout(() => setPhase('line'), 150);
    const t2 = setTimeout(() => setPhase('circle'), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView]);

  // scroll through the tall section: first the circle opens into an arc,
  // then the arc slowly slides so every card passes the centre
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.6 });
  useMotionValueEvent(smooth, 'change', (v) => {
    setMorph(clamp01(v / 0.3));
    setShuffle(clamp01((v - 0.3) / 0.7));
  });

  const n = principles.length;
  const scatter = useMemo(() => principles.map(() => ({
    x: (Math.random() - 0.5) * 1400, y: (Math.random() - 0.5) * 800, rotation: (Math.random() - 0.5) * 160, scale: 0.6, opacity: 0, z: 1,
  })), [principles]);

  const isMobile = size.w < 820;
  const cardScale = isMobile ? 1.15 : 1.4;

  const targets = principles.map((_, i) => {
    if (phase === 'scatter') return scatter[i];
    if (phase === 'line') {
      const spacing = CARD_W + 14;
      return { x: i * spacing - ((n - 1) * spacing) / 2, y: -30, rotation: 0, scale: 1, opacity: 1, z: 1 };
    }
    // circle
    const radius = Math.min(Math.min(size.w, size.h) * 0.3, 280);
    const ca = (i / n) * Math.PI * 2 - Math.PI / 2;
    const circle = { x: Math.cos(ca) * radius, y: Math.sin(ca) * radius - 20, rotation: (ca * 180) / Math.PI + 90 };

    // arc: a rainbow whose apex sits low in the stage, under the heading
    const arcR = Math.min(size.w, size.h * 1.5) * (isMobile ? 1.5 : 1.15);
    const apexY = size.h * (isMobile ? 0.28 : 0.09);
    const centerY = apexY + arcR;
    const spacingPx = CARD_W * cardScale * 1.03;
    const stepDeg = ((spacingPx / arcR) * 180) / Math.PI;
    const spread = stepDeg * (n - 1);
    const slide = (0.5 - shuffle) * spread * 0.2;
    const angle = -90 - spread / 2 + i * stepDeg + slide;
    const rad = (angle * Math.PI) / 180;
    // the card nearest the centre grows a little
    const off = Math.abs(angle + 90) / stepDeg;
    const boost = 1 + 0.16 * clamp01(1 - off / 1.2);
    const arc = {
      x: Math.cos(rad) * arcR, y: Math.sin(rad) * arcR + centerY, rotation: angle + 90, scale: cardScale * boost,
    };
    return {
      x: lerp(circle.x, arc.x, morph),
      y: lerp(circle.y, arc.y, morph),
      rotation: lerp(circle.rotation, arc.rotation, morph),
      scale: lerp(1, arc.scale, morph),
      opacity: 1,
      z: 1 + Math.round(boost * 10 - off),
    };
  });

  const introOpacity = phase === 'circle' ? clamp01(1 - morph * 2.4) : 0;
  const headOpacity = clamp01((morph - 0.65) / 0.35);

  return (
    <section className="pm-section" ref={sectionRef} aria-label={title}>
      <div className="pm-stage" ref={stageRef}>
        <div className="pm-intro" style={{ opacity: introOpacity }} aria-hidden="true">
          <p>Seven principles</p>
          <span>Scroll to explore</span>
        </div>

        <div className="pm-head" style={{ opacity: headOpacity, transform: `translateY(${(1 - headOpacity) * 18}px)` }}>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="sv-h2">{title}</h2>
          <p className="sv-sub">{sub}</p>
        </div>

        <div className="pm-cards">
          {principles.map((p, i) => (
            <FlipCard key={p.title} p={p} index={i} target={targets[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}
