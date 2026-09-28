import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PRINCIPLES } from '../data/principles';

export default function Solutions() {
  useScrollReveal();

  return (
    <>
      <Nav />

      <header className="page-head" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots" style={{ top: 0, height: 420 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow kicker reveal in">What We Do</p>
          <h1 className="display-xxl reveal in" style={{ maxWidth: '16em' }}>Four disciplines. <span className="italic">One</span> portfolio.</h1>
        </div>
      </header>

      <section className="section-tight">
        <div className="wrap">
          <div className="numbered-row reveal" style={{ padding: '44px 0' }}>
            <div className="num">01</div>
            <div className="grid g-2" style={{ gridTemplateColumns: '1fr 1.6fr', alignItems: 'center' }}>
              <div className="flex gap-16 items-center">
                <div className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5" /><path d="M3 17l9 5 9-5" /></svg>
                </div>
                <h2 className="display-s">Private Wealth Solutions</h2>
              </div>
              <p className="mb-0" style={{ maxWidth: '52ch' }}>Portfolios built on a documented suitability process — reviewed against your objectives at every rebalancing.</p>
            </div>
          </div>

          <div className="numbered-row reveal" style={{ padding: '44px 0' }}>
            <div className="num">02</div>
            <div className="grid g-2" style={{ gridTemplateColumns: '1fr 1.6fr', alignItems: 'center' }}>
              <div className="flex gap-16 items-center">
                <div className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" /><circle cx="17" cy="8.5" r="2.6" /><path d="M15 14.2c2.7.4 4.7 2.5 4.7 5.8" /></svg>
                </div>
                <h2 className="display-s">Wealth Coordination</h2>
              </div>
              <p className="mb-0" style={{ maxWidth: '52ch' }}>Consolidated reporting, succession and governance structuring — one point of contact for your legal and tax advisers.</p>
            </div>
          </div>

          <div className="numbered-row reveal" style={{ padding: '44px 0' }}>
            <div className="num">03</div>
            <div className="grid g-2" style={{ gridTemplateColumns: '1fr 1.6fr', alignItems: 'center' }}>
              <div className="flex gap-16 items-center">
                <div className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2" /><rect x="14" y="3" width="7" height="7" rx="1.2" /><rect x="3" y="14" width="7" height="7" rx="1.2" /><rect x="14" y="14" width="7" height="7" rx="1.2" /></svg>
                </div>
                <h2 className="display-s">Portfolio Construction</h2>
              </div>
              <p className="mb-0" style={{ maxWidth: '52ch' }}>Granular allocation across domestic and international equity, fixed income, commodities and real estate — sized to you, not a model.</p>
            </div>
          </div>

          <div className="numbered-row reveal" style={{ padding: '44px 0' }}>
            <div className="num">04</div>
            <div className="grid g-2" style={{ gridTemplateColumns: '1fr 1.6fr', alignItems: 'center' }}>
              <div className="flex gap-16 items-center">
                <div className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>
                </div>
                <h2 className="display-s">Risk Profiling</h2>
              </div>
              <p className="mb-0" style={{ maxWidth: '52ch' }}>An eight-question diagnostic scores time horizon and risk preference independently, then matches you to a portfolio.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight on-tint">
        <div className="wrap">
          <div className="reveal" style={{ maxWidth: 640, marginBottom: 48 }}>
            <p className="eyebrow">Investment Philosophy</p>
            <h2 className="display-l">Our Investment Principles.</h2>
            <p className="lede" style={{ marginTop: 16 }}>The same principles we set out for every new client, before a single rupee is committed.</p>
          </div>
          <div className="grid g-3 reveal-stagger">
            {PRINCIPLES.map((p) => (
              <div key={p.title} style={{ borderTop: '1px solid var(--line-strong)', paddingTop: 24 }}>
                <div className="icon-badge" style={{ marginBottom: 18 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{p.icon}</svg>
                </div>
                <h3 className="display-s" style={{ marginBottom: 8 }}>{p.title}</h3>
                <p className="body-s mb-0">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="eyebrow reveal">Allocation Universe</p>
          <h2 className="display-l reveal" style={{ maxWidth: '18ch', marginBottom: 56 }}>What we allocate across.</h2>

          <div className="grid g-3 reveal-stagger">
            <div style={{ borderTop: '1px solid var(--line-strong)', paddingTop: 24 }}>
              <div className="icon-badge" style={{ marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 8 }}>Domestic Equity</h3>
              <p className="body-s mb-0">Large, mid &amp; small cap, plus thematic &amp; sectoral funds.</p>
            </div>
            <div style={{ borderTop: '1px solid var(--line-strong)', paddingTop: 24 }}>
              <div className="icon-badge" style={{ marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 8 }}>International Equity</h3>
              <p className="body-s mb-0">US, Europe, Asia ex-Japan &amp; Taiwan.</p>
            </div>
            <div style={{ borderTop: '1px solid var(--line-strong)', paddingTop: 24 }}>
              <div className="icon-badge" style={{ marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20" /><circle cx="7" cy="14.5" r="1.3" fill="currentColor" stroke="none" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 8 }}>Fixed Income</h3>
              <p className="body-s mb-0">Short, medium &amp; long duration.</p>
            </div>
            <div style={{ borderTop: '1px solid var(--line-strong)', paddingTop: 24 }}>
              <div className="icon-badge" style={{ marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18" /><path d="M5 20l2-6h4l2 6" /><path d="M11 20l2-6h4l2 6" /><path d="M8 14l2-5h4l2 5" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 8 }}>Commodities</h3>
              <p className="body-s mb-0">Gold &amp; silver.</p>
            </div>
            <div style={{ borderTop: '1px solid var(--line-strong)', paddingTop: 24 }}>
              <div className="icon-badge" style={{ marginBottom: 18 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V9l7-5 7 5v12" /><path d="M9 21v-6h6v6" /><path d="M9 11h.01M15 11h.01" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 8 }}>Real Estate</h3>
              <p className="body-s mb-0">REITs &amp; InvITs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section on-paper-2" style={{ padding: '140px 0' }}>
        <div className="wrap center">
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>Find Your Portfolio</p>
          <h2 className="display-xl reveal" style={{ maxWidth: '18ch', margin: '0 auto 36px' }}>Your allocation is personal — see it in your proposal.</h2>
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
