import { useEffect, useRef } from 'react';
import { TOGETHER } from '../../content/solutions';
import Icon from './Icons';

const STEP_ICONS = ['user', 'pie', 'layers', 'refresh'];

// The only numbered sequence on the page. A copper line draws down (or across)
// as the section scrolls into view.
export default function ProcessTimeline() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) { el.style.setProperty('--draw', '1'); return undefined; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.25)));
      el.style.setProperty('--draw', p.toFixed(3));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="pt" ref={ref}>
      <span className="pt-line" aria-hidden="true"><i /></span>
      <ol>
      {TOGETHER.steps.map(([t, d], i) => (
        <li key={t}>
          <span className="pt-head"><span className="pt-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><Icon name={STEP_ICONS[i]} size={24} className="pt-icon" /></span>
          <h3>{t}</h3>
          <p>{d}</p>
        </li>
      ))}
      </ol>
    </div>
  );
}
