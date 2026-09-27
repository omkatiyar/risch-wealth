import { useState } from 'react';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { FIRM } from '../data/firm';

const TOPICS = [
  'Portfolio review',
  'Private Wealth Solutions',
  'Wealth Coordination',
  'Portfolio Construction',
  'Risk Profiling',
  'Something else',
];

export default function Contact() {
  useScrollReveal();

  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: TOPICS[0], message: '' });
  const [note, setNote] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // There's no mail backend yet, so the form hands off to the visitor's
  // own email app with everything filled in, addressed to FIRM.email.
  // Once the API can send or store enquiries, POST `form` there instead.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setNote('Please add your name and email so we can reply.');
      return;
    }
    const subject = `Enquiry: ${form.topic} (${form.name.trim()})`;
    const body = [
      form.message.trim(),
      '',
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      form.phone.trim() && `Phone: ${form.phone.trim()}`,
      `Interested in: ${form.topic}`,
    ].filter((line) => line !== '' && line !== false).join('\n');
    window.location.href = `mailto:${FIRM.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNote(`Your email app should now open with this message ready to send. If it doesn't, write to ${FIRM.email} or call ${FIRM.phone}.`);
  };

  return (
    <>
      <Nav />

      <header className="page-head" style={{ paddingBottom: 40, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots" style={{ top: 0, height: 380 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow kicker reveal in">Start A Conversation</p>
          <h1 className="display-xxl reveal in" style={{ maxWidth: '14em' }}>Let's talk about your <span className="italic">portfolio.</span></h1>
          <p className="lede reveal in" style={{ maxWidth: '52ch', marginTop: 24 }}>We have a dedicated support team. Tell us a little about your situation and what you'd like help with, and we'll come back to you personally.</p>
        </div>
      </header>

      <section className="section-tight">
        <div className="wrap">
          <div className="grid g-2" style={{ gridTemplateColumns: '1fr 1fr', gap: 64 }}>

            <div className="reveal">
              <form id="contactForm" noValidate onSubmit={handleSubmit}>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="cName">Full name</label>
                    <input type="text" id="cName" name="name" required placeholder="Ananya Vodnala" value={form.name} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label htmlFor="cEmail">Email address</label>
                    <input type="email" id="cEmail" name="email" required placeholder="you@email.com" value={form.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="cPhone">Phone</label>
                    <input type="tel" id="cPhone" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label htmlFor="cTopic">I'm interested in</label>
                    <select id="cTopic" name="topic" value={form.topic} onChange={handleChange}>
                      {TOPICS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="cMsg">Message</label>
                  <textarea id="cMsg" name="message" placeholder="Tell us a little about what you're looking for..." value={form.message} onChange={handleChange}></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Send message
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
                </button>
                {note && <p id="formNote" className="body-s" style={{ marginTop: 16, color: 'var(--muted)' }}>{note}</p>}
              </form>
            </div>

            <div className="reveal" style={{ transitionDelay: '.1s' }}>
              <div className="flex gap-16" style={{ borderTop: '1px solid var(--line)', paddingTop: 28, marginBottom: 28 }}>
                <div className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
                </div>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 8 }}>Email</p>
                  <a href={`mailto:${FIRM.email}`} className="display-s" style={{ display: 'inline-block', borderBottom: '1px solid var(--line-strong)' }}>{FIRM.email}</a>
                </div>
              </div>
              <div className="flex gap-16" style={{ borderTop: '1px solid var(--line)', paddingTop: 28, marginBottom: 28 }}>
                <div className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2C9.6 22 2 14.4 2 6a2 2 0 0 1 2-2z" /></svg>
                </div>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 8 }}>Call</p>
                  <a href={FIRM.phoneHref} className="display-s" style={{ display: 'inline-block', borderBottom: '1px solid var(--line-strong)' }}>{FIRM.phone}</a>
                  <br />
                  <a href={FIRM.phoneAltHref} className="display-s" style={{ display: 'inline-block', borderBottom: '1px solid var(--line-strong)', marginTop: 8 }}>{FIRM.phoneAlt}</a>
                </div>
              </div>
              <div className="flex gap-16" style={{ borderTop: '1px solid var(--line)', paddingTop: 28, marginBottom: 28 }}>
                <div className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.4" /></svg>
                </div>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 8 }}>Office</p>
                  <address className="display-s mb-0" style={{ fontStyle: 'normal', lineHeight: 1.45 }}>
                    {FIRM.address.street},<br />
                    {FIRM.address.locality}, {FIRM.city},<br />
                    {FIRM.region} {FIRM.address.postalCode}, {FIRM.country}
                  </address>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 28 }}>
                <p className="eyebrow" style={{ marginBottom: 14 }}>Follow</p>
                <div className="flex gap-12">
                  <a href="https://www.linkedin.com/in/rishiraj-maheshwari-81240b5/" target="_blank" rel="noopener noreferrer" className="social-chip">
                    <span className="icon-badge-sm icon-badge"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.53-1 1.83-2.1 3.77-2.1 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" /></svg></span>
                    LinkedIn
                  </a>
                  <a href="https://www.instagram.com/rischwealth/?hl=en" target="_blank" rel="noopener noreferrer" className="social-chip">
                    <span className="icon-badge-sm icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></span>
                    Instagram
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
