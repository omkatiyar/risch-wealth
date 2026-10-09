import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PERSPECTIVES } from '../data/perspectives';

export default function Perspective() {
  useScrollReveal();

  return (
    <>
      <Nav />

      <header className="page-head" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots" style={{ top: 0, height: 420 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow kicker reveal in">Perspective</p>
          <h1 className="display-xxl reveal in" style={{ maxWidth: '16em' }}>Notes on risk, <span className="italic">not</span> noise.</h1>
          <p className="lede reveal in" style={{ maxWidth: '52ch', marginTop: 26 }}>Occasional writing on how we think about risk, portfolios and wealth coordination, not market commentary or calls.</p>
        </div>
      </header>

      <section className="section-tight">
        <div className="wrap">
          <div className="reveal-stagger">
            {PERSPECTIVES.map((p) => (
              <div className="numbered-row" key={p.title} style={{ gridTemplateColumns: '140px 1fr' }}>
                <div className="num" style={{ fontSize: 12.5, letterSpacing: '.04em', textTransform: 'uppercase' }}>{p.date}</div>
                <div>
                  <p className="eyebrow" style={{ marginBottom: 10 }}>{p.tag}</p>
                  <h2 className="display-s" style={{ marginBottom: 10, maxWidth: '40ch' }}>{p.title}</h2>
                  <p className="mb-0" style={{ maxWidth: '62ch' }}>{p.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section on-paper-2" style={{ padding: '140px 0' }}>
        <div className="wrap center">
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>Prefer A Direct Answer?</p>
          <h2 className="display-xl reveal" style={{ maxWidth: '18ch', margin: '0 auto 36px' }}>Talk to us about your own portfolio instead.</h2>
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
