import { useEffect, useState } from 'react';
import { clientTransactions } from '../../api/authApi';
import {
  PageHead, fmtDate, inr, nav, units,
} from './ui';

const TYPE = { purchase: 'Purchase' };

export default function Transactions() {
  const [filters, setFilters] = useState({ from: '', to: '', fund: '' });
  const [page, setPage] = useState(1);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let live = true;
    clientTransactions({ page, ...filters })
      .then((r) => { if (live) { setRes(r); setErr(''); } })
      .catch((e) => { if (live) setErr(e.message); });
    return () => { live = false; };
  }, [page, filters]);

  const set = (k) => (e) => { setPage(1); setFilters((f) => ({ ...f, [k]: e.target.value })); };
  const pages = res ? Math.max(1, Math.ceil(res.total / res.pageSize)) : 1;
  const first = res && res.total ? (res.page - 1) * res.pageSize + 1 : 0;
  const last = res ? Math.min(res.page * res.pageSize, res.total) : 0;
  const filtered = filters.from || filters.to || filters.fund;

  return (
    <>
      <PageHead title="Transactions" sub="Every investment recorded in your account." />
      <section className="cp-card">
        <div className="cp-filters">
          <div className="field">
            <label htmlFor="txFrom">From</label>
            <input id="txFrom" type="date" value={filters.from} max={filters.to || undefined} onChange={set('from')} />
          </div>
          <div className="field">
            <label htmlFor="txTo">To</label>
            <input id="txTo" type="date" value={filters.to} min={filters.from || undefined} onChange={set('to')} />
          </div>
          <div className="field cp-filter-fund">
            <label htmlFor="txFund">Fund</label>
            <select id="txFund" value={filters.fund} onChange={set('fund')}>
              <option value="">All funds</option>
              {res?.funds.map((f) => <option key={f.schemeCode} value={f.schemeCode}>{f.name}</option>)}
            </select>
          </div>
          {filtered && <button type="button" className="cp-link cp-clear" onClick={() => { setPage(1); setFilters({ from: '', to: '', fund: '' }); }}>Clear filters</button>}
        </div>

        {err && <p className="auth-note" role="alert">{err}</p>}
        {!res ? <p className="cp-muted">Loading…</p> : (
          <>
            <div className="cp-table-wrap">
              <table className="cp-table">
                <thead>
                  <tr><th>Date</th><th>Type</th><th>Fund</th><th>Folio</th><th className="num">Amount</th><th className="num">NAV</th><th className="num">Units</th></tr>
                </thead>
                <tbody>
                  {res.transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{fmtDate(t.date)}</td>
                      <td><span className="cp-type">{TYPE[t.type] || t.type}</span></td>
                      <td className="cp-fund"><strong>{t.fundName}</strong></td>
                      <td>{t.folio || '—'}</td>
                      <td className="num"><strong>{inr(t.amount)}</strong></td>
                      <td className="num">{nav(t.nav)}</td>
                      <td className="num">{units(t.units)}</td>
                    </tr>
                  ))}
                  {res.transactions.length === 0 && (
                    <tr><td colSpan={7} className="cp-muted">{filtered ? 'No transactions match these filters.' : 'No transactions yet.'}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {res.total > 0 && (
              <div className="cp-pager">
                <span>Showing {first}–{last} of {res.total}</span>
                {pages > 1 && (
                  <nav aria-label="Pages">
                    <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page">‹</button>
                    {Array.from({ length: pages }, (_, i) => i + 1)
                      .filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1)
                      .map((n, i, arr) => (
                        <span key={n}>
                          {i > 0 && n - arr[i - 1] > 1 && <span className="cp-ellipsis">…</span>}
                          <button type="button" className={n === page ? 'on' : ''} aria-current={n === page ? 'page' : undefined} onClick={() => setPage(n)}>{n}</button>
                        </span>
                      ))}
                    <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)} aria-label="Next page">›</button>
                  </nav>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
