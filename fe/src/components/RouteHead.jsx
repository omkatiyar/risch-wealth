import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getHeadTags, getJsonLd, PAGES } from '../seo';

// Keeps <head> in sync with the current route during client-side
// navigation. The first page load already has the right tags baked in by
// scripts/prerender.mjs; this only matters once the user clicks around.
export default function RouteHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = PAGES[pathname] ? pathname : '/404';
    const { title, canonical, meta } = getHeadTags(path);
    document.title = title;

    meta.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (name) el.setAttribute('name', name);
        else el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    });

    let link = document.head.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    } else if (link) {
      link.remove();
    }

    let ld = document.head.querySelector('script[type="application/ld+json"]');
    if (!ld) {
      ld = document.createElement('script');
      ld.setAttribute('type', 'application/ld+json');
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(getJsonLd(path));
  }, [pathname]);

  return null;
}
