import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Footer({ showSocials = true, extendedLegal = false, contactEmail = 'rischwealth@gmail.com', showPhone = true }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="f-top">
          <div>
            <div className="f-logo"><img src={logo} alt="RISCH Wealth" /></div>
            <p className="f-legal">
              RISCH Wealth Private Limited. This site is for informational purposes only and does not constitute investment advice.
              {extendedLegal && ' Investments in securities, mutual funds, portfolio services and alternative assets are subject to market risk, including possible loss of principal.'}
            </p>
            {showSocials && (
              <div className="flex gap-12" style={{ marginTop: 18 }}>
                <a href="https://www.linkedin.com/in/rishiraj-maheshwari-81240b5/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon-badge-sm icon-badge" style={{ color: 'var(--ink-2)', background: 'var(--surface)', border: '1px solid var(--line-strong)' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.53-1 1.83-2.1 3.77-2.1 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" /></svg>
                </a>
                <a href="https://www.instagram.com/rischwealth/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="icon-badge-sm icon-badge" style={{ color: 'var(--ink-2)', background: 'var(--surface)', border: '1px solid var(--line-strong)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                </a>
              </div>
            )}
          </div>
          <div>
            <h5>Firm</h5>
            <ul>
              <li><Link to="/about">The Firm</Link></li>
              <li><Link to="/who-we-serve">Who We Serve</Link></li>
              <li><Link to="/solutions">Solutions</Link></li>
            </ul>
          </div>
          <div>
            <h5>Resources</h5>
            <ul>
              <li><Link to="/risk-profiler">Risk Profiler</Link></li>
              <li><Link to="/testimonials">Testimonials</Link></li>
              <li><Link to="/perspective">Perspective</Link></li>
              <li><Link to="/disclosure">Disclosure</Link></li>
            </ul>
          </div>
          <div>
            <h5>Connect</h5>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
              {showPhone && <li><a href="tel:+919448090998">+91 94480 90998</a></li>}
            </ul>
          </div>
        </div>
        <div className="f-bottom">
          <p>© <span>{new Date().getFullYear()}</span> RISCH Wealth Private Limited. All rights reserved.</p>
          <p>RISCH Private Wealth</p>
        </div>
        <p className="credit-line">Crafted with 🧡 by <b>Krishna Maheshwari</b></p>
      </div>
    </footer>
  );
}
