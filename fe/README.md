# RISCH Wealth — Frontend (React)

React + Vite migration of the original static `risch-wealth/*.html` site.
It started as a 1:1 framework migration; since then it has added a Login
menu, an employee login page, a home-page FAQ and a full SEO/performance
pass (see "SEO & performance" and "Change log" below).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/, every route prerendered to HTML
npm run preview  # serve the production build locally
```

The Risk Profiler page calls the backend in `../be` — run that too
(`cd ../be && npm install && npm start`), or the profiler will show a
"couldn't load" message instead of the quiz. All requests go to relative
`/api/...` paths: in dev, Vite's dev server proxies those to
`http://localhost:4000` (see `vite.config.js`); in production, nginx
proxies them to the backend on the same domain (see `../deploy/`). You
only need `.env` / `VITE_API_BASE_URL` if the API is on a different host
entirely — see `.env.example`.

## Deploying

In production this doesn't run `npm run dev`/`preview` — it's built into
a Docker image (`Dockerfile`) that bundles the static build with its own
nginx, which also proxies `/api` to the backend container
(`docker/nginx.conf`). Run both containers via `docker-compose.yml` at
the repo root. Full steps: `../deploy/README.md`.

## Structure

```
Dockerfile           builds the production image (see "Deploying" above)
docker/nginx.conf    the container's own nginx config (static + /api proxy,
                      gzip, per-page HTML routing, real 404s, caching)
scripts/prerender.mjs  build step: renders every route to static HTML,
                      writes sitemap.xml, warns on title/description length
public/              copied as-is into the build: robots.txt, llms.txt,
                      favicons, og-image.png (link-preview image), logo.png
                      (used by schema.org), Google Search Console file
src/
  assets/            logo, founder photo
  styles/            styles.css + profiler.css, copied verbatim from the
                      original site and imported globally in main.jsx
  api/
    riskProfilerApi.js  fetch wrappers for the backend's risk-profiler
                        endpoints (config + score)
  utils/
    format.js          fmtINR / pct — display-only formatting, not logic
  data/
    testimonials.js, perspectives.js  static content for those pages
  components/
    Nav/             shared site nav (active link, mobile burger, theme toggle)
    Footer/          shared site footer (a few prop-driven variants)
    TestimonialSlider/
    ScrollToTop.jsx  restores per-page-load scroll-to-top behavior under
                      React Router, since the original was a multi-page site
    RouteHead.jsx    keeps <head> (title, description, canonical, Open
                      Graph/X tags, JSON-LD) in sync on client-side navigation
  hooks/
    ThemeContext.jsx     dark/light mode, persisted to localStorage
    useScrollReveal.js   re-implements the original IntersectionObserver
                         scroll-reveal effect per route
  seo.js             single source of truth for every page's title,
                      description, noindex flag, the home-page FAQ, and the
                      schema.org structured data. Edit page SEO copy here.
  main.jsx           browser entry: hydrates the prerendered HTML
  entry-server.jsx   build-time entry: renders a route to an HTML string
  pages/
    Home.jsx, About.jsx, WhoWeServe.jsx, Solutions.jsx, Testimonials.jsx,
    Perspective.jsx, Disclosure.jsx, Contact.jsx, EmployeeLogin.jsx,
    NotFound.jsx
    RiskProfiler/
      RiskProfiler.jsx   the multi-step questionnaire (intro -> basics ->
                         8 questions -> report), state-machine driven
      RiskProfilerConfigContext.jsx  fetches the question bank + tier
                         data from the backend once and shares it down
                         the page tree
      report/            the 4-page printable proposal (donuts, tables,
                         tier tabs), split into small presentational
                         components. These only render numbers — they
                         never compute a tier or an allocation
                         themselves; that comes from the backend.
```

**Important:** the question bank, the suitability grid, the tier
allocations, and the actual scoring math used to live in this folder
(`data.js` + `scoring.js`) but have been moved to `../be` — see
`be/README.md`. That's what a future superAdmin config screen will edit,
and this frontend is just a client of it now.

## Routes

| Where it's linked                          | React route       |
|--------------------------------------------|-------------------|
| (logo)                                     | `/` (Home)        |
| Nav: The Firm                              | `/about`          |
| Nav: Who We Serve                          | `/who-we-serve`   |
| Nav: Solutions                             | `/solutions`      |
| "Start Risk Profile" button, footer        | `/risk-profiler`  |
| Nav: Testimonials                          | `/testimonials`   |
| Nav: Perspective                           | `/perspective`    |
| Nav: Disclosure                            | `/disclosure`     |
| Nav: Contact Us                            | `/contact`        |
| Login menu → Employee Login                | `/employee-login` (noindex) |
| anything else                              | 404 page (noindex, real 404 status) |

Login menu → Client Login opens `https://wealthelite.in/client-login` in a
new tab.

**Adding a page:** add the `<Route>` in `App.jsx` *and* an entry in
`PAGES` in `seo.js`. The prerender step renders exactly the routes listed
in `PAGES`, and nginx serves anything not prerendered as a 404.

## SEO & performance

How the production build works (`npm run build`):

