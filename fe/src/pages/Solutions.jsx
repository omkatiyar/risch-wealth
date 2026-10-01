import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PRINCIPLES } from '../data/principles';
import officePhoto from '../assets/contact-office.webp';
import officePhoto2x from '../assets/contact-office-2x.webp';

// What We Provide (Figma, Oct 2026): hero, the four disciplines, the
// principles, the allocation universe, how it comes together, and a
// closing call to action. The risk assessment supports Portfolio
// Construction; it isn't a service of its own.

const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
);

// Each row's arrow opens the contact form with that topic chosen.
const DISCIPLINES = [
  { t: 'Portfolio Construction', d: 'A portfolio built around your objectives, liquidity needs, time horizon and ability to withstand losses — sized to you, not a model.',
    icon: <><rect x="3" y="3" width="7" height="7" rx="1.2" /><rect x="14" y="3" width="7" height="7" rx="1.2" /><rect x="3" y="14" width="7" height="7" rx="1.2" /><rect x="14" y="14" width="7" height="7" rx="1.2" /></> },
  { t: 'Fund & Strategy Selection', d: 'Mutual funds, PMS and AIFs from across the market, each chosen for the role it plays in your portfolio. Our research and risk assessment drive the selection.',
    icon: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5L21 21M7.5 10.5h6M7.5 13h4" /></> },
  { t: 'Global Diversification', d: 'Access to opportunities beyond Indian markets — the US, Europe, Asia and Taiwan — held as part of one plan rather than as a separate bet.',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></> },
  { t: 'Wealth Coordination', d: 'Investments, liquidity, succession and your legal and tax advisers brought into one view, with one point of contact and regular reviews.',
    icon: <><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" /><circle cx="17" cy="8.5" r="2.6" /><path d="M15 14.2c2.7.4 4.7 2.5 4.7 5.8" /></> },
];

// The five building blocks. The ring is deliberately equal-sized: there is
// no model portfolio, so it shows what can go in, not how much.
const ASSET_CLASSES = [
  { t: 'Domestic Equity', d: 'Large, mid & small cap, thematic', c: '#B24A07' },
  { t: 'International Equity', d: 'US, Europe, Asia ex-Japan & Taiwan', c: '#E8772E' },
  { t: 'Fixed Income', d: 'Short, medium & long duration', c: '#F2B48A' },
  { t: 'Commodities', d: 'Gold & silver', c: '#A08C7A' },
  { t: 'Real Estate', d: 'REITs & InvITs', c: '#5E3B26' },
];

const STEPS = [
  { t: 'Understand', d: 'We start with a detailed conversation about your goals, time horizon, liquidity needs and risk profile.',
    icon: <path d="M4 5h16v11H8l-4 4z" /> },
  { t: 'Construct', d: 'We design a portfolio using the four disciplines — aligned to your objectives and backed by research.',
    icon: <><path d="M12 3a9 9 0 1 0 9 9h-9z" /><path d="M15 3.5A9 9 0 0 1 20.5 9H15z" /></> },
  { t: 'Review', d: 'We track progress, adapt to changes in your life and rebalance to keep the portfolio aligned over time.',
    icon: <><path d="M4 20V14M9 20V9M14 20V12M19 20V5" /><path d="M2 20h20" /></> },
];

function AllocationRing() {
  const r = 82;
  const sw = 34;
  const c = 2 * Math.PI * r;
  const seg = c / ASSET_CLASSES.length;
  return (
    <div className="sv-ring" role="img" aria-label="Your portfolio can combine domestic equity, international equity, fixed income, commodities and real estate">
      <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        {ASSET_CLASSES.map((a, i) => (
          <circle
            key={a.t} cx="100" cy="100" r={r} fill="none" stroke={a.c} strokeWidth={sw}
            strokeDasharray={`${seg - 3} ${c}`} strokeDashoffset={-(seg * i)}
            transform="rotate(-90 100 100)"
          />
        ))}
      </svg>
      <span>Your<br />portfolio</span>
    </div>
  );
}

export default function Solutions() {
  useScrollReveal();

  return (
    <>
      <Nav />

      <header className="sv-hero">
        <div className="sv-hero-photo" aria-hidden="true">
          <img src={officePhoto} srcSet={`${officePhoto} 1x, ${officePhoto2x} 2x`} alt="" width="258" height="772" />
        </div>
        <div className="wrap sv-hero-copy">
          <p className="eyebrow reveal in">What We Provide</p>
          <h1 className="sv-h1 reveal in">Four disciplines.<br /><span>One</span> portfolio.</h1>
          <p className="lede reveal in">We bring portfolio construction, strategy selection, global diversification and wealth coordination into one disciplined plan — designed around your objectives, not a model.</p>
        </div>
      </header>

      <section className="sv-disc" aria-label="The four disciplines">
        <div className="wrap">
          <ol className="sv-disc-list">
            {DISCIPLINES.map((x, i) => (
              <li key={x.t} className="reveal">
                <Link to={`/contact?topic=${encodeURIComponent(x.t)}`} className="sv-disc-row">
                  <span className="sv-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sv-icon"><Svg>{x.icon}</Svg></span>
                  <h2 className="sv-disc-title">{x.t}</h2>
                  <p className="sv-disc-text">{x.d}</p>
                  <span className="sv-disc-arrow"><Arrow /><span className="sr-only"> Discuss this with RISCH</span></span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sv-principles">
        <div className="wrap">
          <div className="sv-head reveal">
            <p className="eyebrow">Investment Philosophy</p>
            <h2 className="sv-h2">Principles before products.</h2>
            <p className="sv-sub">The same principles we set out for every client, before a single rupee is committed.</p>
          </div>
          <div className="sv-cards reveal-stagger">
            {/* the brochure's seven principles, word for word (src/data/principles.jsx) */}
            {PRINCIPLES.map((p) => (
              <div className="sv-card" key={p.title}>
                <span className="sv-icon sv-icon-sm"><Svg>{p.icon}</Svg></span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sv-alloc">
        <div className="wrap sv-alloc-grid">
          <div className="reveal">
            <p className="eyebrow">Allocation Universe</p>
            <h2 className="sv-h2">What we allocate across.</h2>
            <p className="sv-statement">There is no model portfolio.</p>
            <p className="sv-sub">How much sits in each layer depends on your objectives, liquidity needs, time horizon and capacity for risk — so the proportions are set with you, not in advance.</p>
          </div>
          <AllocationRing />
          <ul className="sv-classes reveal">
            {ASSET_CLASSES.map((a) => (
              <li key={a.t}>
                <span className="sv-dot" style={{ background: a.c }} aria-hidden="true" />
                <span><strong>{a.t}</strong>{a.d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sv-process">
        <div className="wrap">
          <div className="sv-head reveal">
            <p className="eyebrow">How It Comes Together</p>
            <h2 className="sv-h2">From conversation to a coherent portfolio.</h2>
            <p className="sv-sub">An integrated process that brings everything together.</p>
          </div>
          <ol className="sv-steps reveal-stagger">
            {STEPS.map((s, i) => (
              <li key={s.t}>
                <span className="sv-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <span className="sv-icon sv-icon-sm"><Svg>{s.icon}</Svg></span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
                {i < STEPS.length - 1 && <span className="sv-step-arrow" aria-hidden="true"><Arrow /></span>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sv-cta">
        <svg className="sv-cta-arcs" viewBox="0 0 600 400" aria-hidden="true" focusable="false">
          <circle cx="620" cy="420" r="300" /><circle cx="620" cy="420" r="380" /><circle cx="560" cy="460" r="250" />
        </svg>
        <div className="wrap reveal">
          <p className="eyebrow">Start A Conversation</p>
          <h2 className="sv-h2">A portfolio built around your life.</h2>
          <p className="sv-sub">Take the first step towards a more thoughtful, disciplined and personalised investment journey.</p>
          <div className="sv-cta-actions">
            <Link to="/risk-profiler" className="btn btn-primary">Start Risk Profile <Arrow /></Link>
            <Link to="/contact" className="btn">Get In Touch</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
