import { useCallback, useEffect, useState } from 'react';
import { createStaff, listStaff, updateStaff } from '../../api/authApi';
import { Icons, PageHead, fmtDate } from '../ClientPortal/ui';
import { RowMenu } from './common';
import { Req, ReqLegend } from '../../components/Req';

const EMPTY = { fullName: '', employeeId: '', email: '', password: '', role: 'employee' };

// Admins: create employee accounts, reset passwords, enable or disable.
export default function Team({ selfId }) {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
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
      setForm(EMPTY);
      setShowForm(false);
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
    if (pw) act(s, { password: pw }, `Password reset for ${s.fullName}. They’ve been signed out everywhere.`);
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <PageHead title="Team accounts" sub="Create and manage employee accounts.">
        {!showForm && <button type="button" className="btn btn-primary cp-btn-sm" onClick={() => { setShowForm(true); setMsg({ text: '', ok: false }); }}><Icons.plus /> Create account</button>}
      </PageHead>

      {showForm && (
        <section className="cp-card cp-form-card sp-wide-form">
          <div className="cp-card-head">
            <h2 className="cp-card-title">Create an account</h2>
            <button type="button" className="sp-x" aria-label="Cancel" onClick={() => setShowForm(false)}><Icons.close /></button>
          </div>
          <form noValidate onSubmit={onCreate}>
            <ReqLegend />
            <div className="field-row">
              <div className="field"><label htmlFor="sName">Full name <Req /></label><input id="sName" aria-required="true" type="text" value={form.fullName} onChange={set('fullName')} /></div>
              <div className="field"><label htmlFor="sEmpId">Employee ID <Req /></label><input id="sEmpId" aria-required="true" type="text" placeholder="e.g. RW1024" value={form.employeeId} onChange={set('employeeId')} /></div>
            </div>
            <div className="field-row">
              <div className="field"><label htmlFor="sEmail">Work email <Req /></label><input id="sEmail" aria-required="true" type="email" value={form.email} onChange={set('email')} /></div>
              <div className="field"><label htmlFor="sPassword">Initial password <Req /></label><input id="sPassword" aria-required="true" type="text" autoComplete="off" placeholder="At least 10 characters" value={form.password} onChange={set('password')} /></div>
            </div>
            <div className="field">
              <label htmlFor="sRole">Role</label>
              <select id="sRole" value={form.role} onChange={set('role')}>
                <option value="employee">Employee: client requests only</option>
                <option value="admin">Admin: also client portfolios, purchases and team accounts</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
          </form>
        </section>
      )}

      {msg.text && <p className={'auth-note' + (msg.ok ? ' ok' : '')} role="status">{msg.text}</p>}

      <section className="cp-card">
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead><tr><th>Name</th><th>Employee ID</th><th>Email</th><th>Role</th><th>Status</th><th>Last sign-in</th><th aria-label="Actions" /></tr></thead>
            <tbody>
              {staff.map((s) => {
                const self = String(s.id) === String(selfId);
                return (
                  <tr key={s.id}>
                    <td><strong>{s.fullName}</strong>{self && <span className="cp-muted"> (you)</span>}</td>
                    <td>{s.employeeId}</td>
                    <td>{s.email}</td>
                    <td>{s.role === 'admin' ? 'Admin' : 'Employee'}</td>
                    <td><span className={'status-pill ' + s.status}>{s.status === 'active' ? 'Active' : 'Inactive'}</span></td>
                    <td>{s.lastLoginAt ? fmtDate(s.lastLoginAt) : '–'}</td>
                    <td className="num">
                      {!self && (
                        <RowMenu
                          label={`Actions for ${s.fullName}`}
                          items={[
                            { label: 'Reset password…', onClick: () => resetPassword(s) },
                            s.status === 'active'
                              ? { label: 'Disable account', danger: true, onClick: () => act(s, { status: 'disabled' }, `${s.fullName} has been disabled and signed out.`) }
                              : { label: 'Activate account', onClick: () => act(s, { status: 'active' }, `${s.fullName} is active.`) },
                          ]}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
