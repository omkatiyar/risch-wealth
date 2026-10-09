import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ridges from '../../assets/hero-ridges-760.webp';
import { staffDashboard } from '../../api/authApi';
import { Arrow, Icons, fmtDate, inr } from '../ClientPortal/ui';
import { NavUpdate, timeAgo } from './common';

const B = '/employee-portal';

export default function Dashboard({ user }) {
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { staffDashboard().then(setD).catch((e) => setErr(e.message)); }, []);
  const isAdmin = user.role === 'admin';

  const stats = d ? [
    { icon: Icons.clients, n: d.clients, l: 'Total clients', to: isAdmin ? `${B}/clients` : null },
    isAdmin && { icon: Icons.portfolio, n: d.activePortfolios, l: 'Active portfolios', to: `${B}/clients` },
    { icon: Icons.inbox, n: d.pendingRequests, l: 'Pending requests', to: `${B}/requests` },
    isAdmin && { icon: Icons.statements, n: d.navDate ? fmtDate(d.navDate) : '–', l: 'Latest NAV date', small: true },
  ].filter(Boolean) : [];

  return (
    <>
      <section className="sp-welcome">
        <img src={ridges} alt="" aria-hidden="true" width="760" height="785" />
        <div>
          <p className="cp-eyebrow">{isAdmin ? 'Admin' : 'Employee'} portal</p>
          <h1>Welcome, <span>{user.fullName.split(' ')[0]}.</span></h1>
          <p>Here’s what’s happening today.</p>
        </div>
      </section>

      {err && <p className="auth-note" role="alert">{err}</p>}
      {!d ? <p className="cp-loading">Loading…</p> : (
        <>
          <div className={`sp-stats sp-stats-${stats.length}`}>
            {stats.map((s) => {
              const body = (
                <>
                  <span className="sp-stat-icon"><s.icon /></span>
                  <strong className={s.small ? 'sp-stat-date' : undefined}>{s.n}</strong>
                  <span>{s.l}</span>
                </>
              );
              return s.to
                ? <Link key={s.l} to={s.to} className="cp-card sp-stat">{body}</Link>
                : <div key={s.l} className="cp-card sp-stat">{body}</div>;
            })}
          </div>

          <div className={isAdmin ? 'cp-grid sp-grid-main' : 'cp-grid'}>
            {isAdmin && (
              <section className="cp-card">
                <div className="cp-card-head">
                  <h2 className="cp-card-title">Recent client activity</h2>
                  <Link to={`${B}/clients`} className="cp-link">View all <Arrow /></Link>
                </div>
                {d.recentOrders.length === 0 ? <p className="cp-muted">No purchases recorded yet.</p> : (
                  <div className="cp-table-wrap">
                    <table className="cp-table sp-table-tight">
                      <thead><tr><th>Date</th><th>Client</th><th>Activity</th><th className="num">Amount</th></tr></thead>
                      <tbody>
                        {d.recentOrders.map((o) => (
                          <tr key={o.id}>
                            <td>{fmtDate(o.date)}</td>
                            <td><Link to={`${B}/clients/${o.client.id}`} className="sp-cell-link">{o.client.name}</Link></td>
                            <td className="sp-ellipsis">Purchase · {o.fundName}</td>
                            <td className="num"><strong>{inr(o.amount)}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            <section className="cp-card">
              <div className="cp-card-head">
                <h2 className="cp-card-title">Pending requests</h2>
                <Link to={`${B}/requests`} className="cp-link">View all <Arrow /></Link>
              </div>
              {d.recentRequests.length === 0 ? <p className="cp-muted">Nothing pending. Requests clients send from their portal appear here.</p> : (
                <ul className="sp-req-mini">
                  {d.recentRequests.map((r) => (
                    <li key={r.id}>
                      <span className="cp-doc-icon"><Icons.statements /></span>
                      <span className="sp-req-body">
                        <strong>{r.topic}</strong>
                        <span>{r.client.name}</span>
                        <small>{timeAgo(r.createdAt)}</small>
                      </span>
                      {r.status === 'open' && <span className="status-pill progress">New</span>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {isAdmin && (
            <div className="cp-grid sp-grid-main">
              <section className="cp-card">
                <h2 className="cp-card-title">Quick actions</h2>
                <div className="sp-actions">
                  <Link to={`${B}/purchase`} className="btn btn-primary cp-btn-sm"><Icons.plus /> Record a purchase</Link>
                  <Link to={`${B}/clients`} className="btn cp-btn-sm">Find a client</Link>
                  <Link to={`${B}/team`} className="btn cp-btn-sm">Create employee</Link>
                  <Link to={`${B}/requests`} className="btn cp-btn-sm">View all requests</Link>
                </div>
              </section>
              <section className="cp-card">
                <h2 className="cp-card-title">NAV update</h2>
                <NavUpdate />
              </section>
            </div>
          )}
        </>
      )}
    </>
  );
}
