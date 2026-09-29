import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { FIRM } from '../data/firm';
import {
  clientOverview, logout, sendClientRequest, updateClientProfile,
} from '../api/authApi';
import PasswordCard from '../components/PasswordCard';

// The signed-in client's own area. Everything shown comes from
// /api/client/*, which only ever returns this client's rows. Holdings
// themselves live on the external platform ("View your portfolio").

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtINR = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const STATUS_LABEL = { open: 'Received', in_progress: 'In progress', closed: 'Closed' };
const ALLOC = [
  ['india', 'Indian equity'],
  ['intl', 'International equity'],
  ['debt', 'Fixed income'],
  ['cash', 'Cash & liquid'],
];

export default function ClientPortal() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const load = useCallback(() => clientOverview()
    .then(setData)
    .catch((err) => { if (err.status === 401 || err.status === 403) navigate('/client-login', { replace: true }); }), [navigate]);

  useEffect(() => { load(); }, [load]);

  const onLogout = async () => {
    await logout().catch(() => {});
    navigate('/client-login', { replace: true });
  };

  return (
    <>
      <Nav />

      <header className="page-head portal-head">
        <div className="wrap">
          <p className="eyebrow kicker">Client Portal</p>
          {data ? (
            <div className="portal-welcome">
              <div>
                <h1 className="display-xl">Welcome, {data.profile.fullName.split(' ')[0]}.</h1>
                <p className="portal-sub">{data.profile.email} · Client since {fmtDate(data.profile.memberSince)}</p>
              </div>
              <button type="button" className="btn" onClick={onLogout}>Sign out</button>
            </div>
          ) : (
            <h1 className="display-xl">Your client portal.</h1>
          )}
        </div>
      </header>

      <section className="section-tight portal-body">
        <div className="wrap">
          {!data ? (
            <p className="lede">Loading your portal…</p>
          ) : (
            <div className="portal-grid">
              <PortfolioCard />
              <RiskCard risk={data.latestRiskProfile} />
              <TeamCard />
              <RequestsCard topics={data.requestTopics} requests={data.requests} onSent={load} />
              <div className="portal-pair">
                <ProfileCard profile={data.profile} onSaved={load} />
                <PasswordCard />
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

function PortfolioCard() {
  return (
    <article className="portal-card portal-card-feature">
      <p className="portal-label">Your portfolio</p>
      <h2 className="portal-title">Holdings, statements and transactions</h2>
      <p>Your live portfolio, valuations and statements are held on our secure investment platform.</p>
      <a href={FIRM.clientLoginUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View your portfolio <Arrow /></a>
    </article>
  );
}

function RiskCard({ risk }) {
  if (!risk) {
    return (
      <article className="portal-card">
        <p className="portal-label">Your risk profile</p>
        <h2 className="portal-title">Not assessed yet</h2>
        <p>Take the eight-question assessment while signed in and your result will be saved here, for us to discuss with you.</p>
        <Link to="/risk-profiler" className="btn">Take the risk assessment <Arrow /></Link>
      </article>
    );
  }
  return (
    <article className="portal-card">
      <p className="portal-label">Your risk profile</p>
      <h2 className="portal-title">{risk.tierName}</h2>
      <p className="portal-meta">Assessed {fmtDate(risk.createdAt)}{risk.investmentAmount ? ` · for ${fmtINR(risk.investmentAmount)}` : ''}</p>
      <div className="alloc-bars" role="list" aria-label="Indicative allocation">
        {ALLOC.map(([k, label]) => (
          <div className="alloc-bar" role="listitem" key={k}>
            <span className="ab-label">{label}</span>
            <span className="ab-track"><span className="ab-fill" style={{ width: `${Number(risk.allocation[k]) || 0}%` }}></span></span>
            <span className="ab-pct">{Math.round((Number(risk.allocation[k]) || 0) * 10) / 10}%</span>
          </div>
        ))}
      </div>
      <p className="portal-fine">Indicative allocation from your answers; a preliminary assessment, not a recommendation.</p>
      <Link to="/risk-profiler" className="text-link">Retake the assessment <Arrow /></Link>
    </article>
  );
}

function TeamCard() {
  return (
    <article className="portal-card">
      <p className="portal-label">Your RISCH team</p>
      <h2 className="portal-title">Rishiraj Maheshwari</h2>
      <p className="portal-meta">Founder &amp; CEO</p>
      <ul className="portal-contact">
        <li><a href={FIRM.phoneHref}>{FIRM.phone}</a></li>
        <li><a href={`mailto:${FIRM.email}`}>{FIRM.email}</a></li>
      </ul>
      <p className="portal-fine">Monday to Saturday, 10am – 6pm IST.</p>
    </article>
  );
}

function RequestsCard({ topics, requests, onSent }) {
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState('');
  const [note, setNote] = useState({ text: '', ok: false });
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) { setNote({ text: 'Please add a short message.', ok: false }); return; }
    setBusy(true);
    try {
      await sendClientRequest(topic, message.trim());
      setMessage('');
      setNote({ text: 'Request sent. Our team will get back to you shortly.', ok: true });
      onSent();
    } catch (err) {
      setNote({ text: err.message, ok: false });
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="portal-card portal-card-wide">
      <p className="portal-label">Requests</p>
      <h2 className="portal-title">Ask the RISCH team</h2>
      <div className="portal-split">
        <form noValidate onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="rqTopic">What is it about?</label>
            <select id="rqTopic" value={topic} onChange={(e) => setTopic(e.target.value)}>
              {topics.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="rqMsg">Message</label>
            <textarea id="rqMsg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A few lines on what you need…" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send request'}</button>
          {note.text && <p className={'auth-note' + (note.ok ? ' ok' : '')} role="status">{note.text}</p>}
        </form>
        <div>
          <p className="portal-sublabel">Your recent requests</p>
          {requests.length === 0 ? (
            <p className="portal-fine">No requests yet.</p>
          ) : (
            <ul className="request-list">
              {requests.map((r) => (
                <li key={r.id}>
                  <div className="rq-top">
                    <strong>{r.topic}</strong>
                    <span className={'status-pill ' + (r.status === 'closed' ? 'disabled' : r.status === 'in_progress' ? 'progress' : 'active')}>{STATUS_LABEL[r.status]}</span>
                  </div>
                  <p>{r.message}</p>
                  <span className="rq-date">{fmtDate(r.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

function ProfileCard({ profile, onSaved }) {
  const [form, setForm] = useState({ fullName: profile.fullName, phone: profile.phone || '' });
  const [note, setNote] = useState({ text: '', ok: false });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClientProfile(form);
      setNote({ text: 'Details saved.', ok: true });
      onSaved();
    } catch (err) {
      setNote({ text: err.message, ok: false });
    }
  };

  return (
    <article className="portal-card">
      <p className="portal-label">Your details</p>
      <form noValidate onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="pfName">Full name</label>
          <input id="pfName" type="text" autoComplete="name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="pfEmail">Email</label>
          <input id="pfEmail" type="email" value={profile.email} disabled />
        </div>
        <div className="field">
          <label htmlFor="pfPhone">Mobile</label>
          <input id="pfPhone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <button type="submit" className="btn">Save details</button>
        {note.text && <p className={'auth-note' + (note.ok ? ' ok' : '')} role="status">{note.text}</p>}
      </form>
    </article>
  );
}
