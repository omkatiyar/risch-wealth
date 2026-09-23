import { QUESTIONS } from '../data';

const q7 = QUESTIONS.find((q) => q.id === 'q7');

export default function RRChart({ selectedLabel }) {
  const maxAbs = Math.max(...q7.options.map((o) => Math.max(o.best, Math.abs(o.worst))));
  const half = 46;    // pixel height available for the taller of best/worst on either side of baseline
  const gutter = 16;  // reserved space for the value label so it can never collide with text above/below
  const baseline = half + gutter;
  const total = baseline * 2;

  return (
    <>
      <div className="rr-chart">
        {q7.options.map((o) => {
          const bestH = (o.best / maxAbs) * half;
          const worstH = (Math.abs(o.worst) / maxAbs) * half;
          const bestLabelTop = Math.max(0, baseline - bestH - 12).toFixed(1);
          const worstLabelBottom = Math.max(0, baseline - worstH - 12).toFixed(1);
          const isSel = selectedLabel === o.label;
          const ring = isSel ? { boxShadow: '0 0 0 2px var(--orange-deep)' } : {};
          return (
            <div className="rr-col" key={o.label}>
              <div className="rr-col-inner" style={{ height: total + 'px' }}>
                <div className="rr-baseline" style={{ top: baseline + 'px' }}></div>
                <div className="rr-bar best" style={{ bottom: baseline + 'px', height: bestH.toFixed(1) + 'px', ...ring }}></div>
                <span className="rr-val rr-val-best" style={{ top: bestLabelTop + 'px' }}>+{o.best}%</span>
                <div className="rr-bar worst" style={{ top: baseline + 'px', height: worstH.toFixed(1) + 'px', ...ring }}></div>
                <span className="rr-val rr-val-worst" style={{ bottom: worstLabelBottom + 'px' }}>{o.worst}%</span>
              </div>
              <div className={'rr-label' + (isSel ? ' sel' : '')}>{o.label}{isSel ? ' (Selected)' : ''}</div>
            </div>
          );
        })}
      </div>
      <div className="rr-legend">
        <span><i style={{ background: 'var(--orange)' }}></i>Best case (1-yr)</span>
        <span><i style={{ background: '#D9B48A' }}></i>Worst case (1-yr)</span>
      </div>
    </>
  );
}
