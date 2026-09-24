import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';

const SEGMENTS = [
  {
    icon: <path d="M3 21V9l9-6 9 6v12M9 21v-6h6v6" />,
    title: 'Business Owners',
    body: 'Wealth concentrated in a single enterprise, and a need to diversify it outside the business without losing sight of succession.',
  },
  {
    icon: <><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" /></>,
    title: 'Entrepreneurs & Founders',
    body: 'Liquidity events, ESOPs and irregular income — portfolios built around a career that doesn\'t look like a salaried one.',
  },
  {
    icon: <><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" /><circle cx="17" cy="8.5" r="2.6" /><path d="M15 14.2c2.7.4 4.7 2.5 4.7 5.8" /></>,
    title: 'Private Clients & Families',
    body: 'Multi-generational wealth, consolidated reporting, and succession structured so it survives a handover.',
  },
  {
    icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    title: 'NRIs & Global Indians',
    body: 'Cross-border holdings and a home-market allocation that still needs a single point of accountability.',
  },
  {
    icon: <><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" /></>,
    title: 'Senior Executives & Professionals',
    body: 'A demanding career leaves little time to manage money directly — a documented process stands in for that time.',
  },
  {
    icon: <><rect x="3" y="3" width="7" height="7" rx="1.2" /><rect x="14" y="3" width="7" height="7" rx="1.2" /><rect x="3" y="14" width="7" height="7" rx="1.2" /><rect x="14" y="14" width="7" height="7" rx="1.2" /></>,
    title: 'Family Offices',
    body: 'An independent second opinion and execution partner alongside an existing family office or advisory setup.',
  },
];

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