1. `vite build`: the normal client bundle.
2. `vite build --ssr src/entry-server.jsx`: a Node-side copy of the app.
3. `node scripts/prerender.mjs`: renders every route in `seo.js` `PAGES`
   to `dist/<route>.html` (home is `index.html`, plus `404.html`), injects
   that page's `<head>` tags into the `<!--app-head-->` placeholder in
   `index.html`, and writes `dist/sitemap.xml` (indexable pages only).

In the browser, `main.jsx` hydrates that HTML instead of rendering from
scratch. So crawlers, link previews and AI tools that don't run
JavaScript still see the full page text and the right tags. In `npm run
dev` there's no prerendering; `RouteHead` sets the tags client-side.

Because pages are rendered at build time, component code must not touch
`window`, `document` or `localStorage` during render, only inside
`useEffect` or event handlers. Rendered output must also not depend on
browser-only state, or hydration will mismatch. That's why the theme
toggle's sun/moon icons are switched by CSS (`html[data-theme]`) rather
than an inline style.

Per page (from `seo.js`):
- `<title>` (50–60 chars) and meta description (120–160 chars). The build
  prints `SEO warning` if an indexable page falls outside those ranges.
- `<link rel="canonical">` pointing at `https://rischwealth.com/...`
- `robots` meta (`noindex` for `/employee-login` and the 404 page)
- Open Graph + X (Twitter) card tags, image `public/og-image.png` (1200×630)
- JSON-LD: `FinancialService` (the firm), `Person` (founder), `WebSite`,
  the page itself, and `FAQPage` on the home page only

Site-wide:
- `public/robots.txt` allows all crawlers (including AI crawlers), blocks
  `/api/`, and points at the sitemap. `public/llms.txt` is a plain-text
  summary of the firm for LLMs.
- Inter is self-hosted (`@fontsource-variable/inter`, one variable font
  file for all weights), and its Latin file is preloaded. There are no
  Google Fonts requests.
- The logo (`src/assets/logo.png`) is sized for its 32px display height
  (10 KB, was 267 KB). The favicons are generated from the logo's "R".
- `docker/nginx.conf` gzips text assets, caches hashed `/assets/` files
  for a year and HTML with `no-cache` (so deploys show up immediately),
  redirects `/page/` → `/page`, and returns a real 404 for unknown URLs.

The home-page FAQ answers (`FAQS` in `seo.js`) are also emitted as
FAQPage schema, so the visible text and the schema can't drift apart.
Every answer restates something the site already says elsewhere. Keep it
that way, and have compliance review any change.

Lighthouse (mobile, run against local Docker builds before and after the
SEO pass): Performance 58–71 → 99, SEO 92 → 100, Best Practices
96–100 → 100, Accessibility 93–95 → 95, page weight ~960 KB → ~175 KB,
home LCP 6.4 s → 1.8 s. The remaining accessibility point is colour
contrast: white text on the brand orange `#F1650C` is 3.2:1, and WCAG AA
asks for 4.5:1 at that text size.

## Known gaps (by design, until more of the backend exists)

- Employee login (`/employee-login`) is UI only. There are no staff
  accounts or auth yet; submitting shows a "not available yet" message,
  and nothing is sent or stored.

- The contact form does not submit anywhere yet — same as the original
  site, which only showed a "this is a design preview" message.
- Perspective's blog posts are hard-coded placeholder content
  (`src/data/perspectives.js`) pending a real CMS/backend.
- The risk profiler's basic-details step (name/email/phone) is not
  persisted anywhere yet — only the answers are sent to `../be`, and only
  to compute a result, not to save a submission record.

## Change log

Newest first.

**SEO audit fixes** (from the rischwealth.com SEO audit report)
- Prerendering of every route + hydration (was a client-only SPA:
  crawlers saw an empty `<div id="root">`).
- Per-page titles/descriptions/canonicals, Open Graph + X cards,
  schema.org JSON-LD, `sitemap.xml`, real `robots.txt` and `llms.txt`
  (before this, those three URLs returned the homepage HTML).
- Home-page FAQ section (7 questions) + FAQPage schema.
- Heading structure: one `<h1>` per page and no skipped levels. Footer
  column labels `h5` → `h2`, and card titles directly under a page `<h1>`
  `h3`/`h4` → `h2`/`h3`. Visual styling is unchanged.
- Risk profiler shows its intro (with Begin disabled) while the question
  bank loads, instead of a bare "Loading…".
- Real 404 page and status for unknown URLs (was the homepage with 200).
- gzip, cache headers, trailing-slash redirect in `docker/nginx.conf`.
- Self-hosted Inter font, optimised logo, new favicons, share image.
- Fixed phones showing two squeezed columns wherever a `.g-2` grid set
  its columns inline (the mobile breakpoint now uses `!important`).
- Removed an invalid `height="auto"` on the home-page SVG (console error).
- Replaced the per-page `useDocumentHead` hook with `seo.js` + `RouteHead`.

**Login menu**
- Nav "Client Login" link → "Login ▾" dropdown (hover or click; closes on
  outside click or Escape) with Client Login (Wealth Elite, new tab) and
  Employee Login (`/employee-login`). The mobile menu lists both links.

**Nav**
- Removed the "Risk Profiler" nav tab, since the "Start Risk Profile"
  button already links there. The footer link remains.
