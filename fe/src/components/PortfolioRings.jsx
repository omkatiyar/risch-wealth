import { useId } from 'react';

// The overlapping portfolio rings from the cover of RISCH's client
// brochure ("RISCH Wealth & RISCH Family Office — We Manage Portfolios"),
// redrawn as vector artwork so it stays sharp at any size and follows
// the site theme. Coordinates are in the brochure's own 1288×1000 frame.
// Decorative only.

const RINGS = [
  // Large ring. Angles are degrees clockwise from 12 o'clock.
  { key: 'big', cx: 690, cy: 480, R: 355, r: 130, segs: [[-5, 96, 'strong'], [96, 233, 'light'], [233, 306, 'faint'], [306, 355, 'medium']] },
  { key: 'med', cx: 1015, cy: 210, R: 210, r: 85, segs: [[0, 134, 'medium'], [134, 315, 'light'], [315, 360, 'faint']] },
  { key: 'small', cx: 505, cy: 830, R: 108, r: 42, segs: [[0, 133, 'medium'], [133, 313, 'light'], [313, 360, 'faint']] },
];

// Line-hatched discs behind the rings: [cx, cy, radius, line spacing]
const HATCHES = [
  [420, 170, 100, 13],
  [150, 730, 235, 24],
  [1200, 620, 145, 12],
  [1035, 830, 80, 8],
];

function point(cx, cy, radius, deg) {
  const rad = (deg * Math.PI) / 180;
  return [cx + radius * Math.sin(rad), cy - radius * Math.cos(rad)];
}

function segmentPath(cx, cy, R, r, start, end) {
  const large = end - start > 180 ? 1 : 0;
  const [x1, y1] = point(cx, cy, R, start);
  const [x2, y2] = point(cx, cy, R, end);
  const [x3, y3] = point(cx, cy, r, end);
  const [x4, y4] = point(cx, cy, r, start);
  const f = (n) => n.toFixed(1);
  return `M${f(x1)} ${f(y1)}A${R} ${R} 0 ${large} 1 ${f(x2)} ${f(y2)}L${f(x3)} ${f(y3)}A${r} ${r} 0 ${large} 0 ${f(x4)} ${f(y4)}Z`;
}

export default function PortfolioRings({ className = '' }) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg className={`portfolio-rings ${className}`} viewBox="0 0 1288 1000" role="presentation" aria-hidden="true" focusable="false">
      <defs>
        {HATCHES.map(([, , , gap], i) => (
          <pattern key={i} id={`${uid}h${i}`} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2={gap} y2="0" className="pr-hatch-line" />
          </pattern>
        ))}
      </defs>

      <g className="pr-hatches">
        {HATCHES.map(([cx, cy, radius], i) => (
          <circle key={i} cx={cx} cy={cy} r={radius} fill={`url(#${uid}h${i})`} />
        ))}
      </g>

      {RINGS.map((ring) => (
        <g key={ring.key} className={`pr-ring pr-ring-${ring.key}`}>
          {ring.segs.map(([start, end, tone]) => (
            <path key={start} className={`pr-seg pr-${tone}`} d={segmentPath(ring.cx, ring.cy, ring.R, ring.r, start, end)} />
          ))}
          {/* the thin gaps between segments */}
          {ring.segs.map(([start]) => {
            const [x1, y1] = point(ring.cx, ring.cy, ring.r - 2, start);
            const [x2, y2] = point(ring.cx, ring.cy, ring.R + 2, start);
            return <line key={`g${start}`} className="pr-gap" x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
      ))}
    </svg>
  );
}
