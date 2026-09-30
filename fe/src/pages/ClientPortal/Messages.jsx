import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sendClientRequest } from '../../api/authApi';
import { PageHead, fmtDate } from './ui';
import { Req, ReqLegend } from '../../components/Req';

const STATUS = { open: ['Received', 'active'], in_progress: ['In progress', 'progress'], closed: ['Closed', 'disabled'] };

export default function Messages({ data, reloadOverview }) {
  const { state } = useLocation();
  const topics = data.requestTopics;
  const [tab, setTab] = useState('new');
  const [topic, setTopic] = useState(topics.includes(state?.topic) ? state.topic : topics[0]);
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
      reloadOverview();
    } catch (err) {
      setNote({ text: err.message, ok: false });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHead title="Messages & requests" sub="Get in touch with the RISCH team." />
      <div className="cp-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'new'} className={tab === 'new' ? 'on' : ''} onClick={() => setTab('new')}>New request</button>
        <button type="button" role="tab" aria-selected={tab === 'list'} className={tab === 'list' ? 'on' : ''} onClick={() => setTab('list')}>Your requests ({data.requests.length})</button>
      </div>

      {tab === 'new' ? (
        <section className="cp-card cp-form-card">
          <form noValidate onSubmit={onSubmit}>
            <ReqLegend />
            <div className="field">
              <label htmlFor="rqTopic">What is it about?</label>
              <select id="rqTopic" value={topic} onChange={(e) => setTopic(e.target.value)}>
                {topics.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="rqMsg">Message <Req /></label>
              <textarea id="rqMsg" aria-required="true" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A few lines on what you need…" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send request'}</button>
            {note.text && <p className={'auth-note' + (note.ok ? ' ok' : '')} role="status">{note.text}</p>}
          </form>
        </section>
      ) : (
        <section className="cp-card">
          {data.requests.length === 0 ? <p className="cp-muted">No requests yet.</p> : (
            <ul className="request-list">
              {data.requests.map((r) => (
                <li key={r.id}>
                  <div className="rq-top">
                    <strong>{r.topic}</strong>
                    <span className={`status-pill ${STATUS[r.status][1]}`}>{STATUS[r.status][0]}</span>
                  </div>
                  <p>{r.message}</p>
                  <span className="rq-date">Sent {fmtDate(r.createdAt)}{r.updatedAt !== r.createdAt ? ` · updated ${fmtDate(r.updatedAt)}` : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
