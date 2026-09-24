import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { TESTIMONIALS } from '../data/testimonials';

export default function Testimonials() {
  useScrollReveal();

  return (
    <>
      <Nav />

      <header className="page-head" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots" style={{ top: 0, height: 420 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow kicker reveal in">What Clients Say</p>
          <h1 className="display-xxl reveal in" style={{ maxWidth: '16em' }}>Client <span className="italic">experiences.</span></h1>
        </div>
      </header>

      <section className="section-tight">
        <div className="wrap">
          <div className="grid g-2 reveal-stagger">
            {TESTIMONIALS.map((t) => (
              <div className="card" key={t.name}>
                <p className="testimonial-quote" style={{ fontSize: 'clamp(17px,1.6vw,20px)', textAlign: 'left', marginBottom: 22 }}>{t.quote}</p>
                <div className="flex gap-12 items-center">
                  <div className="testimonial-avatar" style={{ margin: 0 }}>{t.initial}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section on-dark" style={{ padding: '140px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots"></div>
        <div className="wrap center" style={{ position: 'relative' }}>
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>Start A Conversation</p>
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
