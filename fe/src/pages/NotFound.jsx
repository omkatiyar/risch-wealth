import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';

export default function NotFound() {
  return (
    <>
      <Nav />

      <header className="page-head" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots" style={{ top: 0, height: 380 }}></div>
        <div className="wrap" style={{ position: 'relative' }}>
          <p className="eyebrow kicker">Page Not Found</p>
          <h1 className="display-xxl" style={{ maxWidth: '14em' }}>This page <span className="italic">doesn't exist.</span></h1>
          <p className="lede" style={{ maxWidth: '44ch', marginTop: 24 }}>The link may be out of date, or the address may have a typo.</p>
          <div className="flex gap-16" style={{ marginTop: 32, flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">Go to the home page</Link>
            <Link to="/contact" className="btn">Contact us</Link>
          </div>
        </div>
      </header>

      <Footer />
    </>
  );
}
