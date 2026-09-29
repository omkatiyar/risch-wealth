import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import {
  createStaff, listClientRequests, listStaff, login, logout, me, setClientRequestStatus, updateStaff,
} from '../api/authApi';
import PasswordCard from '../components/PasswordCard';
import PasswordInput from '../components/PasswordInput';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
);

const EMPTY_STAFF = { fullName: '', employeeId: '', email: '', password: '', role: 'employee' };
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

// Staff sign-in only. There is no public sign-up: admins create employee
// accounts from the Team accounts panel shown after they sign in.
export default function EmployeeLogin() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    me().then((r) => { if (r.user.role !== 'client') setUser(r.user); }).catch(() => {});
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.identifier.trim() || !form.password) { setNote('Please enter your employee ID or email, and your password.'); return; }
    setBusy(true);
    try {
      const r = await login(form.identifier.trim(), form.password, 'staff');
      setUser(r.user);
      setForm({ identifier: '', password: '' });
      setNote('');
    } catch (err) {
      setForm((f) => ({ ...f, password: '' }));
      setNote(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Nav />

      <header className="page-head" style={{ paddingBottom: 40, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots" style={{ top: 0, height: 380 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow kicker reveal in">Employee Access</p>
          <h1 className="display-xxl reveal in" style={{ maxWidth: '14em' }}>Team <span className="italic">sign-in.</span></h1>
        </div>
      </header>

      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {user ? (
            <>
              <div className="auth-card">
                <p className="eyebrow" style={{ marginBottom: 10 }}>Signed in{user.role === 'admin' ? ' · Admin' : ''}</p>
                <h2 className="auth-welcome">Welcome, {user.fullName.split(' ')[0]}.</h2>
                <p style={{ marginBottom: 26 }}>{user.fullName} · {user.employeeId} · {user.email}</p>
                <button type="button" className="btn" onClick={async () => { await logout().catch(() => {}); setUser(null); }}>Sign out</button>
              </div>
              <ClientRequests />
              <PasswordCard className="auth-card" />
              {user.role === 'admin' && <TeamAccounts selfId={user.id} />}
            </>
          ) : (
            <div className="auth-card">
              <form noValidate onSubmit={onSubmit}>
                <h2 className="auth-title">Sign in with your RISCH account</h2>
                <div className="field">
                  <label htmlFor="eId">Employee ID or email</label>
                  <input id="eId" type="text" autoComplete="username" placeholder="e.g. RW1024" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="ePassword">Password</label>
                  <PasswordInput id="ePassword" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in…' : <>Sign in <Arrow /></>}</button>
                {note && <p className="auth-note" role="status">{note}</p>}
                <p className="body-s" style={{ marginTop: 18 }}>Accounts are created by a RISCH administrator. Forgotten your password? Ask your administrator to reset it.</p>
              </form>
            </div>
          )}
          <p className="body-s" style={{ marginTop: 28 }}>
            Are you a client? <Link to="/client-login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Go to Client Login</Link>
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}

// Admin panel: create employees, reset passwords, enable/disable, promote.
function TeamAccounts({ selfId }) {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(EMPTY_STAFF);
  const [msg, setMsg] = useState({ text: '', ok: false });
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => listStaff().then((r) => setStaff(r.staff)).catch((e) => setMsg({ text: e.message, ok: false })), []);
  useEffect(() => { load(); }, [load]);

  const onCreate = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await createStaff(form);
      setMsg({ text: `Account created for ${r.user.fullName} (${r.user.employeeId}). Share the password with them privately.`, ok: true });
      setForm(EMPTY_STAFF);
      load();
    } catch (err) {
      setMsg({ text: err.message, ok: false });
    } finally {
      setBusy(false);
    }
  };

  const act = async (s, change, done) => {
    try {
      await updateStaff(s.id, change);
      setMsg({ text: done, ok: true });
      load();
    } catch (err) {
      setMsg({ text: err.message, ok: false });
    }
  };

  const resetPassword = (s) => {
    const pw = window.prompt(`New password for ${s.fullName} (at least 10 characters):`);
    if (pw) act(s, { password: pw }, `Password reset for ${s.fullName}. They've been signed out everywhere.`);
  };

  const field = (id, label, props) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </div>
  );

  return (
    <div className="admin-panel">
      <p className="eyebrow">Admin</p>
      <h2 className="display-m" style={{ marginBottom: 28 }}>Team accounts</h2>

      <form className="admin-create" noValidate onSubmit={onCreate}>
        <h3 className="auth-title">Create an employee account</h3>
        <div className="field-row">
          {field('sName', 'Full name', { type: 'text', value: form.fullName, onChange: (e) => setForm({ ...form, fullName: e.target.value }) })}
          {field('sEmpId', 'Employee ID', { type: 'text', placeholder: 'e.g. RW1024', value: form.employeeId, onChange: (e) => setForm({ ...form, employeeId: e.target.value }) })}
        </div>
        <div className="field-row">
          {field('sEmail', 'Work email', { type: 'email', value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }) })}
          {field('sPassword', 'Initial password', { type: 'text', autoComplete: 'off', placeholder: 'At least 10 characters', value: form.password, onChange: (e) => setForm({ ...form, password: e.target.value }) })}
        </div>
        <div className="field">
          <label htmlFor="sRole">Role</label>
          <select id="sRole" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="employee">Employee</option>
            <option value="admin">Admin (can manage team accounts)</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
      </form>

      {msg.text && <p className={'auth-note' + (msg.ok ? ' ok' : '')} role="status">{msg.text}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Employee ID</th><th>Email</th><th>Role</th><th>Status</th><th>Last sign-in</th><th aria-label="Actions"></th></tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id}>
                <td>{s.fullName}</td>
                <td>{s.employeeId}</td>
                <td>{s.email}</td>
                <td>{s.role === 'admin' ? 'Admin' : 'Employee'}</td>
                <td><span className={'status-pill ' + s.status}>{s.status}</span></td>
                <td>{fmtDate(s.lastLoginAt)}</td>
                <td className="admin-actions">
                  {String(s.id) === String(selfId) ? <span className="admin-you">You</span> : <>
                  <button type="button" onClick={() => resetPassword(s)}>Reset password</button>
                  {s.status === 'active'
                    ? <button type="button" onClick={() => act(s, { status: 'disabled' }, `${s.fullName} has been disabled and signed out.`)}>Disable</button>
                    : <button type="button" onClick={() => act(s, { status: 'active' }, `${s.fullName} is active.`)}>Activate</button>}
                  </>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const REQ_STATUS = { open: 'New', in_progress: 'In progress', closed: 'Closed' };

// Inbox of requests clients send from the client portal (all staff).
function ClientRequests() {
  const [filter, setFilter] = useState('');
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');

  const load = useCallback(() => listClientRequests(filter)
    .then((r) => { setRows(r.requests); setErr(''); })
    .catch((e) => setErr(e.message)), [filter]);
  useEffect(() => { load(); }, [load]);

  const move = (id, status) => setClientRequestStatus(id, status).then(load).catch((e) => setErr(e.message));

  return (
    <div className="admin-panel">
      <div className="inbox-head">
        <div>
          <p className="eyebrow">Client portal</p>
          <h2 className="display-m" style={{ margin: 0 }}>Client requests</h2>
        </div>
        <select aria-label="Show" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Open and in progress</option>
          <option value="open">New only</option>
          <option value="closed">Closed</option>
          <option value="all">All</option>
        </select>
      </div>
      {err && <p className="auth-note" role="status">{err}</p>}
      {rows.length === 0 ? (
        <p className="portal-fine">No requests to show.</p>
      ) : (
        <ul className="inbox-list">
          {rows.map((r) => (
            <li key={r.id}>
              <div className="inbox-meta">
                <strong>{r.client.name}</strong>
                <span>{r.client.email}{r.client.phone ? ` · ${r.client.phone}` : ''}</span>
                <span>{fmtDate(r.createdAt)}</span>
              </div>
              <div className="inbox-body">
                <div className="rq-top">
                  <strong>{r.topic}</strong>
                  <span className={'status-pill ' + (r.status === 'closed' ? 'disabled' : r.status === 'in_progress' ? 'progress' : 'active')}>{REQ_STATUS[r.status]}</span>
                </div>
                <p>{r.message}</p>
                <div className="admin-actions" style={{ textAlign: 'left' }}>
                  {r.status !== 'in_progress' && r.status !== 'closed' && <button type="button" style={{ paddingLeft: 0 }} onClick={() => move(r.id, 'in_progress')}>Mark in progress</button>}
                  {r.status !== 'closed'
                    ? <button type="button" style={r.status === 'in_progress' ? { paddingLeft: 0 } : undefined} onClick={() => move(r.id, 'closed')}>Close</button>
                    : <button type="button" style={{ paddingLeft: 0 }} onClick={() => move(r.id, 'open')}>Reopen</button>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
