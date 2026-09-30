import { useCallback, useEffect, useRef, useState } from 'react';
import { createOrder, navStatus, refreshNavs, searchSchemes } from '../../api/authApi';
import { Icons, fmtDate, inr } from '../ClientPortal/ui';
import { Req, ReqLegend } from '../../components/Req';

// Pieces shared across the staff portal screens.

export const ASSET_CLASSES = ['Equity', 'Debt', 'Hybrid', 'Commodities', 'International', 'Other'];

export const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');

export function timeAgo(d) {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) { const h = Math.floor(s / 3600); return `${h} hour${h > 1 ? 's' : ''} ago`; }
  if (s < 7 * 86400) { const n = Math.floor(s / 86400); return `${n} day${n > 1 ? 's' : ''} ago`; }
  return fmtDate(d);
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// "⋯" button with a small menu. items: [{ label, onClick, danger? }]
export function RowMenu({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);
  if (!items.length) return null;
  return (
    <div className="sp-menu" ref={ref}>
      <button type="button" className="sp-menu-btn" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}>
        <Icons.more />
      </button>
      {open && (
        <div className="cp-user-menu sp-menu-list" role="menu">
          {items.map((it) => (
            <button key={it.label} type="button" role="menuitem" className={it.danger ? 'neg' : undefined} onClick={(e) => { e.stopPropagation(); setOpen(false); it.onClick(); }}>{it.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// Debounced search box with a results list; `render` draws one result.
export function Typeahead({
  id, label, placeholder, minLength, search, render, onPick, hint, required = false,
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
      <label htmlFor={id}>{label}{required && <> <Req /></>}</label>
      <input id={id} aria-required={required ? 'true' : undefined} type="search" autoComplete="off" placeholder={placeholder} value={q} onChange={(e) => setQ(e.target.value)} />
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

const EMPTY_ORDER = { tradeDate: '', amount: '', nav: '', units: '', folio: '', notes: '', assetClass: '' };

// The purchase form: fund, asset class, date, amount, NAV, units, folio, notes.
export function OrderForm({ client, onSaved }) {
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
      onSaved(`Recorded ${inr(amount)} in ${fund.name}.`);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="sp-order-form" noValidate onSubmit={onSubmit}>
      <ReqLegend />
      {!fund ? (
        <Typeahead
          id="ordFund" label="Mutual fund" required placeholder="Fund name, AMC, scheme code or ISIN" minLength={3}
          search={findFunds}
          hint="Tip: include the plan and option, e.g. “parag parikh flexi direct growth”, or paste the ISIN from the statement."
          render={(s) => (
            <>
              <strong>{s.name}</strong>
              <span>{s.amc} · Code {s.code}{s.isin ? ` · ${s.isin}` : ''} · NAV {s.nav ?? '—'} on {fmtDate(s.navDate)}</span>
            </>
          )}
          onPick={(s) => { setFund(s); setForm((f) => ({ ...f, assetClass: s.heldAssetClass || s.suggestedAssetClass })); }}
        />
      ) : (
        <div className="field">
          <span className="ord-label">Mutual fund <Req /></span>
          <div className="ord-fund">
            <div>
              <strong>{fund.name}</strong>
              <span>{fund.amc} · Code {fund.code}{fund.isin ? ` · ${fund.isin}` : ''} · NAV {fund.nav ?? '—'} on {fmtDate(fund.navDate)}</span>
            </div>
            <button type="button" className="sp-x" aria-label="Choose a different fund" onClick={() => setFund(null)}><Icons.close /></button>
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
            {fund.heldAssetClass ? 'As set for this fund. Changing it applies to every client who holds it.' : `Suggested from AMFI’s category${fund.category ? ` (${fund.category})` : ''}; please confirm.`}
          </p>
        </div>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="ordDate">Buying date <Req /></label>
          <input id="ordDate" aria-required="true" type="date" max={today()} value={form.tradeDate} onChange={set('tradeDate')} />
        </div>
        <div className="field">
          <label htmlFor="ordAmt">Amount invested (₹) <Req /></label>
          <input id="ordAmt" aria-required="true" type="number" inputMode="decimal" min="1" step="0.01" value={form.amount} onChange={set('amount')} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="ordNav">Buying NAV <Req /></label>
          <input id="ordNav" aria-required="true" type="number" inputMode="decimal" min="0" step="0.0001" value={form.nav} onChange={set('nav')} />
          {farFromCurrent && <p className="ta-hint neg">This is far from the fund’s current NAV ({fund.nav}). Please check the fund and the NAV.</p>}
        </div>
        <div className="field">
          <label htmlFor="ordUnits">Units</label>
          <input id="ordUnits" type="number" inputMode="decimal" min="0" step="0.001" placeholder={calcUnits ? calcUnits.toFixed(3) : 'Amount ÷ NAV'} value={form.units} onChange={set('units')} />
          <p className="ta-hint">Calculated from amount ÷ NAV. Enter the statement’s units to override.</p>
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

// "NAVs as of … · Update now" (admins). Downloads AMFI's latest file on
// demand and says whether anything newer was found. `onUpdated` lets the
// page reload its figures.
export function NavUpdate({ compact = false, onUpdated }) {
  const [s, setS] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState({ text: '', ok: true });
  const load = useCallback(() => navStatus().then(setS).catch(() => {}), []);
  useEffect(() => { load(); }, [load]);

  const run = async () => {
    setBusy(true);
    setResult({ text: '', ok: true });
    try {
      const r = await refreshNavs();
      await load();
      if (r.fundsChanged > 0) {
        setResult({ text: `Updated ${r.fundsChanged} ${r.fundsChanged === 1 ? 'fund' : 'funds'} to the NAV of ${fmtDate(r.navDate)}.`, ok: true });
        if (onUpdated) onUpdated();
      } else {
        setResult({ text: 'Already up to date: AMFI hasn’t published a newer NAV yet. Most funds are published by 11 pm IST; overseas funds and funds of funds by 10 am the next day.', ok: true });
      }
    } catch (e) {
      setResult({ text: e.message, ok: false });
    } finally {
      setBusy(false);
    }
  };

  const last = s?.lastImport;
  const status = !s ? 'Loading…'
    : !s.funds ? 'No funds held yet.'
      : last?.error && !s.navDate ? <span className="neg">The last NAV update failed.</span>
        : <>NAVs as of <strong>{fmtDate(s.navDate)}</strong> · {s.funds} {s.funds === 1 ? 'fund' : 'funds'} held</>;
  const button = <button type="button" className="cp-link" onClick={run} disabled={busy}>{busy ? 'Fetching latest…' : 'Update now'}</button>;
  const note = result.text && <p className={'sp-nav-result' + (result.ok ? '' : ' neg')} role="status">{result.text}</p>;

  if (compact) {
    return (
      <div className="nav-status">
        <span>{status}</span>
        {button}
        {note}
      </div>
    );
  }
  return (
    <div className="sp-nav">
      <p className="mb-0">{status}</p>
      {last && <p className="cp-fine" style={{ marginTop: 4 }}>Last checked {timeAgo(last.finished_at)}{last.error ? ' (failed)' : ''}. Checked automatically from AMFI through the day.</p>}
      {button}
      {note}
    </div>
  );
}
