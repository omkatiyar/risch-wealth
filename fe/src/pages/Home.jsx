import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import TestimonialSlider from '../components/TestimonialSlider/TestimonialSlider';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useDocumentHead } from '../hooks/useDocumentHead';

export default function Home() {
  useDocumentHead(
    'RISCH Wealth — Private Wealth',
    'RISCH Wealth is an independent private wealth firm founded by a career private banker.'
  );
  useScrollReveal();

  return (
    <>
      <Nav />

      <header className="arc-wrap" style={{ padding: '186px 0 0', overflow: 'hidden', position: 'relative' }}>
        <div className="pattern-dots" style={{ top: 0, height: 600 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow reveal in">RISCH Private Wealth</p>
          <h1 className="display-xxl reveal in" style={{ maxWidth: '15em' }}>Capital deserves<br /><span className="italic">a considered</span> hand.</h1>
          <div className="grid g-2" style={{ gridTemplateColumns: '1.4fr 1fr', marginTop: 40, alignItems: 'end' }}>
            <p className="lede reveal in" style={{ maxWidth: '36ch', transitionDelay: '.1s' }}>Independent private wealth, led by a career private banker. Risk understood first — then a portfolio built around it.</p>
            <div className="flex gap-16 reveal in" style={{ transitionDelay: '.2s', flexWrap: 'wrap' }}>
              <Link to="/risk-profiler" className="btn btn-primary">Begin your risk profile
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
              </Link>
              <Link to="/about" className="btn">Meet the founder</Link>
            </div>
          </div>
        </div>

        <div className="wrap" style={{ marginTop: 64, position: 'relative' }}>
          <svg className="arc-svg" viewBox="0 0 1200 300" width="100%" height="auto" preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
            <defs>
              <linearGradient id="arcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C85A16" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#C85A16" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="arc-fill" d="M0,260 C150,255 220,150 340,140 C460,130 520,220 640,205 C760,190 820,60 960,50 C1060,43 1140,90 1200,70 L1200,300 L0,300 Z" />
            <path className="arc-line" d="M0,260 C150,255 220,150 340,140 C460,130 520,220 640,205 C760,190 820,60 960,50 C1060,43 1140,90 1200,70" />
            <circle className="arc-dot" cx="1200" cy="70" r="4.5" fill="#C85A16" />
          </svg>
        </div>
      </header>

      <div className="ticker">
        <div className="ticker-track">
          <span><b>ALLOCATION UNIVERSE</b></span>
          <span>Domestic Equity</span><span>·</span>
          <span>International Equity</span><span>·</span>
          <span>Fixed Income</span><span>·</span>
          <span>Cash &amp; Liquid Equivalents</span><span>·</span>
          <span><b>ALLOCATION UNIVERSE</b></span>
          <span>Domestic Equity</span><span>·</span>
          <span>International Equity</span><span>·</span>
          <span>Fixed Income</span><span>·</span>
          <span>Cash &amp; Liquid Equivalents</span><span>·</span>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="grid g-2" style={{ gridTemplateColumns: '0.9fr 1.1fr' }}>
            <div className="reveal">
              <p className="eyebrow">Our Method</p>
              <h2 className="display-l">Risk first.<br />Return follows.</h2>
            </div>
            <div className="reveal">
              <p className="lede" style={{ maxWidth: '50ch' }}>Most portfolios start with a return target. Ours start with what you can actually withstand.</p>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div className="numbered-row reveal">
              <div className="num">01</div>
              <div className="grid g-2" style={{ gridTemplateColumns: '1fr 1.6fr', alignItems: 'center' }}>
                <div className="flex gap-16 items-center">
                  <div className="icon-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>
                  </div>
                  <h3 className="display-s">Capacity, measured</h3>
                </div>
                <p className="mb-0">What you're able to withstand, not just what you feel able to.</p>
              </div>
            </div>
            <div className="numbered-row reveal">
              <div className="num">02</div>
              <div className="grid g-2" style={{ gridTemplateColumns: '1fr 1.6fr', alignItems: 'center' }}>
                <div className="flex gap-16 items-center">
                  <div className="icon-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5" /><path d="M3 17l9 5 9-5" /></svg>
                  </div>
                  <h3 className="display-s">Portfolio, matched</h3>
                </div>
                <p className="mb-0">Time horizon and risk preference decide the portfolio — never the other way round.</p>
              </div>
            </div>
            <div className="numbered-row reveal">
              <div className="num">03</div>
              <div className="grid g-2" style={{ gridTemplateColumns: '1fr 1.6fr', alignItems: 'center' }}>
                <div className="flex gap-16 items-center">
                  <div className="icon-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /></svg>
                  </div>
                  <h3 className="display-s">Outcome, disclosed</h3>
                </div>
                <p className="mb-0">Best case, expected case, worst case — shown before a rupee moves.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section on-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots"></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>What Clients Say</p>
          <h2 className="display-l reveal center" style={{ margin: '0 auto 56px' }}>Client experiences.</h2>
          <TestimonialSlider />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="flex justify-between items-center reveal" style={{ flexWrap: 'wrap', gap: 24, marginBottom: 56 }}>
            <div>
              <p className="eyebrow">What We Do</p>
              <h2 className="display-l" style={{ maxWidth: '14ch', marginBottom: 0 }}>Built around the whole balance sheet.</h2>
            </div>
            <Link to="/solutions" className="btn">View all solutions
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
            </Link>
          </div>

          <div className="grid g-4 reveal-stagger">
            <div className="card">
              <div className="icon-badge" style={{ marginBottom: 22 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5" /><path d="M3 17l9 5 9-5" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 10 }}>Private Wealth Solutions</h3>
              <p className="body-s mb-0">Portfolios built on a documented process, not a house view.</p>
            </div>
            <div className="card">
              <div className="icon-badge" style={{ marginBottom: 22 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" /><circle cx="17" cy="8.5" r="2.6" /><path d="M15 14.2c2.7.4 4.7 2.5 4.7 5.8" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 10 }}>Wealth Coordination</h3>
              <p className="body-s mb-0">Consolidated reporting and succession, across generations.</p>
            </div>
            <div className="card">
              <div className="icon-badge" style={{ marginBottom: 22 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2" /><rect x="14" y="3" width="7" height="7" rx="1.2" /><rect x="3" y="14" width="7" height="7" rx="1.2" /><rect x="14" y="14" width="7" height="7" rx="1.2" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 10 }}>Portfolio Construction</h3>
              <p className="body-s mb-0">Granular allocation, sized to the client — not the model.</p>
            </div>
            <div className="card">
              <div className="icon-badge" style={{ marginBottom: 22 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>
              </div>
              <h3 className="display-s" style={{ marginBottom: 10 }}>Risk Profiling</h3>
              <p className="body-s mb-0">Time horizon and risk preference, scored independently.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section on-paper-2">
        <div className="wrap center">
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>The Instrument</p>
          <h2 className="display-l reveal" style={{ maxWidth: '20ch', margin: '0 auto 20px' }}>Your risk profile, generated in eight questions.</h2>
          <p className="lede reveal" style={{ maxWidth: '50ch', margin: '0 auto 36px' }}>A short questionnaire, an instant proposal — your allocation and hypothetical outcomes, built around your answers.</p>
          <Link to="/risk-profiler" className="btn btn-rust reveal">Start the risk profiler
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
          </Link>
        </div>
      </section>

      <section className="section on-dark" style={{ padding: '140px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots"></div>
        <div className="wrap center" style={{ position: 'relative' }}>
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>Start A Conversation</p>
          <h2 className="display-xl reveal" style={{ maxWidth: '16ch', margin: '0 auto 36px' }}>Let's understand your risk before we discuss your return.</h2>
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
