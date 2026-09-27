import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import TestimonialSlider from '../components/TestimonialSlider/TestimonialSlider';
import ceoPhoto from '../assets/ceo-photo.jpg';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { FAQS } from '../seo';
import { FIRM } from '../data/firm';
import { SEGMENTS } from '../data/segments';
import { PRINCIPLES } from '../data/principles';

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" strokeWidth="1.3" /></svg>
);

// Trust bar: verified facts only. Client count / assets appear first once
// they're filled in (and cleared) in src/data/firm.js.
function trustItems() {
  const items = [];
  if (FIRM.clientCount) items.push({ n: FIRM.clientCount, l: 'Client families' });
  if (FIRM.assets) items.push({ n: FIRM.assets.value, l: FIRM.assets.label });
  items.push(
    { n: `${new Date().getFullYear() - FIRM.careerStartYear} years`, l: "Founder's career in private banking and wealth management" },
    { n: String(FIRM.foundedYear), l: 'Year RISCH Wealth was founded' },
    { n: 'Zero', l: 'Proprietary products — recommendations align to you, not a shelf' },
    { n: '8-point', l: 'Risk diagnostic, completed before any proposal' },
  );
  return items.slice(0, 4);
}

const PROCESS = [
  { t: 'Conversation', d: 'Your objectives, liquidity needs and time horizon — and what your wealth can actually withstand.' },
  { t: 'Diagnosis', d: 'Existing holdings across banks, brokers and advisers, reviewed as one balance sheet.' },
  { t: 'Proposal', d: 'An allocation matched to your risk profile, with best, expected and worst case shown before a rupee moves.' },
  { t: 'Implementation', d: 'Executed as agreed. Any deviation is recorded, justified and signed by both parties.' },
  { t: 'Review', d: 'Your portfolio is reviewed against your objectives at every rebalancing.' },
];

const DISCIPLINES = [
  { t: 'Private Wealth Solutions', d: 'Portfolios built on a documented suitability process, not a house view.' },
  { t: 'Wealth Coordination', d: 'Consolidated reporting, succession and governance, with one point of contact for your legal and tax advisers.' },
  { t: 'Portfolio Construction', d: 'Granular allocation across domestic and international equity, fixed income and liquidity — sized to you, not a model.' },
  { t: 'Risk Profiling', d: 'Time horizon and risk preference scored independently, then matched to a portfolio.' },
];

const WHY = [
  { t: 'Independent of product', d: 'No proprietary fund and no product shelf. Recommendations align to the client, never to what needs selling.' },
  { t: 'A focused practice', d: 'RISCH works with a small number of clients directly, so every portfolio gets genuine attention.' },
  { t: 'Accountable by design', d: 'The worst case is disclosed before you commit, and any override is documented and signed by both parties.' },
  { t: 'One view of your wealth', d: 'Holdings spread across custodians, brought together into one coherent strategy and one set of reports.' },
];

// Four primary client profiles; family offices get a line of their own.
const HOME_SEGMENTS = ['Private Clients & Families', 'Business Owners', 'Senior Executives & Professionals', 'NRIs & Global Indians']
  .map((title) => SEGMENTS.find((s) => s.title === title))
  .filter(Boolean);

