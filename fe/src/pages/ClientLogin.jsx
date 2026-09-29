import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { FIRM } from '../data/firm';
import { login, me, signupClient } from '../api/authApi';
import PasswordInput from '../components/PasswordInput';

const EMPTY = { fullName: '', email: '', phone: '', password: '', confirm: '' };

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
);

// Client sign-in / sign-up. Portfolio holdings themselves live on the
// external platform (FIRM.clientLoginUrl), reached via "View your portfolio".
export default function ClientLogin() {
  const [mode, setMode] = useState('signin');
  const [signin, setSignin] = useState({ email: '', password: '' });
  const [reg, setReg] = useState(EMPTY);
  const [note, setNote] = useState({ text: '', ok: false });
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  // Signed-in clients belong in their portal.
  useEffect(() => {
    me().then((r) => { if (r.user.role === 'client') navigate('/client-portal', { replace: true }); }).catch(() => {});
  }, [navigate]);

  const go = (m) => { setMode(m); setNote({ text: '', ok: false }); };

  const onSignin = async (e) => {
    e.preventDefault();
    if (!signin.email.trim() || !signin.password) { setNote({ text: 'Please enter your email and password.', ok: false }); return; }
    setBusy(true);
    try {
      await login(signin.email.trim(), signin.password, 'client');
      navigate('/client-portal');
    } catch (err) {
      setSignin((s) => ({ ...s, password: '' }));
      setNote({ text: err.message, ok: false });
    } finally {
      setBusy(false);
    }
  };

  const onSignup = async (e) => {
    e.preventDefault();
    if (reg.password.length < 10) { setNote({ text: 'Password must be at least 10 characters.', ok: false }); return; }
    if (reg.password !== reg.confirm) { setNote({ text: 'The two passwords don’t match.', ok: false }); return; }
    setBusy(true);
    try {
      const { confirm, ...data } = reg; // eslint-disable-line no-unused-vars
      const r = await signupClient(data);
      setSignin({ email: reg.email, password: '' });
      setReg(EMPTY);
      setMode('signin');
      setNote({ text: r.message, ok: true });
    } catch (err) {
      setReg((s) => ({ ...s, password: '', confirm: '' }));
      setNote({ text: err.message, ok: false });
    } finally {
      setBusy(false);
    }
  };

  const field = (id, label, props) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {props.type === 'password' ? <PasswordInput id={id} {...props} /> : <input id={id} {...props} />}
    </div>
  );

  const portfolioLink = (
    <a href={FIRM.clientLoginUrl} target="_blank" rel="noopener noreferrer" className="btn">View your portfolio <Arrow /></a>
  );

  return (
    <>
      <Nav />

      <header className="page-head" style={{ paddingBottom: 40, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots" style={{ top: 0, height: 380 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow kicker reveal in">Client Access</p>
          <h1 className="display-xxl reveal in" style={{ maxWidth: '14em' }}>Client <span className="italic">login.</span></h1>
        </div>
      </header>

      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="auth-card">
            {mode === 'signin' ? (
              <form noValidate onSubmit={onSignin}>
                <h2 className="auth-title">Sign in to your account</h2>
                {field('cEmail', 'Email', { type: 'email', autoComplete: 'email', value: signin.email, onChange: (e) => setSignin({ ...signin, email: e.target.value }) })}
                {field('cPassword', 'Password', { type: 'password', autoComplete: 'current-password', value: signin.password, onChange: (e) => setSignin({ ...signin, password: e.target.value }) })}
                <button type="submit" className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in…' : <>Login <Arrow /></>}</button>
                {note.text && <p className={'auth-note' + (note.ok ? ' ok' : '')} role="status">{note.text}</p>}
                <div className="auth-actions">
                  <button type="button" className="btn" onClick={() => go('signup')}>Sign up</button>
                  {portfolioLink}
                </div>
              </form>
            ) : (
              <form noValidate onSubmit={onSignup}>
                <h2 className="auth-title">Create your client account</h2>
                {field('rName', 'Full name', { type: 'text', autoComplete: 'name', value: reg.fullName, onChange: (e) => setReg({ ...reg, fullName: e.target.value }) })}
                <div className="field-row">
                  {field('rEmail', 'Email', { type: 'email', autoComplete: 'email', value: reg.email, onChange: (e) => setReg({ ...reg, email: e.target.value }) })}
                  {field('rPhone', 'Mobile (optional)', { type: 'tel', autoComplete: 'tel', placeholder: '+91', value: reg.phone, onChange: (e) => setReg({ ...reg, phone: e.target.value }) })}
                </div>
                {field('rPassword', 'Password', { type: 'password', autoComplete: 'new-password', placeholder: 'At least 10 characters', value: reg.password, onChange: (e) => setReg({ ...reg, password: e.target.value }) })}
                {field('rConfirm', 'Confirm password', { type: 'password', autoComplete: 'new-password', value: reg.confirm, onChange: (e) => setReg({ ...reg, confirm: e.target.value }) })}
                <button type="submit" className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Creating account…' : <>Create account <Arrow /></>}</button>
                {note.text && <p className={'auth-note' + (note.ok ? ' ok' : '')} role="status">{note.text}</p>}
                <p className="body-s" style={{ marginTop: 18 }}>Already have an account? <button type="button" className="auth-link" onClick={() => go('signin')}>Sign in</button></p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
