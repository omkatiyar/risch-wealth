import { useState } from 'react';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';

export default function EmployeeLogin() {
  const [form, setForm] = useState({ employeeId: '', password: '' });
  const [note, setNote] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setNote('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.employeeId.trim() || !form.password) {
      setNote('Please enter your employee ID and password.');
      return;
    }
    // No employee accounts yet (no database/auth in be/). Once they exist,
    // POST the credentials to the API here instead of just showing a note.
    setForm((prev) => ({ ...prev, password: '' }));
    setNote("Employee sign-in isn't available yet. It will be switched on once staff accounts are set up.");
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
          <form noValidate onSubmit={handleSubmit} style={{ maxWidth: 440 }}>
            <div className="field">
              <label htmlFor="eId">Employee ID</label>
              <input type="text" id="eId" name="employeeId" autoComplete="username" required placeholder="e.g. RW1024" value={form.employeeId} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="ePassword">Password</label>
              <input type="password" id="ePassword" name="password" autoComplete="current-password" required placeholder="Your password" value={form.password} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Sign in
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
            </button>
            {note && <p className="body-s" role="status" style={{ marginTop: 16, color: 'var(--muted)' }}>{note}</p>}
            <p className="body-s" style={{ marginTop: 28 }}>
              Are you a client?{' '}
              <a href="https://wealthelite.in/client-login" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange-deep)', fontWeight: 600 }}>Go to Client Login</a>
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
