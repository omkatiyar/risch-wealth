import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { SEGMENTS } from '../data/segments';

export default function WhoWeServe() {
  useScrollReveal();

  return (
    <>
      <Nav />

      <header className="page-head" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots" style={{ top: 0, height: 420 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow kicker reveal in">Who We Serve</p>
          <h1 className="display-xxl reveal in" style={{ maxWidth: '16em' }}>Built around <span className="italic">your</span> balance sheet, whatever shape it takes.</h1>
          <p className="lede reveal in" style={{ maxWidth: '46ch', marginTop: 26 }}>RISCH works with a small number of clients directly. These are the people we work with most often — not a checklist you need to fit.</p>
        </div>
      </header>

      <section className="section-tight">
        <div className="wrap">
          <div className="serve-grid reveal-stagger">
            {SEGMENTS.map((s, i) => (
              <Link to="/contact" className="serve-card" key={s.title}>
                <div className="serve-card-top">
                  <span className="serve-eyebrow">{String(i + 1).padStart(2, '0')} · {s.eyebrow}</span>
                  <span className="serve-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
                  </span>
                </div>
                <h2 className="serve-title">{s.title}</h2>
                <p className="serve-body">{s.body}</p>
                <span className="serve-cta">Start a conversation <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
          <p className="serve-motto reveal">Every relationship is built on trust.<br />Every strategy is built for the long term.</p>
        </div>
      </section>

      <section className="section on-paper-2" style={{ padding: '140px 0' }}>
        <div className="wrap center">
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>Not Sure Where You Fit?</p>
          <h2 className="display-xl reveal" style={{ maxWidth: '18ch', margin: '0 auto 36px' }}>The risk profiler is a better starting point than a category.</h2>
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
