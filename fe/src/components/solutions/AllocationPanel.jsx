import { useEffect, useRef, useState } from 'react';
import { ALLOCATION, ASSET_CLASSES, HORIZONS, ILLUSTRATIVE_ALLOCATIONS, PORTFOLIO_SUITS } from '../../content/solutions';

const valuesFor = (id) => ASSET_CLASSES.map((a) => ILLUSTRATIVE_ALLOCATIONS[id][a.id]);

// flat SVG donut: first paint, no-WebGL and reduced-power fallback
function FlatDonut({ values, hover, onHover }) {
  const r = 70; const c = 2 * Math.PI * r;
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const starts = values.map((_, i) => values.slice(0, i).reduce((a, b) => a + b, 0) / total * c);
  return (
    <svg className="al-svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      {values.map((v, i) => {
        const len = (v / total) * c;
        return (
          <circle key={ASSET_CLASSES[i].id} cx="100" cy="100" r={r} fill="none" stroke={ASSET_CLASSES[i].color} strokeWidth={hover === i ? 38 : 30}
            strokeDasharray={`${Math.max(0, len - 1.6)} ${c}`} strokeDashoffset={-starts[i]} transform="rotate(-90 100 100)"
            opacity={hover >= 0 && hover !== i ? 0.45 : 1} className={'al-seg' + (hover === i ? ' is-hot' : '')} style={{ pointerEvents: 'stroke' }}
            onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(-1)} />
        );
      })}
    </svg>
  );
}

export default function AllocationPanel({ portfolio, onPortfolio }) {
  const hostRef = useRef(null);
  const handle = useRef(null);
  const latest = useRef(portfolio);
  const [live, setLive] = useState(false);
  const [hover, setHover] = useState(-1);
  const values = valuesFor(portfolio);
  useEffect(() => { latest.current = portfolio; }, [portfolio]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = window.matchMedia('(max-width: 819px)').matches;
    const weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 2;
    if (narrow && weak) return undefined;
    const probe = document.createElement('canvas');
    if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return undefined;
    let cancelled = false;
    // only load three.js when the section is close to the screen
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      import('./donut3d').then(({ mountDonut }) => {
        if (cancelled) return;
        const h = mountDonut(host, { colors: ASSET_CLASSES.map((a) => a.color), values: valuesFor(latest.current), reduced, onHover: setHover });
        if (h) { handle.current = h; setLive(true); }
      }).catch(() => {});
    }, { rootMargin: '300px 0px' });
    io.observe(host);
    return () => { cancelled = true; io.disconnect(); handle.current?.dispose(); handle.current = null; setLive(false); };
  }, []);

  useEffect(() => { handle.current?.setValues(valuesFor(portfolio)); }, [portfolio]);
  useEffect(() => { handle.current?.setHover(hover); }, [hover]);

  const h = HORIZONS.find((x) => x.id === portfolio);
  const onKey = (e) => {
    const i = HORIZONS.findIndex((x) => x.id === portfolio);
    const n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : null;
    if (n === null) return;
    e.preventDefault();
    const next = HORIZONS[(n + HORIZONS.length) % HORIZONS.length];
    onPortfolio(next.id);
    document.getElementById(`al-tab-${next.id}`)?.focus();
  };

  return (
    <div className="al">
      <div className="al-tabs" role="tablist" aria-label="Portfolio" onKeyDown={onKey}>
        {HORIZONS.map((x) => (
          <button
            key={x.id}
            id={`al-tab-${x.id}`}
            type="button"
            role="tab"
            aria-selected={portfolio === x.id}
            aria-controls="al-panel"
            tabIndex={portfolio === x.id ? 0 : -1}
            className={'al-tab' + (portfolio === x.id ? ' is-on' : '')}
            onClick={() => onPortfolio(x.id)}
          >
            {x.name.replace(' Portfolio', '')}
          </button>
        ))}
      </div>
      <div className="al-body" id="al-panel" role="tabpanel" aria-labelledby={`al-tab-${portfolio}`}>
        <div className="al-copy">
          <p className="al-span">{h.span}</p>
          <p className="al-suits">{PORTFOLIO_SUITS[portfolio]}</p>
          <ul className="al-legend">
            {ASSET_CLASSES.map((a, i) => (
              <li key={a.id} className={hover === i ? 'is-hot' : ''} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}>
                <i style={{ background: a.color }} aria-hidden="true" />
                <span>{a.name}</span>
                <b>{values[i]}%</b>
              </li>
            ))}
          </ul>
        </div>
        <div className={'al-visual' + (live ? ' is-live' : '')} role="img" aria-label={`${ALLOCATION.label} allocation chart for the ${h.name}: ${ASSET_CLASSES.map((a, i) => `${a.name} ${values[i]} percent`).join(', ')}.`}>
          <FlatDonut values={values} hover={hover} onHover={setHover} />
          <div className="al-canvas" ref={hostRef} />
          <div className={'al-center' + (hover >= 0 ? ' is-on' : '')} aria-hidden="true">
            {hover >= 0 && <><strong>{values[hover]}%</strong><span>{ASSET_CLASSES[hover].name}</span></>}
          </div>
          <span className="al-stamp">{ALLOCATION.label}</span>
        </div>
      </div>
    </div>
  );
}
