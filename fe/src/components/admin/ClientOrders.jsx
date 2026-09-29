import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clientPortfolioAdmin, createOrder, navStatus, refreshNavs, searchClients, searchSchemes, voidOrder,
} from '../../api/authApi';

// Admin panel: record mutual fund purchases against a client's account.
// Each client's portfolio (and their dashboard) is built from these
// orders; current values come from AMFI's daily NAV file, which updates
// only the funds clients hold.

const ASSET_CLASSES = ['Equity', 'Debt', 'Hybrid', 'Commodities', 'International', 'Other'];
const EMPTY_ORDER = { tradeDate: '', amount: '', nav: '', units: '', folio: '', notes: '', assetClass: '' };

const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const pct = (n) => (n === null || n === undefined ? '—' : `${n < 0 ? '−' : '+'}${Math.abs(n).toFixed(2)}%`);
const fmtDate = (d) => {
  if (!d) return '—';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(`${d}T00:00:00`) : new Date(d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Debounced search box with a results list; `render` draws one result.
function Typeahead({
  id, label, placeholder, minLength, search, render, onPick, hint,
}) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [err, setErr] = useState('');
  const seq = useRef(0);

  useEffect(() => {
    const term = q.trim();
    if (term.length < minLength) { setResults([]); setState('idle'); return undefined; }
    setState('loading');
    const n = ++seq.current;
    const t = setTimeout(() => {
      search(term)
        .then((r) => { if (n === seq.current) { setResults(r); setState('done'); } })
        .catch((e) => { if (n === seq.current) { setErr(e.message); setState('error'); } });
    }, 250);
    return () => clearTimeout(t);
  }, [q, minLength, search]);

  return (
    <div className="field ta">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="search" autoComplete="off" placeholder={placeholder} value={q} onChange={(e) => setQ(e.target.value)} />
      {hint && state === 'idle' && <p className="ta-hint">{hint}</p>}
      {state === 'loading' && <p className="ta-hint">Searching…</p>}
      {state === 'error' && <p className="ta-hint neg">{err}</p>}
      {state === 'done' && (results.length === 0 ? <p className="ta-hint">No matches.</p> : (
        <ul className="ta-list">
          {results.map((r) => (
            <li key={r.id || r.code}>
              <button type="button" onClick={() => { onPick(r); setQ(''); setResults([]); setState('idle'); }}>{render(r)}</button>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default function ClientOrders() {
  const [client, setClient] = useState(null);
  const [detail, setDetail] = useState(null);
  const [msg, setMsg] = useState({ text: '', ok: false });

  const load = useCallback((id) => clientPortfolioAdmin(id).then(setDetail).catch((e) => setMsg({ text: e.message, ok: false })), []);
  useEffect(() => { setDetail(null); if (client) load(client.id); }, [client, load]);

  const findClients = useCallback((q) => searchClients(q).then((r) => r.clients), []);

  return (
    <div className="admin-panel" id="client-portfolios">
      <div className="inbox-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h2 className="display-m" style={{ margin: 0 }}>Client portfolios</h2>
        </div>
        <NavStatus onUpdated={() => client && load(client.id)} />
      </div>
      <p className="body-s" style={{ margin: '0 0 24px', maxWidth: '68ch' }}>
        Record each mutual fund purchase against the client’s account. Their dashboard shows holdings, returns and allocation from these orders, valued at the latest NAV published by AMFI.
      </p>

      {!client ? (
        <div className="ta-wrap">
          <Typeahead
            id="ordClient" label="Client" placeholder="Search by name, email or mobile" minLength={2}
            search={findClients}
            hint="Clients appear here once they’ve signed up on the Client Login page."
            render={(c) => <><strong>{c.fullName}</strong><span>{c.email}{c.phone ? ` · ${c.phone}` : ''}</span></>}
            onPick={(c) => { setClient(c); setMsg({ text: '', ok: false }); }}
          />
        </div>
      ) : (
        <>
          <div className="ord-client">
            <div>
              <strong>{client.fullName}</strong>
              <span>{client.email}{client.phone ? ` · ${client.phone}` : ''} · Client ID {client.id}</span>
            </div>
            <button type="button" className="btn cp-btn-sm" onClick={() => setClient(null)}>Change client</button>
          </div>

          {detail && <ClientSummary summary={detail.portfolio.summary} count={detail.portfolio.holdings.length} />}

          <OrderForm
            client={client}
            onSaved={(text) => { setMsg({ text, ok: true }); load(client.id); }}
          />

          {msg.text && <p className={'auth-note' + (msg.ok ? ' ok' : '')} role="status">{msg.text}</p>}

          {detail && <OrderList orders={detail.orders} onVoided={(text) => { setMsg({ text, ok: true }); load(client.id); }} onError={(text) => setMsg({ text, ok: false })} />}
        </>
      )}
    </div>
  );
}

function NavStatus({ onUpdated }) {
  const [s, setS] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const load = useCallback(() => navStatus().then(setS).catch(() => {}), []);
  useEffect(() => { load(); }, [load]);

  const run = async () => {
    setBusy(true);
    setErr('');
    try {
      await refreshNavs();
      await load();
      onUpdated();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const last = s?.lastImport;
  return (
    <div className="nav-status">
      <span>
        {!s ? 'NAV status…'
          : !last ? 'NAVs not updated yet'
            : last.error ? <span className="neg">Last NAV update failed</span>
              : <>NAVs as of <strong>{fmtDate(last.nav_date)}</strong> · {s.funds} {s.funds === 1 ? 'fund' : 'funds'}</>}
      </span>
      <button type="button" className="cp-link" onClick={run} disabled={busy}>{busy ? 'Updating…' : 'Update now'}</button>
      {err && <span className="neg">{err}</span>}
    </div>
  );
}

function ClientSummary({ summary, count }) {
  if (!count) return <p className="body-s" style={{ margin: '0 0 24px' }}>No purchases recorded for this client yet.</p>;
  return (
    <dl className="ord-summary">
      <div><dt>Invested</dt><dd>{inr(summary.invested)}</dd></div>
      <div><dt>Current value</dt><dd>{inr(summary.currentValue)}</dd></div>
      <div><dt>Gain</dt><dd className={summary.gain < 0 ? 'neg' : 'pos'}>{pct(summary.returnPct)}</dd></div>
      <div><dt>XIRR</dt><dd>{pct(summary.xirr)}</dd></div>
      <div><dt>Funds</dt><dd>{count}</dd></div>
    </dl>
  );
}

function OrderForm({ client, onSaved }) {
  const [fund, setFund] = useState(null);
  const [form, setForm] = useState(EMPTY_ORDER);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const findFunds = useCallback((q) => searchSchemes(q).then((r) => r.schemes), []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const amount = Number(form.amount);
  const nav = Number(form.nav);
  const calcUnits = amount > 0 && nav > 0 ? amount / nav : null;
  const farFromCurrent = fund?.nav && nav > 0 && (nav / fund.nav > 3 || fund.nav / nav > 3);

  const pickFund = (s) => {
    setFund(s);
    setForm((f) => ({ ...f, assetClass: s.heldAssetClass || s.suggestedAssetClass }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!fund) { setErr('Please choose the mutual fund.'); return; }
    setBusy(true);
    try {
      await createOrder({
        userId: client.id, schemeCode: fund.code, assetClass: form.assetClass,
        tradeDate: form.tradeDate, amount: form.amount, nav: form.nav,
        units: form.units || undefined, folio: form.folio, notes: form.notes,
      });
      onSaved(`Recorded ${inr(amount)} in ${fund.name} for ${client.fullName}.`);
      setFund(null);
      setForm(EMPTY_ORDER);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="admin-create ord-form" noValidate onSubmit={onSubmit}>
      <h3 className="auth-title">Record a purchase</h3>

      {!fund ? (
        <Typeahead
          id="ordFund" label="Mutual fund" placeholder="Fund name, AMC, scheme code or ISIN" minLength={3}
          search={findFunds}
          hint="Tip: include the plan and option, e.g. “parag parikh flexi direct growth”, or paste the ISIN from the statement."
          render={(s) => (
            <>
              <strong>{s.name}</strong>
              <span>{s.amc} · Code {s.code}{s.isin ? ` · ${s.isin}` : ''} · NAV {s.nav ?? '—'} on {fmtDate(s.navDate)}</span>
            </>
          )}
          onPick={pickFund}
        />
      ) : (
        <div className="field">
          <span className="ord-label">Mutual fund</span>
          <div className="ord-fund">
            <div>
              <strong>{fund.name}</strong>
              <span>{fund.amc} · Code {fund.code}{fund.isin ? ` · ${fund.isin}` : ''}</span>
              <span>Current NAV {fund.nav ?? '—'} ({fmtDate(fund.navDate)}){fund.category ? ` · ${fund.category}` : ''}</span>
            </div>
            <button type="button" className="cp-link" onClick={() => setFund(null)}>Change</button>
          </div>
        </div>
      )}

      {fund && (
        <div className="field">
          <label htmlFor="ordClass">Asset class</label>
          <select id="ordClass" value={form.assetClass} onChange={set('assetClass')}>
            {ASSET_CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <p className="ta-hint">
            {fund.heldAssetClass ? 'As set for this fund. Changing it applies to every client who holds it.' : 'Suggested from AMFI’s category; please confirm.'}
          </p>
        </div>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="ordDate">Buying date</label>
          <input id="ordDate" type="date" max={today()} value={form.tradeDate} onChange={set('tradeDate')} />
        </div>
        <div className="field">
          <label htmlFor="ordAmt">Amount invested (₹)</label>
          <input id="ordAmt" type="number" inputMode="decimal" min="1" step="0.01" value={form.amount} onChange={set('amount')} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="ordNav">Buying NAV</label>
          <input id="ordNav" type="number" inputMode="decimal" min="0" step="0.0001" value={form.nav} onChange={set('nav')} />
          {farFromCurrent && <p className="ta-hint neg">This is far from the fund’s current NAV ({fund.nav}). Please check the fund and the NAV.</p>}
        </div>
        <div className="field">
          <label htmlFor="ordUnits">Units</label>
          <input id="ordUnits" type="number" inputMode="decimal" min="0" step="0.001" placeholder={calcUnits ? calcUnits.toFixed(3) : 'Amount ÷ NAV'} value={form.units} onChange={set('units')} />
          <p className="ta-hint">Leave blank to use amount ÷ NAV, or enter the units from the statement.</p>
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="ordFolio">Folio number</label>
          <input id="ordFolio" type="text" placeholder="Optional" maxLength={40} value={form.folio} onChange={set('folio')} />
        </div>
        <div className="field">
          <label htmlFor="ordNotes">Notes</label>
          <input id="ordNotes" type="text" placeholder="Optional" maxLength={500} value={form.notes} onChange={set('notes')} />
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Record purchase'}</button>
      {err && <p className="auth-note" role="alert">{err}</p>}
    </form>
  );
}

function OrderList({ orders, onVoided, onError }) {
  const [showVoid, setShowVoid] = useState(false);
  const shown = showVoid ? orders : orders.filter((o) => o.status === 'active');
  const voidCount = orders.length - orders.filter((o) => o.status === 'active').length;

  const onVoid = async (o) => {
    const reason = window.prompt(`Void the ${inr(o.amount)} purchase of ${o.fundName} on ${fmtDate(o.tradeDate)}?\n\nIt will be removed from the client’s portfolio but kept on record. Reason:`);
    if (reason === null) return;
    try {
      await voidOrder(o.id, reason);
      onVoided('Order voided.');
    } catch (e) {
      onError(e.message);
    }
  };

  if (!orders.length) return null;
  return (
    <div className="admin-table-wrap">
      <div className="inbox-head" style={{ marginBottom: 8 }}>
        <h3 className="auth-title" style={{ margin: 0 }}>Orders</h3>
        {voidCount > 0 && (
          <label className="ord-toggle"><input type="checkbox" checked={showVoid} onChange={(e) => setShowVoid(e.target.checked)} /> Show voided ({voidCount})</label>
        )}
      </div>
      <table className="admin-table">
        <thead>
          <tr><th>Date</th><th>Fund</th><th>Amount</th><th>NAV</th><th>Units</th><th>Folio</th><th>Entered by</th><th>Status</th><th aria-label="Actions"></th></tr>
        </thead>
        <tbody>
          {shown.map((o) => (
            <tr key={o.id} className={o.status === 'void' ? 'ord-void' : undefined}>
              <td>{fmtDate(o.tradeDate)}</td>
              <td className="ord-fundcell">{o.fundName}{o.notes && <span>{o.notes}</span>}</td>
              <td>{inr(o.amount)}</td>
              <td>{o.nav}</td>
              <td>{o.units.toFixed(3)}</td>
              <td>{o.folio || '—'}</td>
              <td>{o.createdBy || '—'}<span className="ord-sub">{fmtDate(o.createdAt)}</span></td>
              <td>
                {o.status === 'active'
                  ? <span className="status-pill active">Active</span>
                  : <span className="status-pill disabled" title={`${o.voidReason} — ${o.voidedBy || ''}, ${fmtDate(o.voidedAt)}`}>Voided</span>}
                {o.status === 'void' && <span className="ord-sub">{o.voidReason}</span>}
              </td>
              <td className="admin-actions">{o.status === 'active' && <button type="button" onClick={() => onVoid(o)}>Void</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
