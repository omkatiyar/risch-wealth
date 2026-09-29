import { useCallback, useEffect, useState } from 'react';
import { listClientRequests, setClientRequestStatus } from '../../api/authApi';
import { PageHead, fmtDate } from '../ClientPortal/ui';
import { RowMenu, timeAgo } from './common';

const STATUS = { open: ['New', 'progress'], in_progress: ['In progress', 'active'], closed: ['Closed', 'disabled'] };
const TABS = [
  { key: '', label: 'Open and in progress', count: (c) => c.open + c.in_progress },
  { key: 'closed', label: 'Completed', count: (c) => c.closed },
  { key: 'all', label: 'All', count: (c) => c.open + c.in_progress + c.closed },
];

// Requests clients send from their portal. All staff can see and update them.
export default function Requests() {
  const [tab, setTab] = useState('');
  const [res, setRes] = useState(null);
  const [err, setErr] = useState('');
  const [openId, setOpenId] = useState(null);

  const load = useCallback(() => listClientRequests(tab).then((r) => { setRes(r); setErr(''); }).catch((e) => setErr(e.message)), [tab]);
  useEffect(() => { load(); }, [load]);
  const move = (id, status) => setClientRequestStatus(id, status).then(load).catch((e) => setErr(e.message));

  return (
    <>
      <PageHead title="Client requests" sub="Requests clients send from their portal. Click a request to read it." />
      <div className="cp-chips" role="tablist">
        {TABS.map((t) => (
          <button key={t.key || 'open'} type="button" role="tab" aria-selected={tab === t.key} className={tab === t.key ? 'on' : ''} onClick={() => setTab(t.key)}>
            {t.label}{res ? ` (${t.count(res.counts)})` : ''}
          </button>
        ))}
      </div>
      <section className="cp-card">
        {err && <p className="auth-note" role="alert">{err}</p>}
        {!res ? <p className="cp-muted">Loading…</p> : res.requests.length === 0 ? <p className="cp-muted">No requests here.</p> : (
          <div className="cp-table-wrap">
            <table className="cp-table sp-rows">
              <thead><tr><th>Date</th><th>Client</th><th>Request</th><th>Status</th><th>Updated</th><th aria-label="Actions" /></tr></thead>
              <tbody>
                {res.requests.map((r) => {
                  const expanded = openId === r.id;
                  const items = [
                    r.status === 'open' && { label: 'Mark in progress', onClick: () => move(r.id, 'in_progress') },
                    r.status !== 'closed' && { label: 'Mark completed', onClick: () => move(r.id, 'closed') },
                    r.status === 'closed' && { label: 'Reopen', onClick: () => move(r.id, 'open') },
                  ].filter(Boolean);
                  return (
                    <tr key={r.id} onClick={() => setOpenId(expanded ? null : r.id)} aria-expanded={expanded}>
                      <td>{fmtDate(r.createdAt)}</td>
                      <td className="sp-contact"><strong>{r.client.name}</strong><span>{r.client.email}{r.client.phone ? ` · ${r.client.phone}` : ''}</span></td>
                      <td className="sp-req-cell">
                        <strong>{r.topic}</strong>
                        <p className={expanded ? '' : 'sp-clamp'}>{r.message}</p>
                      </td>
                      <td><span className={`status-pill ${STATUS[r.status][1]}`}>{STATUS[r.status][0]}</span></td>
                      <td>{timeAgo(r.updatedAt)}</td>
                      <td className="num"><RowMenu label={`Actions for ${r.client.name}’s request`} items={items} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
