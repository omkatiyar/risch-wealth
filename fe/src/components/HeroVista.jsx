import ridges1400 from '../assets/hero-ridges-1400.webp';
import ridges760 from '../assets/hero-ridges-760.webp';

// The hero's visual: layered ridges at first light with a rising path —
// Preserve today, Grow tomorrow, Build generations. The path is drawn in
// SVG over the photo; the labels are HTML so they stay crisp at any size.
// Photo: Unsplash (free licence, photo-1500534314209-a25ddb2bd429).
// Decorative, so hidden from assistive tech.

// Points in a 1000 x 1000 box (the panel is stretched to fit, so the
// path is drawn with non-scaling strokes and the dots are HTML).
const STOPS = [
  { x: 16, y: 72, label: ['Preserve', 'today'] },
  { x: 54, y: 46, label: ['Grow', 'tomorrow'] },
  { x: 86, y: 18, label: ['Build', 'generations'] },
];
const PATH = 'M 40 860 C 110 800, 130 740, 160 720 S 300 690, 380 610 S 480 480, 540 460 S 700 380, 760 300 S 830 200, 860 180 S 930 110, 990 90';

export default function HeroVista() {
  return (
    <div className="hero-vista" aria-hidden="true">
      <img
        className="hv-photo"
        src={ridges1400}
        srcSet={`${ridges760} 760w, ${ridges1400} 1400w`}
        sizes="(max-width: 980px) 100vw, 50vw"
        alt=""
        width="1400"
        height="1447"
        fetchPriority="high"
      />
      <svg className="hv-path" viewBox="0 0 1000 1000" preserveAspectRatio="none" focusable="false">
        <path d={PATH} pathLength="1" vectorEffect="non-scaling-stroke" />
      </svg>
      {STOPS.map((s, i) => (
        <span key={s.label[0]} className={'hv-stop' + (i === STOPS.length - 1 ? ' hv-stop-end' : '')} style={{ left: `${s.x}%`, top: `${s.y}%`, '--d': `${0.6 + i * 0.45}s` }}>
          <span className="hv-dot" />
          <span className="hv-label">{s.label[0]}<br />{s.label[1]}</span>
        </span>
      ))}
    </div>
  );
}
