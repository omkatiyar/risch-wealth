import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useTheme } from '../../hooks/ThemeContext';

const navLinkClass = ({ isActive }) => (isActive ? 'active' : undefined);

const CLIENT_LOGIN_URL = 'https://wealthelite.in/client-login';

const NAV_LINKS = [
  { to: '/about', label: 'The Firm' },
  { to: '/who-we-serve', label: 'Who We Serve' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/perspective', label: 'Perspective' },
  { to: '/disclosure', label: 'Disclosure' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Nav({ showMobileProfilerLink = true }) {
  const { toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    document.addEventListener('scroll', onScroll, { passive: true });
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  // Close the Login dropdown on an outside click or Escape. Hover opens
  // it too (CSS), this state is for click/tap and keyboard users.
  useEffect(() => {
    if (!loginOpen) return undefined;
    const onPointerDown = (e) => {
      if (!loginMenuRef.current?.contains(e.target)) setLoginOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLoginOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [loginOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={'nav' + (scrolled ? ' scrolled' : '')}>
      <NavLink to="/" className="nav-logo" onClick={closeMenu}>
        <img src={logo} alt="RISCH Wealth" />
      </NavLink>
      <div className={'nav-links' + (menuOpen ? ' open' : '')}>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={navLinkClass}
            onClick={closeMenu}
          >
            {link.label}
          </NavLink>
        ))}
        <div className="nav-links-extra">
          <a href={CLIENT_LOGIN_URL} target="_blank" rel="noopener noreferrer">Client Login</a>
          <NavLink to="/employee-login" onClick={closeMenu}>Employee Login</NavLink>
          {showMobileProfilerLink && (
            <NavLink to="/risk-profiler" onClick={closeMenu}>Start Risk Profile</NavLink>
          )}
        </div>
      </div>
      <div className="nav-actions">
        <button
          className="theme-toggle"
          type="button"
          aria-label="Toggle dark mode"
          onClick={toggleTheme}
        >
          <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8" />
          </svg>
          <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
          </svg>
        </button>
        <div className={'nav-login-menu' + (loginOpen ? ' open' : '')} ref={loginMenuRef}>
          <button
            type="button"
            className="nav-login"
            aria-haspopup="true"
            aria-expanded={loginOpen}
            onClick={() => setLoginOpen((v) => !v)}
          >
            Login
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4.5L6 7.5L9 4.5" /></svg>
          </button>
          <div className="nav-login-dropdown">
            <a href={CLIENT_LOGIN_URL} target="_blank" rel="noopener noreferrer" onClick={() => setLoginOpen(false)}>
              Client Login
              <span>Your portfolio on Wealth Elite</span>
            </a>
            <NavLink to="/employee-login" onClick={() => setLoginOpen(false)}>
              Employee Login
              <span>For the RISCH team</span>
            </NavLink>
          </div>
        </div>
        <NavLink to="/risk-profiler" className="nav-cta">Start Risk Profile</NavLink>
      </div>
      <button
        className={'nav-burger' + (menuOpen ? ' open' : '')}
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span></span><span></span><span></span>
      </button>
    </nav>
  );
}
