import { useEffect, useRef } from 'react';
import { HERO } from '../../content/solutions';

// Hero visual: PROFILE TO PORTFOLIO. Three inputs (risk tolerance, time
// horizon, behavioural profile) draw toward one point, "You"; only after it
// does a single line open into the portfolio building blocks. Thin SVG paths
// with a faint offset layer for depth; all labels are DOM text. No allocation
// figures, nothing is orbiting. Phones get a vertical version of the same
// sequence. Reduced motion shows the finished drawing.

const W = 640;
const H = 400;
const Y = 200;
const X = 300;
const IN = [70, 200, 330];
const OUT = [95, 200, 305];
const inPath = (y) => `M14 ${y} C190 ${y} 170 ${Y} ${X} ${Y}`;
const outPath = (y) => `M${X} ${Y} C355 ${Y} 365 ${y} 412 ${y}`;
const pct = (v, total) => `${(v / total) * 100}%`;

export default function ProfileToPortfolio() {
  const tiltRef = useRef(null);

  // desktop only: a degree or two of depth with the pointer
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return undefined;
    const ok = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1021px)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ok) return undefined;
    let raf = 0;
    const cur = { x: 0, y: 0 }; const tgt = { x: 0, y: 0 };
    const move = (e) => {
      tgt.y = (e.clientX / window.innerWidth - 0.5) * 4;
      tgt.x = -(e.clientY / window.innerHeight - 0.5) * 3;
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      cur.x += (tgt.x - cur.x) * 0.06; cur.y += (tgt.y - cur.y) * 0.06;
      el.style.transform = `perspective(1400px) rotateX(${cur.x.toFixed(2)}deg) rotateY(${cur.y.toFixed(2)}deg)`;
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); };
  }, []);

  return (
    <div className="pv">
      <div className="pv-stage" ref={tiltRef}>
        <svg className="pv-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
          {/* depth layer: the same paths, offset and fainter */}
          <g className="pv-back">
            {IN.map((y) => <path key={`b${y}`} d={inPath(y + 10)} pathLength="1" className="pv-line pv-in" />)}
            {OUT.map((y) => <path key={`o${y}`} d={outPath(y + 10)} pathLength="1" className="pv-line pv-out" />)}
          </g>
          {IN.map((y, i) => <path key={`i${y}`} d={inPath(y)} pathLength="1" className="pv-line pv-in pv-front" style={{ '--d': `${i * 0.12}s` }} />)}
          {OUT.map((y, i) => <path key={`p${y}`} d={outPath(y)} pathLength="1" className="pv-line pv-out pv-front" style={{ '--d': `${i * 0.1}s` }} />)}
          <circle cx={X} cy={Y} r="15" className="pv-ring" />
          <circle cx={X} cy={Y} r="6" className="pv-core" />
          {IN.map((y) => <circle key={`n${y}`} cx="14" cy={y} r="3" className="pv-node" />)}
          {OUT.map((y) => <circle key={`m${y}`} cx="412" cy={y} r="3" className="pv-node" />)}
        </svg>

        {HERO.inputs.map((t, i) => (
          <span key={t} className={'pv-label pv-label-in' + (i === 2 ? ' is-below' : '')} style={{ left: pct(14, W), top: pct(IN[i], H) }}>{t}</span>
        ))}
        <span className="pv-you" style={{ left: pct(X, W), top: pct(Y, H) }}>You</span>
        <span className="pv-arch" style={{ left: pct(340, W), top: pct(Y - 62, H) }}>{HERO.architecture}</span>
        {HERO.outputs.map((t, i) => (
          <span key={t} className="pv-label pv-label-out" style={{ left: pct(426, W), top: pct(OUT[i], H) }}>{t}</span>
        ))}
      </div>

      {/* phones: the same sequence, vertical */}
      <ol className="pv-m">
        {HERO.inputs.map((t) => <li key={t} className="pv-m-in">{t}</li>)}
        <li className="pv-m-you">You</li>
        <li className="pv-m-arch">{HERO.architecture}</li>
        <li className="pv-m-out">{HERO.outputs.map((t) => <span key={t}>{t}</span>)}</li>
      </ol>
    </div>
  );
}
