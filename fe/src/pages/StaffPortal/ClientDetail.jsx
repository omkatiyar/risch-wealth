import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { clientHistoryAdmin, clientPortfolioAdmin, voidOrder } from '../../api/authApi';
import ValueChart from '../../components/ValueChart';
import {
  Icons, assetColor, fmtDate, inr, nav, signedPct, tone, units,
} from '../ClientPortal/ui';
import { AllocationCard } from '../ClientPortal/Overview';
import { NavUpdate, RowMenu, initials } from './common';

const B = '/employee-portal';
const TYPE = { purchase: 'Purchase' };

export default function ClientDetail({ id, tab }) {
  const { state } = useLocation();
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  const [note, setNote] = useState(state?.saved || '');
  const [history, setHistory] = useState(null);
  const load = useCallback(() => {
    clientHistoryAdmin(id).then(setHistory).catch(() => {});
    return clientPortfolioAdmin(id).then((r) => { setD(r); setErr(''); }).catch((e) => setErr(e.message));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  if (err && !d) return <p className="auth-note" role="alert">{err}</p>;
  if (!d) return <p className="cp-loading">Loading…</p>;
  const { client, portfolio, orders } = d;
  const { summary, allocation, holdings } = portfolio;
  const base = `${B}/clients/${id}`;

  return (
    <>
      <p className="sp-crumbs"><Link to={`${B}/clients`}>Client portfolios</Link> <span aria-hidden="true">›</span> {client.fullName}</p>
      <section className="cp-card sp-client-head">
        <span className="sp-initials" aria-hidden="true">{initials(client.fullName)}</span>
        <div className="sp-client-id">
          <h1>{client.fullName} <span className={'status-pill ' + (client.status === 'active' ? 'active' : 'disabled')}>{client.status === 'active' ? 'Active' : client.status}</span></h1>
          <p>{client.email}{client.phone ? ` · ${client.phone}` : ''} · Client ID {client.id} · Client since {fmtDate(client.clientSince)}</p>
        </div>
        <div className="sp-client-value">
          <span>Total portfolio value</span>
          <strong>{holdings.length ? inr(summary.currentValue) : '–'}</strong>
          <span>{holdings.length} {holdings.length === 1 ? 'fund' : 'funds'}</span>
        </div>
        <Link to={`${base}/purchase`} className="btn btn-primary cp-btn-sm sp-head-btn"><Icons.plus /> Add purchase</Link>
      </section>

      <nav className="cp-tabs" aria-label="Client sections">
        <NavLink to={base} end className={({ isActive }) => (isActive ? 'on' : '')}>Overview</NavLink>
        <NavLink to={`${base}/holdings`} className={({ isActive }) => (isActive ? 'on' : '')}>Holdings ({holdings.length})</NavLink>
        <NavLink to={`${base}/transactions`} className={({ isActive }) => (isActive ? 'on' : '')}>Transactions ({orders.filter((o) => o.status === 'active').length})</NavLink>
      </nav>

      {holdings.length > 0 && <NavUpdate compact onUpdated={load} />}
      {note && <p className="auth-note ok" role="status">{note}</p>}
      {err && <p className="auth-note" role="alert">{err}</p>}

      {tab === 'overview' && (holdings.length === 0 ? (
        <section className="cp-card cp-empty">
          <h2 className="cp-card-title">No purchases recorded yet</h2>
          <p>Record this client’s mutual fund purchases and their portfolio will be built here and on their own dashboard.</p>
          <Link to={`${base}/purchase`} className="btn btn-primary"><Icons.plus /> Record a purchase</Link>
        </section>
      ) : (
        <>
          <div className="sp-stats sp-stats-4">
            <div className="cp-card sp-stat"><strong>{inr(summary.currentValue)}</strong><span>Current value</span></div>
            <div className="cp-card sp-stat"><strong className={tone(summary.xirr)}>{summary.xirr === null ? '–' : signedPct(summary.xirr)}</strong><span>XIRR{summary.xirr === null ? ' (after 30 days)' : ''}</span></div>
            <div className="cp-card sp-stat"><strong>{inr(summary.invested)}</strong><span>Total invested</span></div>
            <div className="cp-card sp-stat"><strong className={tone(summary.gain)}>{signedPct(summary.returnPct)}</strong><span>Absolute return · since {fmtDate(summary.sinceDate)}</span></div>
          </div>
          {history && <ValueChart points={history.points} complete={history.complete} title="Portfolio value" />}
          <div className="cp-grid cp-grid-2">
            <AllocationCard allocation={allocation} total={summary.currentValue} link={false} />
            <section className="cp-card">
              <h2 className="cp-card-title">Returns by asset class</h2>
              <ul className="cp-xirr">
                {allocation.map((a) => {
                  const max = Math.max(...allocation.map((x) => Math.abs(x.xirr ?? 0)), 1);
                  return (
                    <li key={a.assetClass}>
                      <span className="cp-xirr-name">{a.assetClass}</span>
                      <span className="cp-xirr-track">{a.xirr !== null && <span className="cp-xirr-fill" style={{ width: `${(Math.abs(a.xirr) / max) * 100}%`, background: a.xirr < 0 ? 'var(--neg)' : assetColor(a.assetClass) }} />}</span>
                      <span className={'cp-xirr-val ' + tone(a.xirr)}>{a.xirr === null ? '–' : signedPct(a.xirr)}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="cp-fine">XIRR since the first purchase in each class; shown after 30 days.</p>
            </section>
          </div>
        </>
      ))}

      {tab === 'holdings' && <Holdings holdings={holdings} />}
      {tab === 'transactions' && <Orders orders={orders} onChange={(t) => { setNote(t); load(); }} onError={setErr} />}
    </>
  );
}

function Holdings({ holdings }) {
  return (
    <section className="cp-card">
      {holdings.length === 0 ? <p className="cp-muted">No holdings yet.</p> : (
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead>
              <tr><th>Fund</th><th>Asset class</th><th className="num">Units</th><th className="num">NAV</th><th className="num">Invested</th><th className="num">Current value</th><th className="num">Return</th><th className="num">XIRR</th></tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.schemeCode}>
                  <td className="cp-fund"><strong>{h.name}</strong><span>{h.amc} · Code {h.schemeCode}</span></td>
                  <td><span className="cp-swatch" style={{ background: assetColor(h.assetClass) }} />{h.assetClass}</td>
                  <td className="num">{units(h.units)}</td>
                  <td className="num">{nav(h.nav)}<span className="sp-sub">{fmtDate(h.navDate)}</span></td>
                  <td className="num">{inr(h.invested)}</td>
                  <td className="num"><strong>{inr(h.currentValue)}</strong></td>
                  <td className={'num ' + tone(h.returnPct)}>{signedPct(h.returnPct)}</td>
                  <td className={'num ' + tone(h.xirr)}>{h.xirr === null ? '–' : signedPct(h.xirr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Orders({ orders, onChange, onError }) {
  const [showVoid, setShowVoid] = useState(false);
  const active = orders.filter((o) => o.status === 'active');
  const shown = showVoid ? orders : active;

  const onVoid = async (o) => {
    const reason = window.prompt(`Void the ${inr(o.amount)} purchase of ${o.fundName} on ${fmtDate(o.tradeDate)}?\n\nIt will be removed from the client’s portfolio but kept on record. Reason:`);
    if (reason === null) return;
    try {
      await voidOrder(o.id, reason);
      onChange('Order voided. It no longer counts in the portfolio.');
    } catch (e) {
      onError(e.message);
    }
  };

  return (
    <section className="cp-card">
      <div className="cp-card-head">
        <p className="cp-muted mb-0">{active.length} {active.length === 1 ? 'transaction' : 'transactions'}</p>
        {orders.length > active.length && (
          <label className="ord-toggle"><input type="checkbox" checked={showVoid} onChange={(e) => setShowVoid(e.target.checked)} /> Show voided ({orders.length - active.length})</label>
        )}
      </div>
      {shown.length === 0 ? <p className="cp-muted">No transactions yet.</p> : (
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead>
              <tr><th>Date</th><th>Fund</th><th>Type</th><th className="num">Amount</th><th className="num">Units</th><th className="num">NAV</th><th>Folio</th><th>Recorded by</th><th aria-label="Actions" /></tr>
            </thead>
            <tbody>
              {shown.map((o) => (
                <tr key={o.id} className={o.status === 'void' ? 'ord-void' : undefined}>
                  <td>{fmtDate(o.tradeDate)}</td>
                  <td className="cp-fund"><strong>{o.fundName}</strong>{o.notes && <span>{o.notes}</span>}{o.status === 'void' && <span className="neg">Voided: {o.voidReason} ({o.voidedBy}, {fmtDate(o.voidedAt)})</span>}</td>
                  <td>{o.status === 'void' ? <span className="status-pill disabled">Voided</span> : <span className="cp-type">{TYPE[o.type] || 'Purchase'}</span>}</td>
                  <td className="num"><strong>{inr(o.amount)}</strong></td>
                  <td className="num">{units(o.units)}</td>
                  <td className="num">{nav(o.nav)}</td>
                  <td>{o.folio || '–'}</td>
                  <td>{o.createdBy || '–'}<span className="sp-sub">{fmtDate(o.createdAt)}</span></td>
                  <td className="num">{o.status === 'active' && <RowMenu label={`Actions for ${o.fundName} on ${fmtDate(o.tradeDate)}`} items={[{ label: 'Void this order…', danger: true, onClick: () => onVoid(o) }]} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
