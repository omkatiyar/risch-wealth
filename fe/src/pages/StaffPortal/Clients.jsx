import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listPortfolios } from '../../api/authApi';
import { Icons, PageHead, fmtDate, inr } from '../ClientPortal/ui';
import { Pager } from './Pager';
import { NavUpdate } from './common';

const B = '/employee-portal';

export default function Clients() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [term, setTerm] = useState('');
  const [page, setPage] = useState(1);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState('');
  const [reload, setReload] = useState(0); // bumped after a NAV update

  useEffect(() => { const t = setTimeout(() => { setTerm(q.trim()); setPage(1); }, 250); return () => clearTimeout(t); }, [q]);
  useEffect(() => {
    let live = true;
    listPortfolios({ q: term, page }).then((r) => { if (live) { setRes(r); setErr(''); } }).catch((e) => live && setErr(e.message));
    return () => { live = false; };
  }, [term, page, reload]);

  return (
    <>
      <PageHead title="Client portfolios" sub="Client investments, holdings, returns and allocation.">
        <Link to={`${B}/purchase`} className="btn btn-primary cp-btn-sm"><Icons.plus /> Add purchase</Link>
      </PageHead>
      <NavUpdate compact onUpdated={() => setReload((n) => n + 1)} />
      <section className="cp-card">
        <div className="sp-searchbar">
          <Icons.search />
          <input type="search" placeholder="Search by client name, email or mobile" aria-label="Search clients" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {err && <p className="auth-note" role="alert">{err}</p>}
        {!res ? <p className="cp-muted">Loading…</p> : (
          <>
            <div className="cp-table-wrap">
              <table className="cp-table sp-rows">
                <thead>
                  <tr><th>Client</th><th>Email / Mobile</th><th className="num">Total value</th><th className="num">Funds</th><th>Last purchase recorded</th><th aria-label="Open" /></tr>
                </thead>
                <tbody>
                  {res.clients.map((c) => (
                    <tr key={c.id} onClick={() => navigate(`${B}/clients/${c.id}`)}>
                      <td><Link to={`${B}/clients/${c.id}`} className="sp-cell-link" onClick={(e) => e.stopPropagation()}>{c.fullName}</Link></td>
                      <td className="sp-contact">{c.email}{c.phone && <span>{c.phone}</span>}</td>
                      <td className="num"><strong>{c.funds ? inr(c.value) : '—'}</strong></td>
                      <td className="num">{c.funds || '—'}</td>
                      <td>{c.lastOrderAt ? fmtDate(c.lastOrderAt) : <span className="cp-muted">No purchases yet</span>}</td>
                      <td className="num sp-chev"><Icons.chevron /></td>
                    </tr>
                  ))}
                  {res.clients.length === 0 && (
                    <tr><td colSpan={6} className="cp-muted">{term ? 'No clients match.' : 'No clients yet. Clients appear here once they sign up on the Client Login page.'}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pager page={res.page} pageSize={res.pageSize} total={res.total} onPage={setPage} noun="clients" />
          </>
        )}
      </section>
    </>
  );
}
