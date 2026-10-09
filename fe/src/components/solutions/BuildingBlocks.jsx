import { useState } from 'react';
import { TOGETHER } from '../../content/solutions';

// Nine blocks, two columns of hairline rows. Hover, focus or tap opens the row.
export default function BuildingBlocks() {
  const [open, setOpen] = useState(null);
  return (
    <ul className="bb">
      {TOGETHER.blocks.map((b, i) => {
        const on = open === i;
        return (
          <li key={b.name} className={on ? 'is-on' : ''} onMouseEnter={() => setOpen(i)} onMouseLeave={() => setOpen((o) => (o === i ? null : o))}>
            <button type="button" aria-expanded={on} aria-controls={`bb-${i}`} onClick={() => setOpen(on ? null : i)}>
              <span className="bb-name">{b.name}</span>
              <span className="bb-role">{b.role}</span>
              <span className="bb-plus" aria-hidden="true" />
            </button>
            <div className="bb-more" id={`bb-${i}`}>
              <div><p><span>Held through</span>{b.through}</p></div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
