import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import TestimonialSlider from '../components/TestimonialSlider/TestimonialSlider';
import founderOffice from '../assets/founder-office.jpg';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { FAQS } from '../seo';
import { FIRM } from '../data/firm';
import { SEGMENTS } from '../data/segments';
import { PRINCIPLES } from '../data/principles';
import HeroTrendLine from '../components/HeroTrendLine';

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
    { n: 'Zero', l: 'Proprietary products, recommendations align to you, not a shelf' },
    { n: 'MF · PMS · AIF', l: 'Mutual funds, portfolio management services and alternative investment funds', compact: true },
  );
  return items.slice(0, 4);
}

// The RISCH Framework: the firm's signature method, shown as a four-stage
// diagram. The risk profiler supports stage 01; it isn't the product.
const FRAMEWORK = [
  { t: 'Understand Risk', d: 'We separate your willingness to take risk from your ability to withstand it. Both are measured; the lower one sets the limit.' },
  { t: 'Define the Objective', d: 'What this capital needs to do: liquidity, income, growth, preservation or legacy, often several at once.' },
  { t: 'Build the Allocation', d: 'A portfolio in which every holding has a role.', chips: ['Indian equity', 'Global equity', 'Fixed income', 'Commodities', 'Real estate'] },
  { t: 'Review & Rebalance', d: 'Your portfolio evolves as markets and your circumstances change, with a review at every rebalancing.' },
];

