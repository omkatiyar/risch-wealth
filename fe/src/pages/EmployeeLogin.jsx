import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { login, me } from '../api/authApi';
import PasswordInput from '../components/PasswordInput';
import { Req, ReqLegend } from '../components/Req';


const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
);


// Staff sign-in only; the portal itself is /employee-portal. There is no
// public sign-up: admins create employee accounts under Team accounts.
export default function EmployeeLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    me().then((r) => { if (r.user.role !== 'client') navigate('/employee-portal', { replace: true }); }).catch(() => {});
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.identifier.trim() || !form.password) { setNote('Please enter your employee ID or email, and your password.'); return; }
    setBusy(true);
    try {
      await login(form.identifier.trim(), form.password, 'staff');
      navigate('/employee-portal');
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
          <div className="auth-card">
            <form noValidate onSubmit={onSubmit}>
              <h2 className="auth-title">Sign in with your RISCH account</h2>
              <ReqLegend />
              <div className="field">
                <label htmlFor="eId">Employee ID or email <Req /></label>
                <input id="eId" aria-required="true" type="text" autoComplete="username" placeholder="e.g. RW1024" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="ePassword">Password <Req /></label>
                <PasswordInput id="ePassword" aria-required="true" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in…' : <>Sign in <Arrow /></>}</button>
              {note && <p className="auth-note" role="status">{note}</p>}
              <p className="body-s" style={{ marginTop: 18 }}>Accounts are created by a RISCH administrator. Forgotten your password? Ask your administrator to reset it.</p>
            </form>
          </div>
          <p className="body-s" style={{ marginTop: 28 }}>
            Are you a client? <Link to="/client-login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Go to Client Login</Link>
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
