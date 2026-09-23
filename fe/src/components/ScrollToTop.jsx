import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// The original site was multi-page, so every navigation was a fresh
// document load starting at the top. React Router keeps scroll position
// by default, so this restores the original behaviour.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
