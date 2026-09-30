import {
  useEffect, useId, useMemo, useRef, useState,
} from 'react';

// Portfolio value over time: value (orange line + light wash) and amount
// invested (blue step line) on one ₹ axis. Hover or arrow keys move a
// crosshair; the tooltip lists both. A table view is one click away.
// Colours are validated for colour-blind separation in light and dark
// (--chart-value / --chart-invested in styles/portal.css).
//   points: [{ date: 'YYYY-MM-DD', value, invested }]

const RANGES = [
  { key: '1M', days: 31 },
  { key: '3M', days: 92 },
  { key: '6M', days: 183 },
  { key: '1Y', days: 366 },
  { key: '3Y', days: 1096 },
  { key: 'All', days: Infinity },
];
const H = 280;
const PAD = { top: 16, right: 16, bottom: 30, left: 64 };
const DAY = 86_400_000;

const toTime = (d) => Date.parse(`${d}T00:00:00Z`);
const fmtDay = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
function inrAxis(n) {
  if (n >= 1e7) return `₹${+(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${+(n / 1e5).toFixed(1)} L`;
  if (n >= 1e3) return `₹${+(n / 1e3).toFixed(0)}K`;
  return `₹${Math.round(n)}`;
}

// ~5 round ticks covering [lo, hi]
function niceTicks(lo, hi) {
  const span = hi - lo || hi || 1;
  const raw = span / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
  const start = Math.floor(lo / step) * step;
  const ticks = [];
  for (let v = start; v <= hi + step * 0.001; v += step) ticks.push(v);
  if (ticks[ticks.length - 1] < hi) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

export default function ValueChart({ points, complete = true, title = 'Portfolio value' }) {
  const wrapRef = useRef(null);
  const fadeId = `vcFade${useId().replace(/:/g, '')}`;
  const [width, setWidth] = useState(720);
  const [active, setActive] = useState(null); // index into shown
  const spanDays = points.length ? (toTime(points[points.length - 1].date) - toTime(points[0].date)) / DAY : 0;
  const ranges = RANGES.filter((r) => r.key === 'All' || r.days < spanDays);
  const [range, setRange] = useState(null);
  const current = range && ranges.some((r) => r.key === range) ? range : (spanDays > 366 ? '1Y' : 'All');

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [points.length >= 2]); // the plot only exists once there's data

  const shown = useMemo(() => {
    if (!points.length) return [];
    const r = RANGES.find((x) => x.key === current);
    const end = toTime(points[points.length - 1].date);
    return r.days === Infinity ? points : points.filter((p) => toTime(p.date) >= end - r.days * DAY);
  }, [points, current]);

  if (points.length < 2) return null;

  const w = width;
  const iw = w - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const t0 = toTime(shown[0].date);
  const t1 = toTime(shown[shown.length - 1].date) || t0 + DAY;
  const vals = shown.flatMap((p) => [p.value, p.invested]);
  const ticks = niceTicks(Math.min(...vals) * 0.98, Math.max(...vals) * 1.01);
  const lo = ticks[0];
  const hi = ticks[ticks.length - 1];
  const x = (d) => PAD.left + ((toTime(d) - t0) / (t1 - t0 || 1)) * iw;
  const y = (v) => PAD.top + (1 - (v - lo) / (hi - lo || 1)) * ih;

  const valueLine = shown.map((p, i) => `${i ? 'L' : 'M'}${x(p.date).toFixed(1)},${y(p.value).toFixed(1)}`).join('');
  const area = `${valueLine}L${x(shown[shown.length - 1].date).toFixed(1)},${(PAD.top + ih).toFixed(1)}L${x(shown[0].date).toFixed(1)},${(PAD.top + ih).toFixed(1)}Z`;
  // invested only changes on purchase days: a step line
  const investedLine = shown.map((p, i) => {
    const px = x(p.date).toFixed(1);
    const py = y(p.invested).toFixed(1);
    if (!i) return `M${px},${py}`;
    return `H${px}V${py}`;
  }).join('');

  // x ticks: month starts (or every few months) that fit
  const months = [];
  const d0 = new Date(t0);
  for (let d = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth() + 1, 1)); d.getTime() <= t1; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))) months.push(d);
  const every = Math.max(1, Math.ceil(months.length / Math.max(2, Math.floor(iw / 80))));
  const xTicks = months.filter((_, i) => i % every === 0);
  const monthLabel = (d) => d.toLocaleDateString('en-IN', { month: 'short', timeZone: 'UTC' }) + (d.getUTCMonth() === 0 || months.length > 14 ? ` ${String(d.getUTCFullYear()).slice(2)}` : '');

  const last = shown[shown.length - 1];
  const act = active !== null && shown[active] ? shown[active] : null;

  const nearest = (clientX) => {
    const rect = wrapRef.current.querySelector('svg').getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * w;
    const t = t0 + ((px - PAD.left) / iw) * (t1 - t0);
    let best = 0;
    for (let i = 1; i < shown.length; i += 1) if (Math.abs(toTime(shown[i].date) - t) < Math.abs(toTime(shown[best].date) - t)) best = i;
    return best;
  };
  const onKey = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const i = active === null ? shown.length - 1 : active + (e.key === 'ArrowRight' ? 1 : -1);
    setActive(Math.max(0, Math.min(shown.length - 1, i)));
  };

  // table view: one row per month end
  const monthly = [];
  for (let i = 0; i < shown.length; i += 1) {
    const next = shown[i + 1];
    if (!next || next.date.slice(0, 7) !== shown[i].date.slice(0, 7)) monthly.push(shown[i]);
  }

  return (
    <section className="cp-card vc">
      <div className="vc-head">
        <div>
          <h2 className="cp-card-title">{title}</h2>
          <ul className="vc-legend">
            <li><span className="vc-key vc-key-value" />Value <strong>{inr(last.value)}</strong></li>
            <li><span className="vc-key vc-key-invested" />Invested <strong>{inr(last.invested)}</strong></li>
          </ul>
        </div>
        {ranges.length > 1 && (
          <div className="vc-ranges" role="group" aria-label="Time range">
            {ranges.map((r) => (
              <button key={r.key} type="button" className={r.key === current ? 'on' : ''} aria-pressed={r.key === current} onClick={() => { setRange(r.key); setActive(null); }}>{r.key}</button>
            ))}
          </div>
        )}
      </div>

      <div className="vc-plot" ref={wrapRef}>
        <svg
          width="100%" height={H} viewBox={`0 0 ${w} ${H}`} role="img" tabIndex={0}
          aria-label={`${title}, ${fmtDay(shown[0].date)} to ${fmtDay(last.date)}: from ${inr(shown[0].value)} to ${inr(last.value)}. Use the left and right arrow keys to read values.`}
          onPointerMove={(e) => setActive(nearest(e.clientX))}
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKey}
          onBlur={() => setActive(null)}
        >
          {/* the axis doesn't start at zero, so the wash fades out rather
              than reading as a filled quantity */}
          <defs>
            <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--chart-value)" stopOpacity="0.14" />
              <stop offset="1" stopColor="var(--chart-value)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line className="vc-grid" x1={PAD.left} x2={w - PAD.right} y1={y(t)} y2={y(t)} />
              <text className="vc-axis" x={PAD.left - 10} y={y(t)} dy="0.32em" textAnchor="end">{inrAxis(t)}</text>
            </g>
          ))}
          {xTicks.map((d) => (
            <text key={d.getTime()} className="vc-axis" x={x(d.toISOString().slice(0, 10))} y={H - 8} textAnchor="middle">{monthLabel(d)}</text>
          ))}
          <path className="vc-area" d={area} fill={`url(#${fadeId})`} />
          <path className="vc-line vc-line-invested" d={investedLine} />
          <path className="vc-line vc-line-value" d={valueLine} />
          {!act && <circle className="vc-dot" cx={x(last.date)} cy={y(last.value)} r="4.5" />}
          {act && (
            <g>
              <line className="vc-cross" x1={x(act.date)} x2={x(act.date)} y1={PAD.top} y2={PAD.top + ih} />
              <circle className="vc-dot vc-dot-invested" cx={x(act.date)} cy={y(act.invested)} r="4.5" />
              <circle className="vc-dot" cx={x(act.date)} cy={y(act.value)} r="4.5" />
            </g>
          )}
        </svg>
        {act && (
          <div className="vc-tip" style={{ left: `${(x(act.date) / w) * 100}%` }} data-flip={x(act.date) > w * 0.6 ? 'left' : 'right'} aria-live="polite">
            <span className="vc-tip-date">{fmtDay(act.date)}</span>
            <span className="vc-tip-row"><span className="vc-key vc-key-value" /><strong>{inr(act.value)}</strong> value</span>
            <span className="vc-tip-row"><span className="vc-key vc-key-invested" /><strong>{inr(act.invested)}</strong> invested</span>
          </div>
        )}
      </div>

      {!complete && <p className="cp-fine">Past NAVs are still being fetched from AMFI for a recent purchase; the chart fills in within a few minutes.</p>}
      <details className="vc-table">
        <summary>View as table</summary>
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead><tr><th>Date</th><th className="num">Value</th><th className="num">Invested</th></tr></thead>
            <tbody>
              {[...monthly].reverse().map((p) => (
                <tr key={p.date}><td>{fmtDay(p.date)}</td><td className="num">{inr(p.value)}</td><td className="num">{inr(p.invested)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
