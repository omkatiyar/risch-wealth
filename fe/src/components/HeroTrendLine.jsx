// The hero's signature graphic: a rising trend line, echoing a portfolio's
// growth curve. Predates the brochure "portfolio rings" motif; restored at
// the client's request in place of the scattered-circles version.
// Purely decorative — hidden from assistive tech.

const LINE_D = 'M0,400 C60,395 90,340 150,320 C210,300 240,360 300,335 C360,310 390,180 450,140 C500,105 540,90 600,70';
const FILL_D = `${LINE_D} L600,460 L0,460 Z`;
const GRIDLINES = [130, 250, 370];

export default function HeroTrendLine({ className = '' }) {
  return (
    <svg
      className={`hero-trend ${className}`}
      viewBox="0 0 600 460"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="heroTrendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.24" />
          <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="ht-grid">
        {GRIDLINES.map((y) => (
          <line key={y} x1="0" y1={y} x2="600" y2={y} />
        ))}
      </g>
      <path className="ht-fill" d={FILL_D} />
      <path className="ht-line" d={LINE_D} />
      <circle className="ht-dot-halo" cx="600" cy="70" r="12" />
      <circle className="ht-dot" cx="600" cy="70" r="5" />
    </svg>
  );
}