// Four quick facts under the CEO's note. "Client-first" replaces the
// mockup's "Independent" (a sensitive word for a registered distributor).
const CEO_FACTS = [
  { t: `${new Date().getFullYear() - FIRM.careerStartYear} Years`, d: 'In wealth management',
    icon: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19c0-3 2.5-5.3 5.5-5.3s5.5 2.3 5.5 5.3" /><circle cx="17" cy="8.5" r="2.4" /><path d="M15.5 13.9c2.5.3 4.5 2.3 4.5 5.1" /></> },
  { t: 'Client-First', d: 'No product shelf',
    icon: <><path d="M4 20V14M9 20V9M14 20V12M19 20V5" /><path d="M2 20h20" /></> },
  { t: 'India + Global', d: 'Investment opportunities',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></> },
  { t: 'Built for Generations', d: 'Long-term perspective',
    icon: <><path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z" /></> },
];

const DISCIPLINES = [
  { t: 'Portfolio Construction', d: 'A portfolio built around your objectives, liquidity needs and risk, sized to you, not a model.' },
  { t: 'Fund & Strategy Selection', d: 'Mutual funds, PMS and AIFs from across the market, each chosen for the role it plays in your portfolio.' },
  { t: 'Global Diversification', d: 'Access to opportunities beyond Indian markets (US, Europe, Asia and Taiwan) as part of one plan.' },
  { t: 'Wealth Coordination', d: 'Investments, liquidity, succession and your other advisers, brought into one view with one point of contact.' },
];

const WHY = [
  { t: 'No product shelf', d: 'No proprietary fund and no product shelf. Recommendations align to the client, never to what needs selling.' },
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

      <header className="hero" style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="pattern-dots" style={{ top: 0, height: 600 }}></div>
        <div className="wrap hero-grid" style={{ position: 'relative' }}>
          <div className="hero-copy">
            {/* Answers, in order: who we are, what we do, for whom, why trust us,
                and what to do next. */}
            <p className="eyebrow reveal in">RISCH Private Wealth · Since {FIRM.foundedYear}</p>
            <h1 className="display-xxl reveal in">Capital deserves<br /><span className="italic">a considered</span> hand.</h1>
            {/* From the client brochure. The founder wants this line kept in the hero. */}
            <p className="hero-tagline reveal in" style={{ transitionDelay: '.05s' }}>We manage portfolios.</p>
            <div className="hero-body">
              {/* brand → proposition → credibility → action */}
              <div className="reveal in" style={{ transitionDelay: '.1s' }}>
                <p className="lede hero-lede">Private wealth management for entrepreneurs, business owners, professionals and families, built around your goals, your risk and your long-term wealth, across Indian and global markets.</p>
                {FIRM.minimumInvestable && (
                  <p className="hero-note">For investors with {FIRM.minimumInvestable}+ in investable assets.</p>
                )}
              </div>
              <ul className="hero-points reveal in" style={{ transitionDelay: '.15s' }}>
                <li>{new Date().getFullYear() - FIRM.careerStartYear} years of private-banking experience</li>
                <li>Open-architecture portfolios, no in-house products</li>
                <li>Indian &amp; global allocation</li>
              </ul>
              <div className="hero-ctas reveal in" style={{ transitionDelay: '.2s' }}>
                <Link to="/contact" className="btn btn-primary">Start Your Wealth Review <Arrow /></Link>
                <Link to="/about" className="btn">Meet the Founder</Link>
              </div>
              <p className="hero-reg reveal in" style={{ transitionDelay: '.3s' }}>
                <span className="reg-item">AMFI-registered Mutual Fund Distributor <strong>{FIRM.registrations[0].id}</strong></span>
                <span className="reg-item">APMI-registered PMS Distributor <strong>{FIRM.registrations[1].id}</strong></span>
              </p>
            </div>
          </div>
          <div className="hero-visual">
            <HeroTrendLine />
          </div>
        </div>
      </header>

      <section className="principles-feature reveal">
        <div className="wrap">
          <div className="principles-feature-head">
            <div>
              <p className="eyebrow">Our Mission: Investor Success</p>
              <h2 className="display-l" style={{ maxWidth: '24ch' }}>Investors trust us because we put them first.</h2>
            </div>
            <p className="lede" style={{ maxWidth: '46ch' }}>Seven investment principles guide every portfolio we manage, the same ones we set out for every new client, before a single rupee is committed.</p>
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
                <div className={'trust-n' + (item.compact ? ' trust-n-compact' : '')}>{item.n}</div>
                <div className="trust-l">{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section framework-section" id="framework">
        <div className="wrap">
          <div className="grid g-2" style={{ gridTemplateColumns: '0.9fr 1.1fr', alignItems: 'end' }}>
            <div className="reveal">
              <p className="eyebrow">The RISCH Framework</p>
              <h2 className="display-l">Understand first.<br />Allocate second.<br /><span className="italic">Compound over time.</span></h2>
            </div>
            <div className="reveal">
              <p className="lede" style={{ maxWidth: '46ch' }}>Wealth management is a long relationship, not a single transaction. Every portfolio we manage follows the same four stages, for as long as you are a client.</p>
            </div>
          </div>

          <ol className="framework reveal-stagger">
            {FRAMEWORK.map((step, i) => (
              <li key={step.t}>
                <span className="fw-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="fw-t">{step.t}</h3>
                <p className="fw-d">{step.d}</p>
                {step.chips && (
                  <ul className="fw-chips">{step.chips.map((c) => <li key={c}>{c}</li>)}</ul>
                )}
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
              <p style={{ maxWidth: '42ch' }}>RISCH works with a small number of clients directly, typically where wealth is spread across businesses, custodians, generations or countries.</p>
              <Link to="/who-we-serve" className="text-link">More on who we work with <Arrow /></Link>
            </div>
            <div className="line-list reveal">
              {HOME_SEGMENTS.map((s) => (
                <div key={s.title} className="line-item">
                  <h3 className="display-s">{s.title}</h3>
                  <p className="mb-0">{s.body}</p>
                </div>
              ))}
              <p className="body-s" style={{ marginTop: 20 }}>We also work alongside existing family offices, as a second opinion and execution partner.</p>
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

      <section className="ceo-desk">
        <span className="ceo-watermark" aria-hidden="true">R</span>
        <div className="wrap">
          <div className="ceo-grid reveal">
            <figure className="ceo-figure">
              <img src={founderOffice} alt="Rishiraj Maheshwari, Founder & CEO of RISCH Wealth" className="ceo-photo" width="538" height="632" loading="lazy" />
              <figcaption>
                <span className="ceo-cap-name">Rishiraj Maheshwari</span>
                <span className="ceo-cap-role">Founder &amp; CEO, RISCH Wealth</span>
              </figcaption>
            </figure>
            <div>
              <p className="eyebrow">From the CEO&rsquo;s Desk</p>
              <blockquote className="ceo-quote">
                <p>The objective is not to beat the market every quarter. The objective is to help families preserve and compound wealth across generations.</p>
              </blockquote>
              <h2 className="ceo-name">Rishiraj Maheshwari</h2>
              <p className="ceo-role">Founder &amp; CEO, {FIRM.legalName}</p>
              <p className="ceo-body">At RISCH, we believe wealth is not a destination, but a responsibility. Our role is to be the steward of your capital, aligned with your values, and committed to your legacy.</p>
              <ul className="ceo-facts">
                {CEO_FACTS.map((f) => (
                  <li key={f.t}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{f.icon}</svg>
                    <strong>{f.t}</strong>
                    <span>{f.d}</span>
                  </li>
                ))}
              </ul>
              <ol className="ceo-career">
                <li><span className="cc-year">2010 – 2014</span><span className="cc-role">Senior Private Banker<small>ICICI Securities</small></span></li>
                <li><span className="cc-year">2018 – 2019</span><span className="cc-role">Edelweiss Financial Services<small>Mumbai</small></span></li>
                <li><span className="cc-year">2014 – Present</span><span className="cc-role">Founder &amp; CEO<small>RISCH Wealth</small></span></li>
              </ol>
              <Link to="/about" className="btn ceo-btn">Read the founder&rsquo;s story <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow reveal" style={{ justifyContent: 'center' }}>The Client Experience</p>
          <h2 className="display-l reveal center" style={{ margin: '0 auto 56px' }}>In our clients&rsquo; words.</h2>
          <TestimonialSlider />
        </div>
      </section>

      <section className="section-tight on-tint">
        <div className="wrap">
          <div className="assess reveal">
            <div>
              <p className="eyebrow">Risk Assessment</p>
              <h2 className="display-m" style={{ marginBottom: 12 }}>Before we talk, see where you stand.</h2>
              <p className="mb-0" style={{ maxWidth: '60ch' }}>Eight questions on your time horizon and risk preference produce a preliminary allocation with hypothetical outcomes. It's a starting point for a conversation, not a recommendation.</p>
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
          <p className="lede reveal" style={{ maxWidth: '52ch', margin: '0 auto 36px' }}>Whether your wealth sits across several advisers or you're starting afresh, the first step is a conversation about what it needs to do, and what it can withstand.</p>
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
