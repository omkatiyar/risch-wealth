// The large ring from the RISCH brochure cover, on its own, as used behind
// the nav wordmark. One source of truth for both renderings:
//   - the static SVG (prerendered HTML, reduced-motion, no-WebGL fallback)
//   - the Three.js mesh (logoRingScene.js)
// Units: outer radius = 1. Angles in radians, counter-clockwise from +x.

// Inner/outer radius ratio of the brochure ring (130 / 355).
export const INNER = 0.366;

// Half the width of the gaps between segments, in outer-radius units.
// The gaps have parallel sides (like the white lines in print), so each
// edge is offset from the radial line rather than rotated.
export const HALF_GAP = 0.017;

// Segments as printed, in degrees clockwise from 12 o'clock, with a tone.
const PRINTED = [
  [-5, 96, 'strong'],
  [96, 233, 'light'],
  [233, 306, 'faint'],
  [306, 355, 'medium'],
];

const rad = (d) => (d * Math.PI) / 180;

// Clockwise-from-top [a, b] becomes counter-clockwise [t0, t1].
export const SEGMENTS = PRINTED.map(([a, b, tone]) => ({ tone, t0: rad(90 - b), t1: rad(90 - a) }));

// Arc endpoints for one segment, with the gap taken off both ends.
export function outline({ t0, t1 }) {
  const o = Math.asin(HALF_GAP);
  const i = Math.asin(HALF_GAP / INNER);
  return { a0o: t0 + o, a1o: t1 - o, a0i: t0 + i, a1i: t1 - i };
}

// SVG path for a segment. viewBox is centred on 0 with y pointing down.
export function svgPath(seg) {
  const { a0o, a1o, a0i, a1i } = outline(seg);
  const pt = (r, a) => `${(r * Math.cos(a)).toFixed(4)} ${(-r * Math.sin(a)).toFixed(4)}`;
  const largeO = a1o - a0o > Math.PI ? 1 : 0;
  const largeI = a1i - a0i > Math.PI ? 1 : 0;
  return `M${pt(1, a0o)}A1 1 0 ${largeO} 0 ${pt(1, a1o)}L${pt(INNER, a1i)}A${INNER} ${INNER} 0 ${largeI} 1 ${pt(INNER, a0i)}Z`;
}
