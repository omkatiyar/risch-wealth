import { HORIZONS, SLIDER_MAX, SLIDER_MIN, horizonForYears } from '../../content/solutions';

// A slider and four rows that stay in step: moving the slider highlights the
// portfolio it falls in, choosing a row moves the slider to that range.
export default function HorizonSelector({ years, onYears }) {
  const active = horizonForYears(years);
  const pct = ((years - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
  const label = years >= SLIDER_MAX ? `${SLIDER_MAX}+ years` : `${years} ${years === 1 ? 'year' : 'years'}`;
  return (
    <div className="hz">
      <div className="hz-slider">
        <div className="hz-read" aria-hidden="true"><strong>{label}</strong></div>
        <input
          type="range"
          min={SLIDER_MIN}
          max={SLIDER_MAX}
          step="1"
          value={years}
          onChange={(e) => onYears(Number(e.target.value))}
          aria-label="How long the capital can stay invested, in years"
          aria-valuetext={label}
          style={{ '--p': `${pct}%` }}
        />
        <div className="hz-ticks" aria-hidden="true">
          {[1, 5, 10, 15].map((n) => <span key={n} style={{ left: `${((n - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100}%` }}>{n === 15 ? '15+' : n}</span>)}
        </div>
      </div>
      <div className="hz-rows" role="radiogroup" aria-label="Portfolio by time horizon">
        {HORIZONS.map((h) => (
          <button
            key={h.id}
            type="button"
            role="radio"
            aria-checked={active === h.id}
            className={'hz-row' + (active === h.id ? ' is-on' : '')}
            onClick={() => onYears(h.at)}
          >
            <span className="hz-name">{h.name}</span>
            <span className="hz-span">{h.span}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
