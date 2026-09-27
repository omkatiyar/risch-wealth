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
          <p className="lede reveal in" style={{ maxWidth: '52ch', marginTop: 26 }}>RISCH works with a small number of clients directly — the profiles below are the ones we see most often, not a checklist you need to fit.</p>
        </div>
      </header>

      <section className="section-tight">
        <div className="wrap">
          <div className="grid g-3 reveal-stagger">
            {SEGMENTS.map((s) => (
              <div className="card" key={s.title}>
                <div className="icon-badge" style={{ marginBottom: 22 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
                </div>
                <h2 className="display-s" style={{ marginBottom: 10 }}>{s.title}</h2>
                <p className="body-s mb-0">{s.body}</p>
              </div>
            ))}
          </div>
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
