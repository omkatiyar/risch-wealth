import { useState } from 'react';
import { Link } from 'react-router-dom';
import { clientTransactions } from '../../api/authApi';
import { Arrow, Icons, PageHead, fmtDate } from './ui';

// Downloads built in the browser from the client's own data (CSV, opens in
// Excel). Formal statements (CAS, capital gains) come from the fund
// houses and registrars, so clients request those from the team.

const csvCell = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
function download(filename, rows) {
  // BOM so Excel reads ₹ and accented names correctly
  const blob = new Blob([`﻿${rows.map((r) => r.map(csvCell).join(',')).join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Indian financial year (April–March) of a 'YYYY-MM-DD' date, e.g. '2025-26'.
const fyOf = (d) => {
  const y = Number(d.slice(0, 4));
  const start = Number(d.slice(5, 7)) >= 4 ? y : y - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, '0')}`;
};

async function allTransactions() {
  const out = [];
  for (let page = 1; ; page += 1) {
    const r = await clientTransactions({ page });
    out.push(...r.transactions);
    if (page * r.pageSize >= r.total) return out;
  }
}

export default function Statements({ data, portfolio }) {
  const { summary, holdings } = portfolio;
  const [fy, setFy] = useState('all');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const name = data.profile.fullName;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // FY choices from the first investment to today.
  const fys = [];
  if (summary.sinceDate) {
    const today = new Date().toISOString().slice(0, 10);
    for (let f = fyOf(summary.sinceDate); f <= fyOf(today); f = `${Number(f.slice(0, 4)) + 1}-${String((Number(f.slice(0, 4)) + 2) % 100).padStart(2, '0')}`) fys.unshift(f);
  }

  const valuation = () => {
    download(`risch-valuation-${slug}-${summary.navDate}.csv`, [
      [`Portfolio valuation — ${name}`],
      [`Valued at NAV of ${fmtDate(summary.navDate)}`],
      [],
      ['Fund', 'AMC', 'Asset class', 'Units', 'NAV', 'NAV date', 'Invested (INR)', 'Current value (INR)', 'Gain (INR)', 'Return %', 'XIRR %'],
      ...holdings.map((h) => [h.name, h.amc, h.assetClass, h.units, h.nav, h.navDate, h.invested, h.currentValue, h.gain, h.returnPct, h.xirr ?? '']),
      [],
      ['Total', '', '', '', '', '', summary.invested, summary.currentValue, summary.gain, summary.returnPct, summary.xirr ?? ''],
    ]);
  };

  const transactions = async () => {
    setBusy(true);
    setErr('');
    try {
      const rows = (await allTransactions()).filter((t) => fy === 'all' || fyOf(t.date) === fy).reverse();
      download(`risch-transactions-${slug}-${fy === 'all' ? 'all' : `FY${fy}`}.csv`, [
        [`Transaction statement — ${name}`],
        [fy === 'all' ? 'All transactions' : `Financial year ${fy}`],
        [],
        ['Date', 'Type', 'Fund', 'Folio', 'Amount (INR)', 'NAV', 'Units'],
        ...rows.map((t) => [t.date, t.type === 'purchase' ? 'Purchase' : t.type, t.fundName, t.folio, t.amount, t.nav, t.units]),
      ]);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const has = holdings.length > 0;

  return (
    <>
      <PageHead title="Statements & reports" sub="Download your portfolio valuation and transaction history." />
      <section className="cp-card">
        <ul className="cp-docs">
          <li>
            <span className="cp-doc-icon"><Icons.statements /></span>
            <span className="cp-doc-body"><strong>Portfolio valuation</strong><span>Current holdings and value{has ? `, as on ${fmtDate(summary.navDate)}` : ''}</span></span>
            <span />
            <button type="button" className="btn cp-btn-sm" disabled={!has} onClick={valuation}><Icons.download /> Download CSV</button>
          </li>
          <li>
            <span className="cp-doc-icon"><Icons.statements /></span>
            <span className="cp-doc-body"><strong>Transaction statement</strong><span>Every investment recorded in your account</span></span>
            <select aria-label="Financial year" value={fy} onChange={(e) => setFy(e.target.value)} disabled={!has}>
              <option value="all">All years</option>
              {fys.map((f) => <option key={f} value={f}>FY {f}</option>)}
            </select>
            <button type="button" className="btn cp-btn-sm" disabled={!has || busy} onClick={transactions}><Icons.download /> {busy ? 'Preparing…' : 'Download CSV'}</button>
          </li>
        </ul>
        {err && <p className="auth-note" role="alert">{err}</p>}
      </section>

      <section className="cp-card cp-note-card">
        <Icons.info />
        <div>
          <h2 className="cp-card-title">Need a formal statement?</h2>
          <p>Consolidated account statements, capital gains statements and dividend statements are issued by the fund houses and registrars. Ask us and we’ll send them to you.</p>
          <Link to="/client-portal/messages" state={{ topic: 'Documents or statements' }} className="cp-link">Request a statement <Arrow /></Link>
        </div>
      </section>
    </>
  );
}
