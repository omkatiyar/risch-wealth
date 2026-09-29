import { useState } from 'react';
import { changePassword } from '../api/authApi';
import PasswordInput from './PasswordInput';

// Change your own password (clients and staff). Signs out other devices.
export default function PasswordCard({ className = 'portal-card' }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [note, setNote] = useState({ text: '', ok: false });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.next.length < 10) { setNote({ text: 'New password must be at least 10 characters.', ok: false }); return; }
    if (form.next !== form.confirm) { setNote({ text: 'The two new passwords don’t match.', ok: false }); return; }
    try {
      const r = await changePassword(form.current, form.next);
      setForm({ current: '', next: '', confirm: '' });
      setNote({ text: `${r.message} Other devices have been signed out.`, ok: true });
    } catch (err) {
      setNote({ text: err.message, ok: false });
    }
  };

  return (
    <article className={className}>
      <p className="portal-label">Security</p>
      <form noValidate onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="pwCur">Current password</label>
          <PasswordInput id="pwCur" autoComplete="current-password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="pwNew">New password</label>
          <PasswordInput id="pwNew" autoComplete="new-password" placeholder="At least 10 characters" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="pwConf">Confirm new password</label>
          <PasswordInput id="pwConf" autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        </div>
        <button type="submit" className="btn">Change password</button>
        {note.text && <p className={'auth-note' + (note.ok ? ' ok' : '')} role="status">{note.text}</p>}
      </form>
    </article>
  );
}
