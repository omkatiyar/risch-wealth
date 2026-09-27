import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { FIRM } from '../data/firm';

// Each entry becomes a numbered row (same pattern as the home page's
// "Risk first. Return follows." section) — a heading and a paragraph,
// nothing invented beyond what the rest of the site already states.
// The two FIRM-derived entries only appear once those fields are filled
// in (src/data/firm.js), same as the footer's registration line.
function buildSections() {
  const sections = [
    {
      title: 'Purpose of this disclosure',
      body: "This page sets out the basis on which RISCH Wealth's website, its risk assessment and any proposal generated from it should be read. It is provided for transparency, not as a substitute for a direct conversation about your circumstances.",
    },
    {
      title: 'About RISCH Wealth',
      body: `${FIRM.legalName} is an independent private wealth practice based in ${FIRM.city}, ${FIRM.region}, ${FIRM.country}, founded in ${FIRM.foundedYear}. Nothing on this site is an offer or solicitation to buy or sell any security in any jurisdiction where such an offer would be unlawful.`,
    },
    {
      title: 'Regulatory compliance',
      body: `${FIRM.legalName} ensures compliance with all applicable laws and guidelines issued by SEBI and other regulatory authorities, as amended from time to time.`,
    },
    {
      title: 'The risk assessment: methodology and scope',
      body: 'The eight-question assessment synthesises two principal dimensions: liquidity time horizon and drawdown tolerance, informed by behavioural loss aversion. Resulting scores map across a continuum from Conservative to Aggressive, and the output is a preliminary allocation, not a final recommendation.',
    },
    {
      title: 'Context this tool cannot capture',
      body: 'The assessment is a starting point, not a complete financial picture. Overall net worth, debt obligations, illiquid holdings, tax position and family or succession considerations are reviewed in conversation before any allocation is finalised.',
    },
    {
      title: 'Independence and conflicts of interest',
      body: 'RISCH Wealth holds no proprietary fund or product to sell. Where any institutional holding or third-party arrangement exists, it is managed under information barriers designed to prevent conflicts of interest from influencing a recommendation.',
    },
    {
      title: 'Portfolio deviation policy',
      body: 'Where a client or RISCH Wealth elects to deviate from a recommended portfolio, that deviation is bounded to one tier above or below the recommendation, with the basis for it documented and signed by both parties.',
    },
    {
      title: 'No advice, no endorsement',
      body: `${FIRM.legalName} does not endorse or promote any opportunity referenced on this site, and nothing here should be read as an offer, solicitation or invitation to participate in one. Any assets or securities referenced may be arranged, referred to or held by the firm. This site does not provide business, investment, tax or legal advice, and no investment decision should be made solely on the basis of information provided here.`,
    },
    {
      title: 'General risk warning',
      body: 'This site, and any proposal generated from it, is provided for informational purposes only and does not constitute investment advice. Investments in securities, mutual funds, portfolio services and alternative assets are subject to market risk, including possible loss of principal invested.',
    },
    {
      title: 'Mutual fund risk disclosure',
      body: 'Mutual fund investments are subject to market risks; read all scheme-related documents carefully. The NAVs of the schemes may go up or down depending on the factors and forces affecting the securities market, including fluctuations in interest rates. The past performance of mutual funds is not necessarily indicative of the future performance of the schemes. A mutual fund does not guarantee or assure any dividend under any of its schemes, which is subject to the availability and adequacy of distributable surplus. Investors should review the scheme documents carefully and obtain expert professional advice on the specific legal, tax and financial implications of an investment.',
    },
    {
      title: 'No guarantee of returns',
      body: 'Past performance is not an indicator or guarantee of future returns. Portfolio names shown in a proposal (RISCH Active Balanced, RISCH Active Growth, RISCH Active Aggressive, RISCH Active Aggressive Plus) are labels for an allocation mandate and do not themselves represent or guarantee any performance outcome.',
    },
    {
      title: 'Confidentiality of client information',
      body: "Information a client shares with RISCH Wealth — whether through this site, in conversation or in a portfolio review — is held in confidence and used solely to develop, execute and service that client's portfolio.",
    },
    {
      title: 'Trademarks',
      body: 'Any trademarks or symbols appearing on this site are included for informational purposes only and remain the property of their respective owners.',
    },
  ];

  if (FIRM.registrations.length > 0) {
    sections.push({
      title: 'Regulatory registration',
      body: (
        <>
          {FIRM.registrations.map((r) => (
            <p className="mb-0" key={r.id} style={{ marginBottom: 6 }}><strong>{r.label}:</strong> {r.id}</p>
          ))}
        </>
      ),
    });
  }

  if (FIRM.grievance) {
    sections.push({ title: 'Grievance redressal', body: FIRM.grievance });
  }

  sections.push({
    title: 'Questions about this disclosure',
    body: (
      <>
        Write to <a href={`mailto:${FIRM.email}`} style={{ color: 'var(--accent)', fontWeight: 600 }}>{FIRM.email}</a> or call <a href={FIRM.phoneHref} style={{ color: 'var(--accent)', fontWeight: 600 }}>{FIRM.phone}</a>.
      </>
    ),
  });

  return sections;
}

export default function Disclosure() {
  useScrollReveal();
  const sections = buildSections();

  return (
    <>
      <Nav />

      <header className="page-head" style={{ position: 'relative', overflow: 'hidden', paddingBottom: 60 }}>
        <div className="pattern-dots" style={{ top: 0, height: 380 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow kicker reveal in">Legal &amp; Regulatory</p>
          <h1 className="display-xxl reveal in" style={{ maxWidth: '16em' }}>Disclosures.</h1>
          <p className="lede reveal in" style={{ maxWidth: '58ch', marginTop: 24 }}>The information below governs how this site, the risk assessment and any proposal it generates should be read. If anything here is unclear, a conversation with RISCH resolves it faster than the fine print.</p>
        </div>
      </header>

      <section className="section-tight">
        <div className="wrap" style={{ maxWidth: 880 }}>
          {sections.map((s, i) => (
            <div className="numbered-row reveal" key={s.title}>
              <div className="num">{String(i + 1).padStart(2, '0')}</div>
              <div className="grid g-2" style={{ gridTemplateColumns: '1fr 1.6fr', alignItems: 'baseline' }}>
                <h2 className="display-s">{s.title}</h2>
                <div className="mb-0" style={{ maxWidth: '62ch' }}>
                  {typeof s.body === 'string' ? <p className="mb-0">{s.body}</p> : s.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer extendedLegal showSocials={false} />
    </>
  );
}
