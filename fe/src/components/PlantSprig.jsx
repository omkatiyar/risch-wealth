// Decorative botanical sprig for the empty eighth cell of the principles
// grid (drawn in SVG, so no image to load). Hidden from assistive tech.

const LEAF = 'M0 0 C 15 -20, 17 -56, 0 -86 C -17 -56, -15 -20, 0 0 Z';
const LEAVES = [
  [118, 262, -58, 1.15, 0], [116, 236, 52, 1.1, 1], [111, 206, -62, 1.05, 2], [108, 178, 48, 1.0, 0],
  [103, 148, -56, 0.95, 1], [100, 120, 44, 0.9, 2], [96, 92, -48, 0.82, 0], [94, 66, 38, 0.74, 1], [92, 40, -12, 0.62, 2],
];
const FILLS = ['var(--leaf-1)', 'var(--leaf-2)', 'var(--leaf-3)'];

export default function PlantSprig({ className = '' }) {
  return (
    <svg className={`plant-sprig ${className}`} viewBox="0 0 220 300" aria-hidden="true" focusable="false">
      <path d="M124 300 C 120 240, 104 150, 92 34" fill="none" stroke="var(--leaf-3)" strokeWidth="2.2" strokeLinecap="round" />
      {LEAVES.map(([x, y, r, s, c]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <path d={LEAF} fill={FILLS[c]} />
          <path d="M0 -4 C 1 -30, 1 -52, 0 -78" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.1" />
        </g>
      ))}
    </svg>
  );
}