export default function Home() {
  useScrollReveal();

  return (
    <>
      <Nav />

      <header className="arc-wrap hero" style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="pattern-dots" style={{ top: 0, height: 600 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow reveal in">Private Wealth · {FIRM.city}</p>
          <h1 className="display-xxl reveal in" style={{ maxWidth: '13em' }}>Capital deserves<br /><span className="italic">a considered</span> hand.</h1>
          <div className="hero-body">
            <div className="reveal in" style={{ transitionDelay: '.1s' }}>
              <p className="lede" style={{ maxWidth: '52ch' }}>An independent private wealth practice for families and individuals with significant wealth, led by a career private banker. Risk understood first — then a portfolio built around it.</p>
              {FIRM.minimumInvestable && (
                <p className="hero-note">For investors with {FIRM.minimumInvestable}+ in investable assets.</p>
              )}
            </div>
            <div className="hero-ctas reveal in" style={{ transitionDelay: '.2s' }}>
              <Link to="/contact" className="btn btn-primary">Start a conversation <Arrow /></Link>
              <Link to="/risk-profiler" className="btn">Take the risk assessment</Link>
            </div>
          </div>
        </div>

        <div className="wrap" style={{ marginTop: 56, position: 'relative' }}>
          <svg className="arc-svg" viewBox="0 0 1200 220" width="100%" preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
            <defs>
              <linearGradient id="arcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C85A16" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#C85A16" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="arc-fill" d="M0,190 C150,187 220,110 340,102 C460,95 520,161 640,150 C760,139 820,44 960,37 C1060,31 1140,66 1200,51 L1200,220 L0,220 Z" />
            <path className="arc-line" d="M0,190 C150,187 220,110 340,102 C460,95 520,161 640,150 C760,139 820,44 960,37 C1060,31 1140,66 1200,51" />
            <circle className="arc-dot" cx="1200" cy="51" r="4.5" fill="#C85A16" />
          </svg>
        </div>
      </header>

      <section className="principles-feature reveal">
        <div className="wrap">
          <div className="principles-feature-head">
            <div>
              <p className="eyebrow">Our Investment Principles</p>
              <h2 className="display-l" style={{ maxWidth: '18ch' }}>What we believe, before we invest a rupee.</h2>
            </div>
            <p className="lede" style={{ maxWidth: '46ch' }}>The same principles we set out for every new client — the foundation of every portfolio RISCH builds.</p>
          </div>
          <div className="principles-list">
            {PRINCIPLES.map((p, i) => (
              <div className="principle-row" key={p.title}>
                <div className="principle-row-top">
                  <span className="principle-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="icon-badge icon-badge-lg">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{p.icon}</svg>
                  </div>
                </div>
                <h3 className="display-m">{p.title}</h3>
                <p className="mb-0">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-bar" aria-label="RISCH at a glance">
        <div className="wrap">
          <div className="trust-grid reveal-stagger">
            {trustItems().map((item) => (
              <div key={item.l} className="trust-item">
                <div className="trust-n">{item.n}</div>
                <div className="trust-l">{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid g-2" style={{ gridTemplateColumns: '0.9fr 1.1fr' }}>
            <div className="reveal">
              <p className="eyebrow">Our Philosophy</p>
              <h2 className="display-l">Risk first.<br />Return follows.</h2>
            </div>
            <div className="reveal">
              <p className="lede" style={{ maxWidth: '50ch' }}>Most portfolios start with a return target. Ours start with what you can actually withstand.</p>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            {[
              ['Capacity, measured', "What you're able to withstand, not just what you feel able to."],
              ['Portfolio, matched', 'Time horizon and risk preference decide the portfolio — never the other way round.'],
              ['Outcome, disclosed', 'Best case, expected case, worst case — shown before a rupee moves.'],
            ].map(([t, d], i) => (
              <div className="numbered-row reveal" key={t}>
                <div className="num">0{i + 1}</div>
                <div className="grid g-2" style={{ gridTemplateColumns: '1fr 1.6fr', alignItems: 'baseline' }}>
                  <h3 className="display-s">{t}</h3>
                  <p className="mb-0">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section on-tint">
        <div className="wrap">
          <div className="reveal" style={{ maxWidth: 720, marginBottom: 56 }}>
            <p className="eyebrow">How We Work With You</p>
            <h2 className="display-l">A documented process, from first conversation to every review.</h2>
          </div>
          <ol className="process reveal-stagger">
            {PROCESS.map((step, i) => (
              <li key={step.t}>
                <span className="process-n">0{i + 1}</span>
                <h3 className="display-s">{step.t}</h3>
                <p className="body-s mb-0">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid g-2" style={{ gridTemplateColumns: '0.9fr 1.1fr', alignItems: 'start' }}>
            <div className="reveal">
              <p className="eyebrow">Who We Serve</p>
              <h2 className="display-l" style={{ marginBottom: 20 }}>For wealth that has outgrown simple answers.</h2>
              <p style={{ maxWidth: '42ch' }}>RISCH works with a small number of clients directly — typically where wealth is spread across businesses, custodians, generations or countries.</p>
              <Link to="/who-we-serve" className="text-link">More on who we work with <Arrow /></Link>
            </div>
            <div className="line-list reveal">
              {HOME_SEGMENTS.map((s) => (
                <div key={s.title} className="line-item">
                  <h3 className="display-s">{s.title}</h3>
                  <p className="mb-0">{s.body}</p>
                </div>
              ))}
              <p className="body-s" style={{ marginTop: 20 }}>We also work alongside existing family offices, as an independent second opinion and execution partner.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section on-tint">
        <div className="wrap">
          <div className="flex justify-between items-center reveal" style={{ flexWrap: 'wrap', gap: 24, marginBottom: 48 }}>
            <div>
              <p className="eyebrow">What We Do</p>
              <h2 className="display-l" style={{ maxWidth: '22ch', marginBottom: 0 }}>Built around the whole balance sheet.</h2>
            </div>
            <Link to="/solutions" className="btn">View all solutions <Arrow /></Link>
          </div>
          <div className="disc-grid reveal-stagger">
            {DISCIPLINES.map((d, i) => (
              <div key={d.t} className="disc-item">
                <span className="process-n">0{i + 1}</span>
                <h3 className="display-s">{d.t}</h3>
                <p className="mb-0">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="reveal" style={{ maxWidth: 720, marginBottom: 48 }}>
            <p className="eyebrow">Why RISCH</p>
            <h2 className="display-l">Structured to put the client's interest first.</h2>
          </div>
          <div className="why-grid reveal-stagger">
            {WHY.map((w) => (
              <div key={w.t} className="why-item">
                <h3 className="display-s">{w.t}</h3>
                <p className="mb-0">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section on-tint">
        <div className="wrap">
          <div className="founder reveal">
            <img src={ceoPhoto} alt="Rishiraj Maheshwari, Founder & CEO of RISCH Wealth" className="founder-photo" width="520" height="520" />
            <div>
              <p className="eyebrow">Leadership</p>
              <h2 className="display-l" style={{ marginBottom: 8 }}>Rishiraj Maheshwari</h2>
              <p className="founder-role">Founder &amp; CEO</p>
              <p className="lede" style={{ maxWidth: '52ch' }}>A career private banker who built RISCH around one conviction: risk has to be understood, in a documented and repeatable way, before a single recommendation is made.</p>
              <ul className="career">
                <li><span>2010 – 2014</span>Senior Private Banker, ICICI Securities</li>
                <li><span>2018 – 2019</span>Vice President, Family Office Group, Edelweiss Financial Services</li>
                <li><span>2014 – Present</span>Founder &amp; CEO, RISCH Wealth</li>
              </ul>
              <Link to="/about" className="text-link">Read the founder's story <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>Client Experiences</p>
          <h2 className="display-l reveal center" style={{ margin: '0 auto 56px' }}>In their words.</h2>
          <TestimonialSlider />
        </div>
      </section>

      <section className="section-tight on-tint">
        <div className="wrap">
          <div className="assess reveal">
            <div>
              <p className="eyebrow">Risk Assessment</p>
              <h2 className="display-m" style={{ marginBottom: 12 }}>Before we talk, see where you stand.</h2>
              <p className="mb-0" style={{ maxWidth: '60ch' }}>Eight questions on your time horizon and risk preference produce a preliminary allocation with hypothetical outcomes. It's a starting point for a conversation — not a recommendation.</p>
            </div>
            <Link to="/risk-profiler" className="btn">Take the risk assessment <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap">
          <div className="grid g-2" style={{ gridTemplateColumns: '0.9fr 1.1fr' }}>
            <div className="reveal">
              <p className="eyebrow">Questions</p>
              <h2 className="display-l">Frequently asked questions.</h2>
              <p className="lede" style={{ maxWidth: '36ch', marginTop: 20 }}>How RISCH works, who we work with, and what the risk assessment tells you.</p>
            </div>
            <div className="faq-list reveal">
              {FAQS.map(({ q, a }, idx) => (
                <details className="faq-item" key={q} open={idx === 0}>
                  <summary>
                    <h3 className="display-s">{q}</h3>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="wrap center">
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>Start A Conversation</p>
          <h2 className="display-l reveal" style={{ maxWidth: '22ch', margin: '0 auto 24px' }}>Your portfolio deserves a considered second opinion.</h2>
          <p className="lede reveal" style={{ maxWidth: '52ch', margin: '0 auto 36px' }}>Whether your wealth sits across several advisers or you're starting afresh, the first step is a conversation about what it needs to do — and what it can withstand.</p>
          <div className="flex gap-16 reveal" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">Start a conversation <Arrow /></Link>
            <a href={FIRM.phoneHref} className="btn">Call {FIRM.phone}</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
