// Build step 3 of 3 (see "build" in package.json). Renders every route to
// static HTML so crawlers, social previews and LLMs see real content and
// per-page <head> tags without running JavaScript. React then hydrates it.
//
// Also writes sitemap.xml, and warns when a page's title/description
// falls outside the lengths the SEO audit asked for.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const { getHeadTags, getJsonLd, PAGES, canonicalUrl } = await import(pathToFileURL(path.join(root, 'src/seo.js')).href);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

// Preload the Latin Inter file so text paints in the right font first time.
const interLatin = fs.readdirSync(path.join(dist, 'assets')).find((f) => /^inter-latin-wght-normal-.*\.woff2$/.test(f));
if (!interLatin) throw new Error('Inter font file not found in dist/assets');
const fontPreload = `<link rel="preload" href="/assets/${interLatin}" as="font" type="font/woff2" crossorigin />`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function headHtml(route) {
  const { title, canonical, meta } = getHeadTags(route);
  const tags = [`<title>${esc(title)}</title>`, fontPreload];
  for (const m of meta) {
    const key = m.name ? `name="${esc(m.name)}"` : `property="${esc(m.property)}"`;
    tags.push(`<meta ${key} content="${esc(m.content)}" />`);
  }
  if (canonical) tags.push(`<link rel="canonical" href="${esc(canonical)}" />`);
  // "<" escaped so no string inside the JSON can close the script tag
  const json = JSON.stringify(getJsonLd(route)).replace(/</g, '\\u003c');
  tags.push(`<script type="application/ld+json">${json}</script>`);
  return tags.join('\n    ');
}

// Output file per route. nginx (docker/nginx.conf) serves /about from
// about.html, and anything unmatched gets 404.html with a real 404 status.
const outFile = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`);

const warnings = [];
for (const route of Object.keys(PAGES)) {
  const page = PAGES[route];
  const html = template
    .replace('<!--app-head-->', headHtml(route))
    .replace('<!--app-html-->', render(route === '/404' ? '/__not-found__' : route));
  fs.writeFileSync(path.join(dist, outFile(route)), html);

  if (!page.noindex) {
    if (page.title.length < 50 || page.title.length > 60) warnings.push(`${route}: title is ${page.title.length} chars (aim for 50–60)`);
    if (page.description.length < 120 || page.description.length > 160) warnings.push(`${route}: description is ${page.description.length} chars (aim for 120–160)`);
  }
}

const urls = Object.keys(PAGES)
  .filter((route) => !PAGES[route].noindex)
  // No <lastmod>: every build would stamp today's date on every page, and
  // Google ignores lastmod values that don't reflect real content changes.
  .map((route) => `  <url>\n    <loc>${canonicalUrl(route)}</loc>\n  </url>`)
  .join('\n');
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(`prerendered ${Object.keys(PAGES).length} pages + sitemap.xml`);
for (const w of warnings) console.warn(`  SEO warning — ${w}`);
