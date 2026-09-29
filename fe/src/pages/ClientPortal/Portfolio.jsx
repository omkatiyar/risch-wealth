import { useMemo, useState } from 'react';
import { AllocationCard, SummaryCard } from './Overview';
import {
  PageHead, assetColor, fmtDate, inr, nav, signedPct, tone, units,
} from './ui';

export default function Portfolio({ portfolio }) {
  const { summary, allocation, holdings } = portfolio;
  const [cls, setCls] = useState('All');
  const [q, setQ] = useState('');

  const shown = useMemo(() => holdings.filter((h) => (cls === 'All' || h.assetClass === cls)
    && (!q.trim() || `${h.name} ${h.amc || ''}`.toLowerCase().includes(q.trim().toLowerCase()))), [holdings, cls, q]);

  if (!holdings.length) {
    return (
      <>
        <PageHead title="Your portfolio" sub="Your investments across asset classes." />
        <section className="cp-card cp-empty">
          <h2 className="cp-card-title">No holdings yet</h2>
          <p>Once our team has recorded your investments, they will appear here with their current value and returns.</p>
        </section>
      </>
    );
  }

  const counts = allocation.map((a) => [a.assetClass, holdings.filter((h) => h.assetClass === a.assetClass).length]);
  const maxX = Math.max(...allocation.map((a) => Math.abs(a.xirr ?? 0)), 1);

  return (
    <>
      <PageHead title="Your portfolio" sub={`Your investments across asset classes, valued at the NAV of ${fmtDate(summary.navDate)}.`} />
      <SummaryCard summary={summary} cta={false} />

      <div className="cp-grid cp-grid-2">
        <AllocationCard allocation={allocation} total={summary.currentValue} link={false} />
        <section className="cp-card">
          <h2 className="cp-card-title">Returns by asset class</h2>
          <p className="cp-muted cp-card-note">Annualised (XIRR) since your first investment in each.</p>
          <ul className="cp-xirr">
            {allocation.map((a) => (
              <li key={a.assetClass}>
                <span className="cp-xirr-name">{a.assetClass}</span>
                <span className="cp-xirr-track">
                  {a.xirr !== null && <span className="cp-xirr-fill" style={{ width: `${(Math.abs(a.xirr) / maxX) * 100}%`, background: a.xirr < 0 ? 'var(--neg)' : assetColor(a.assetClass) }} />}
                </span>
                <span className={'cp-xirr-val ' + tone(a.xirr)}>{a.xirr === null ? '—' : signedPct(a.xirr)}</span>
              </li>
            ))}
          </ul>
          {allocation.some((a) => a.xirr === null) && <p className="cp-fine">— XIRR is shown once an investment is 30 days old.</p>}
        </section>
      </div>

      <section className="cp-card">
        <div className="cp-card-head cp-holdings-head">
          <h2 className="cp-card-title">Holdings</h2>
          <input type="search" className="cp-search" placeholder="Search your funds" aria-label="Search your funds" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="cp-chips" role="group" aria-label="Filter by asset class">
          <button type="button" className={cls === 'All' ? 'on' : ''} aria-pressed={cls === 'All'} onClick={() => setCls('All')}>All ({holdings.length})</button>
          {counts.map(([c, n]) => (
            <button key={c} type="button" className={cls === c ? 'on' : ''} aria-pressed={cls === c} onClick={() => setCls(c)}>{c} ({n})</button>
          ))}
        </div>
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Fund</th><th>Asset class</th><th className="num">Units</th><th className="num">Current NAV</th>
                <th className="num">Invested</th><th className="num">Current value</th><th className="num">Return</th><th className="num">XIRR</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((h) => (
                <tr key={h.schemeCode}>
                  <td className="cp-fund"><strong>{h.name}</strong><span>{h.amc}</span></td>
                  <td><span className="cp-swatch" style={{ background: assetColor(h.assetClass) }} />{h.assetClass}</td>
                  <td className="num">{units(h.units)}</td>
                  <td className="num">{nav(h.nav)}</td>
                  <td className="num">{inr(h.invested)}</td>
                  <td className="num"><strong>{inr(h.currentValue)}</strong></td>
                  <td className={'num ' + tone(h.returnPct)}>{signedPct(h.returnPct)}</td>
                  <td className={'num ' + tone(h.xirr)}>{h.xirr === null ? '—' : signedPct(h.xirr)}</td>
                </tr>
              ))}
              {shown.length === 0 && <tr><td colSpan={8} className="cp-muted">No funds match.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
