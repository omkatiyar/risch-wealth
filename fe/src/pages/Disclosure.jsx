import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Disclosure() {
  useScrollReveal();

  return (
    <>
      <Nav />

      <header className="page-head" style={{ position: 'relative', overflow: 'hidden', paddingBottom: 60 }}>
        <div className="pattern-dots" style={{ top: 0, height: 380 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow kicker reveal in">Important Information</p>
          <h1 className="display-xxl reveal in" style={{ maxWidth: '16em' }}>Disclosure.</h1>
        </div>
      </header>

      <section className="section-tight">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="reveal">
            <h2 className="display-m" style={{ marginBottom: 16 }}>Diagnostic framework &amp; scoring</h2>
            <p style={{ maxWidth: '70ch' }}>This questionnaire synthesizes three principal dimensions: liquidity time horizon, expected return vs. drawdown tolerance, and behavioural loss aversion. Resulting scores map across a continuum from Conservative to Aggressive.</p>
          </div>

          <hr className="hairline hr-tight" />

          <div className="reveal">
            <h2 className="display-m" style={{ marginBottom: 16 }}>Holistic context</h2>
            <p style={{ maxWidth: '70ch' }}>This questionnaire is a foundational tool. Overall net worth, debt obligations, non-liquid holdings, tax considerations and bespoke liquidity milestones should be reviewed before any allocation is finalised.</p>
          </div>

          <hr className="hairline hr-tight" />

          <div className="reveal">
            <h2 className="display-m" style={{ marginBottom: 16 }}>General disclaimer</h2>
            <p style={{ maxWidth: '70ch' }}>This site, and any proposal generated from it, is for informational purposes only and does not constitute investment advice. Investments in securities, mutual funds, portfolio services and alternative assets are subject to market risk, including possible loss of principal invested.</p>
          </div>

          <hr className="hairline hr-tight" />

          <div className="reveal">
            <h2 className="display-m" style={{ marginBottom: 16 }}>No guarantee of returns</h2>
            <p style={{ maxWidth: '70ch' }}>Past performance is not an indicator or guarantee of future returns. Portfolio names (RISCH Active Balanced, RISCH Active Growth, RISCH Active Aggressive, RISCH Active Aggressive Plus) do not represent or guarantee performance results.</p>
          </div>

          <hr className="hairline hr-tight" />

          <div className="reveal">
            <h2 className="display-m" style={{ marginBottom: 16 }}>Conflict of interest</h2>
            <p style={{ maxWidth: '70ch' }}>RISCH Wealth holds no proprietary product to sell. Any institutional holdings or third-party arrangements are managed under information barriers to prevent conflicts of interest.</p>
          </div>

          <hr className="hairline hr-tight" />

          <div className="reveal">
            <h2 className="display-m" style={{ marginBottom: 16 }}>Deviation policy</h2>
            <p style={{ maxWidth: '70ch' }}>If the client or RISCH Wealth elects to override a recommended portfolio, deviation is restricted to a maximum tolerance of one tier above or below, with the basis for deviation documented and signed by both parties.</p>
          </div>
        </div>
      </section>

      <Footer extendedLegal contactEmail="contact@rischwealth.com" showPhone={false} showSocials={false} />
    </>
  );
}
