import { Link } from 'react-router-dom';
import { SEGMENTS, svgPath } from './LogoRing/ringGeometry';

// The RISCH wordmark over the brochure ring, as in the site header. The
// ring spins with the same CSS animation (no Three.js); reduced motion
// stops it. Used at the top of the portal sidebars.
export default function RingLogo({ to, label }) {
  return (
    <Link to={to} className="ring-logo" aria-label={label}>
      <svg viewBox="-1.02 -1.02 2.04 2.04" aria-hidden="true" focusable="false">
        {SEGMENTS.map((seg) => <path key={seg.tone} className={`lr-${seg.tone}`} d={svgPath(seg)} />)}
      </svg>
      <span>RISCH</span>
    </Link>
  );
}
