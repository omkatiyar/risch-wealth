import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import founderHeadshot from '../assets/founder-headshot.jpg';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { FIRM } from '../data/firm';

export default function About() {
  useScrollReveal();

  return (
    <>
      <Nav />

      <header className="page-head" style={{ position: 'relative', overflow: 'hidden', paddingBottom: 60 }}>
        <div className="pattern-dots" style={{ top: 0, height: 420 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow kicker reveal in">Who We Are</p>
          <h1 className="display-xxl reveal in" style={{ maxWidth: '16em' }}>Built for people who ask <span className="italic">why</span>, not just <span className="italic">how much</span>.</h1>
        </div>
      </header>

      <section className="section-tight">
        <div className="wrap">
          <div className="grid g-2" style={{ gridTemplateColumns: '0.8fr 1.2fr', alignItems: 'start' }}>
            <div className="reveal center">
              <img src={founderHeadshot} alt="Rishiraj Maheshwari, Founder & CEO" className="avatar-photo" width="380" height="380" style={{ margin: '0 auto' }} />
              <h2 className="display-s" style={{ marginTop: 26, marginBottom: 4 }}>Rishiraj Maheshwari</h2>
              <p className="mono body-s" style={{ color: 'var(--orange-deep)', marginBottom: 20 }}>Founder &amp; CEO</p>
              <div className="flex gap-10" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>
                <a href="https://www.linkedin.com/in/rishiraj-maheshwari-81240b5/" target="_blank" rel="noopener noreferrer" className="social-chip">
                  <span className="icon-badge-sm icon-badge"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.53-1 1.83-2.1 3.77-2.1 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" /></svg></span>
                  LinkedIn
                </a>
                <a href="tel:+919448090998" className="social-chip">
                  <span className="icon-badge-sm icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2C9.6 22 2 14.4 2 6a2 2 0 0 1 2-2z" /></svg></span>
                  Call
                </a>
              </div>
            </div>

            <div className="reveal" style={{ transitionDelay: '.08s' }}>
              <p className="eyebrow">The Founder</p>
              <h2 className="display-l" style={{ marginBottom: 20 }}>Two decades in private banking.</h2>
              <p className="lede" style={{ marginBottom: 18 }}>Rishiraj founded RISCH after more than two decades in private banking — most recently at Edelweiss Financial Services, and before that as a Senior Private Banker at ICICI Securities.</p>
              <p style={{ maxWidth: '58ch', marginBottom: 28 }}>That career is why RISCH is built the way it is: risk understood first, in a documented and repeatable way, before a single recommendation is made.</p>

              <div className="flex gap-12" style={{ flexWrap: 'wrap' }}>
                <span className="cred-pill">
                  <span className="icon-badge-sm icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9l10-5 10 5-10 5-10-5z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></svg></span>
                  MBA
                </span>
                <span className="cred-pill">
                  <span className="icon-badge-sm icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 12h18" /></svg></span>
                  20+ Years
                </span>
                <span className="cred-pill">
                  <span className="icon-badge-sm icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.4" /></svg></span>
                  Bengaluru
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-story">
        <div className="wrap">
          <div className="grid g-2" style={{ gridTemplateColumns: '0.9fr 1.1fr', alignItems: 'start' }}>
            <div className="reveal">
              <p className="eyebrow">About RISCH</p>
              <h2 className="display-l">Built from private banking.<br /><span className="italic">Designed around the client.</span></h2>
            </div>
            <div className="reveal about-story-body">
              <p className="lede">RISCH was founded in {FIRM.foundedYear} by Rishiraj Maheshwari, after a career advising wealthy individuals and families at some of India&rsquo;s best-known financial institutions.</p>
              <p>Today, RISCH works with a select group of clients who want a more disciplined, personal approach to their wealth: fewer products, clearer reasoning, and one accountable relationship.</p>
              <p className="about-creed">Understand the client.<br />Build around the client.<br />Stay accountable to the client.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section on-paper-2">
        <div className="wrap">
          <div className="exp-head">
            <div className="reveal">
              <p className="eyebrow">Experience</p>
              <h2 className="display-l">Two decades across India&rsquo;s leading wealth institutions.</h2>
            </div>
            <p className="lede reveal" style={{ maxWidth: '44ch' }}>Private banking and family-office advisory at ICICI Securities and Edelweiss, before founding RISCH in {FIRM.foundedYear}.</p>
          </div>

          <div className="exp-current reveal">
            <span className="exp-label">Current</span>
            <div>
              <h3>Founder &amp; CEO</h3>
              <p>RISCH Wealth Private Limited · Bengaluru · Since {FIRM.foundedYear}</p>
            </div>
          </div>

          <p className="exp-label exp-label-prior reveal">Previously</p>
          <ul className="exp-list reveal-stagger">
            <li><h3>Edelweiss Financial Services</h3><p>Mumbai</p></li>
            <li><h3>Senior Private Banker</h3><p>ICICI Securities · Bengaluru</p></li>
            <li><h3>Assistant Vice President, Private Wealth</h3><p>Unicon Investment Solutions · Bengaluru</p></li>
            <li><h3>Relationship Manager</h3><p>Indiabulls Securities</p></li>
          </ul>

          <div className="exp-edu reveal">
            <span className="exp-label">Education</span>
            <p><strong>MBA, Marketing &amp; Systems</strong> · Canara Bank School of Management Studies</p>
            <p><strong>BCA</strong> · DAVV University</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow reveal">How We Work</p>
          <h2 className="display-l reveal" style={{ maxWidth: '16ch', marginBottom: 56 }}>Four principles.</h2>

          <div className="grid g-4 reveal-stagger">
            <div>
              <div className="icon-badge" style={{ marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 8 }}>Ability before willingness</h3>
              <p className="body-s mb-0">Capacity sets the boundary. Willingness never overrides it.</p>
            </div>
            <div>
              <div className="icon-badge" style={{ marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M15 9l-2 6-6 2 2-6 6-2z" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 8 }}>Independence from product</h3>
              <p className="body-s mb-0">No proprietary fund. Recommendations align to the client, not the shelf.</p>
            </div>
            <div>
              <div className="icon-badge" style={{ marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 8 }}>Disclosure before commitment</h3>
              <p className="body-s mb-0">Worst case shown before a rupee is funded, not after.</p>
            </div>
            <div>
              <div className="icon-badge" style={{ marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M5 7l-3 6a3 3 0 0 0 6 0l-3-6zM19 7l-3 6a3 3 0 0 0 6 0l-3-6zM5 7h14M9 21h6" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 8 }}>Bounded deviation</h3>
              <p className="body-s mb-0">Any override is recorded, justified, and signed by both parties.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section on-paper-2">
        <div className="wrap">
          <p className="eyebrow reveal">Governance &amp; Standing</p>
          <h2 className="display-m reveal" style={{ marginBottom: 40 }}>Documented, structured, accountable.</h2>
          <div className="grid g-4 reveal-stagger">
            <div className="card">
              <div className="icon-badge icon-badge-sm" style={{ marginBottom: 16 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M15 9l-2 6-6 2 2-6 6-2z" /></svg>
              </div>
              <p className="display-s" style={{ marginBottom: 4 }}>Open Architecture</p>
              <p className="body-s mb-0">No proprietary product.</p>
            </div>
            <div className="card">
              <div className="icon-badge icon-badge-sm" style={{ marginBottom: 16 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>
              </div>
              <p className="display-s" style={{ marginBottom: 4 }}>8-Point Diagnostic</p>
              <p className="body-s mb-0">Scored independently.</p>
            </div>
            <div className="card">
              <div className="icon-badge icon-badge-sm" style={{ marginBottom: 16 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M5 7l-3 6a3 3 0 0 0 6 0l-3-6zM19 7l-3 6a3 3 0 0 0 6 0l-3-6zM5 7h14M9 21h6" /></svg>
              </div>
              <p className="display-s" style={{ marginBottom: 4 }}>Bounded Deviation</p>
              <p className="body-s mb-0">Jointly signed, always.</p>
            </div>
            <div className="card">
              <div className="icon-badge icon-badge-sm" style={{ marginBottom: 16 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.2" /><rect x="13" y="4" width="7" height="7" rx="1.2" /><rect x="4" y="13" width="7" height="7" rx="1.2" /><rect x="13" y="13" width="7" height="7" rx="1.2" /></svg>
              </div>
              <p className="display-s" style={{ marginBottom: 4 }}>Conflict Walls</p>
              <p className="body-s mb-0">Managed independently.</p>
            </div>
          </div>
          {FIRM.registrations.length > 0 && (
            <div className="reg-strip reveal">
              <div>
                <p className="mb-0">{FIRM.registrationNote}</p>
                <p className="mb-0 reg-role">{FIRM.roleNote}</p>
              </div>
              <p className="reg-ids mb-0">
                {FIRM.registrations.map((r) => (
                  <span key={r.id}><em>{r.label}</em> {r.id}</span>
                ))}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section on-dark" style={{ padding: '140px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots"></div>
        <div className="wrap center" style={{ position: 'relative' }}>
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>Next Step</p>
          <h2 className="display-xl reveal" style={{ maxWidth: '16ch', margin: '0 auto 36px' }}>See what a portfolio built for you looks like.</h2>
          <div className="flex gap-16 reveal" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/risk-profiler" className="btn btn-rust">Take the risk profiler</Link>
            <Link to="/contact" className="btn btn-ghost-dark">Get in touch</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
