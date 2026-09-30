import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FIRM } from '../../data/firm';

// `extendedLegal` adds the market-risk sentence (Disclosure page and the
// profiler report). Office, registration and contact details all come
// from src/data/firm.js.
export default function Footer({ showSocials = true, extendedLegal = false }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className={'f-top' + (showSocials ? ' f-top-connect' : '')}>
          <div>
            <div className="f-logo"><img src={logo} alt="RISCH Wealth" /></div>
            <p className="f-tagline">Private Wealth. Family Capital. Enduring Legacies.</p>
            <p className="f-meta">RISCH Private Wealth</p>
          </div>
          <div>
            <h2 className="f-heading">Firm</h2>
            <ul>
              <li><Link to="/about">The Firm</Link></li>
              <li><Link to="/who-we-serve">Who We Serve</Link></li>
              <li><Link to="/solutions">Solutions</Link></li>
              <li><Link to="/testimonials">Client Experiences</Link></li>
              <li><Link to="/perspective">Perspective</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="f-heading">Clients</h2>
            <ul>
              <li><Link to="/contact">Start a conversation</Link></li>
              <li><Link to="/risk-profiler">Risk Assessment</Link></li>
              <li><Link to="/client-login">Client Login</Link></li>
              <li><Link to="/disclosure">Disclosures</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="f-heading">Office</h2>
            <address className="f-address">
              {FIRM.address.lines.map((line) => <span key={line}>{line}</span>)}
            </address>
            <ul style={{ marginTop: 16 }}>
              <li><a href={FIRM.phoneHref}>{FIRM.phone}</a></li>
              {FIRM.phoneAlt && <li><a href={FIRM.phoneAltHref}>{FIRM.phoneAlt}</a></li>}
              <li><a href={`mailto:${FIRM.email}`}>{FIRM.email}</a></li>
            </ul>
          </div>
          {showSocials && (
            <div className="f-connect">
              <h2 className="f-heading">Connect</h2>
              <div className="f-social">
                <a href="https://www.linkedin.com/in/rishiraj-maheshwari-81240b5/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.53-1 1.83-2.1 3.77-2.1 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" /></svg>
                </a>
                {/* Instagram hidden for now (https://www.instagram.com/rischwealth/) */}
              </div>
            </div>
          )}
        </div>

        {(FIRM.registrations.length > 0 || FIRM.grievance) && (
          <div className="f-reg">
            <p className="f-reg-note">{FIRM.legalName}. {FIRM.registrationNote}</p>
            <div className="f-reg-ids">
              {FIRM.registrations.map((r) => (
                <p key={r.id}>{r.id}</p>
              ))}
              {FIRM.grievance && <p><span>Grievances</span> {FIRM.grievance}</p>}
            </div>
          </div>
        )}

        <div className="f-disclaimer">
          <p>
            Mutual fund investments are subject to market risks, read all scheme related documents carefully.
            {' '}This site is for informational purposes only and does not constitute investment advice or an offer to buy or sell any security.
            {extendedLegal && ' Investments in securities, mutual funds, portfolio services and alternative assets are subject to market risk, including possible loss of principal.'}
            {' '}Past performance is not indicative of future results. See <Link to="/disclosure" style={{ fontSize: 'inherit', textDecoration: 'underline' }}>Disclosures</Link>.
          </p>
        </div>

        <div className="f-bottom">
          <p>© <span>{new Date().getFullYear()}</span> {FIRM.legalName}. All rights reserved.</p>
          <p className="f-motto">Trust. Discipline. Performance.</p>
          <Link to="/employee-login">Employee sign-in</Link>
        </div>
      </div>
    </footer>
  );
}
