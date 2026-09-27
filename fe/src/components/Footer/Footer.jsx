import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FIRM } from '../../data/firm';

// `extendedLegal` adds the market-risk sentence (Disclosure page and the
// profiler report). Registration details come from FIRM.registrations and
// appear on every page once filled in.
export default function Footer({ showSocials = true, extendedLegal = false }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="f-top">
          <div>
            <div className="f-logo"><img src={logo} alt="RISCH Wealth" /></div>
            <p className="f-tagline">Capital deserves a considered hand.</p>
            <p className="f-meta">{FIRM.legalName}</p>
            <p className="f-meta">{FIRM.address.street}, {FIRM.address.locality}, {FIRM.city}, {FIRM.region} {FIRM.address.postalCode}</p>
            {showSocials && (
              <div className="f-social">
                <a href="https://www.linkedin.com/in/rishiraj-maheshwari-81240b5/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.53-1 1.83-2.1 3.77-2.1 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" /></svg>
                </a>
                <a href="https://www.instagram.com/rischwealth/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                </a>
              </div>
            )}
          </div>
          <div>
            <h2 className="f-heading">Firm</h2>
            <ul>
              <li><Link to="/about">The Firm</Link></li>
              <li><Link to="/who-we-serve">Who We Serve</Link></li>
              <li><Link to="/solutions">Solutions</Link></li>
              <li><Link to="/testimonials">Client Experiences</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="f-heading">Resources</h2>
            <ul>
              <li><Link to="/risk-profiler">Risk Assessment</Link></li>
              <li><Link to="/perspective">Perspective</Link></li>
              <li><Link to="/disclosure">Disclosures</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="f-heading">Contact</h2>
            <ul>
              <li><Link to="/contact">Start a conversation</Link></li>
              <li><a href={`mailto:${FIRM.email}`}>{FIRM.email}</a></li>
              <li><a href={FIRM.phoneHref}>{FIRM.phone}</a></li>
              <li><a href={FIRM.phoneAltHref}>{FIRM.phoneAlt}</a></li>
              <li><a href={FIRM.clientLoginUrl} target="_blank" rel="noopener noreferrer">Client Login</a></li>
            </ul>
          </div>
        </div>

        {(FIRM.registrations.length > 0 || FIRM.grievance) && (
          <div className="f-reg">
            {FIRM.registrations.map((r) => (
              <p key={r.id}><span>{r.label}:</span> {r.id}</p>
            ))}
            {FIRM.grievance && <p><span>Grievances:</span> {FIRM.grievance}</p>}
          </div>
        )}

        <div className="f-disclaimer">
          <p>
            Mutual fund investments are subject to market risks, read all scheme related documents carefully.
            {' '}{FIRM.legalName}. This site is for informational purposes only and does not constitute investment advice or an offer to buy or sell any security.
            {extendedLegal && ' Investments in securities, mutual funds, portfolio services and alternative assets are subject to market risk, including possible loss of principal.'}
            {' '}Past performance is not indicative of future results. See <Link to="/disclosure" style={{ fontSize: 'inherit', textDecoration: 'underline' }}>Disclosures</Link>.
          </p>
        </div>

        <div className="f-bottom">
          <p>© <span>{new Date().getFullYear()}</span> {FIRM.legalName}. All rights reserved.</p>
          <Link to="/employee-login">Employee sign-in</Link>
        </div>
        <p className="credit-line">Crafted with 🧡 by <b>Krishna Maheshwari</b></p>
      </div>
    </footer>
  );
}
