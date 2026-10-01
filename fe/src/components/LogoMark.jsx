import logo from '../assets/logo.png';
import BrandArrow from './BrandArrow';

// The RISCH wordmark image (logo.png) with the brochure's rising arrow above
// it. Size it with --h (the wordmark's height) in CSS; the arrow is placed
// from the letter positions in logo.png: its tail starts just after the
// "I" and its head rises over the "H".
export default function LogoMark({ alt = 'RISCH', className = '' }) {
  return (
    <span className={`logo-mark ${className}`.trim()}>
      <BrandArrow />
      <img src={logo} alt={alt} width="312" height="96" />
    </span>
  );
}
