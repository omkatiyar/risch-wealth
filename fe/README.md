# RISCH Wealth — Frontend (React)

React + Vite migration of the original static `risch-wealth/*.html` site.
It started as a 1:1 framework migration. Since then it has been redesigned
as a private-wealth site (see "Design system"), and has gained an employee
login page, a home-page FAQ and a full SEO/performance pass. See "Change
log" at the bottom.

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
    firm.js          firm facts in one place: name, email, phone, founding
                      year, and the optional client count / assets /
                      minimum / registrations / grievance fields. Fields
                      left null are hidden, so nothing unverified shows.
    segments.jsx     client profiles (Who We Serve page + home page)
    testimonials.js, perspectives.js  static content for those pages
  components/
    Nav/             shared site nav: 5 links, Client Login, "Start a
                      conversation" CTA, theme toggle, mobile burger
    Footer/          charcoal footer: entity, links, registrations (from
                      firm.js), disclaimer, employee sign-in link
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

| Where it's linked                               | React route       |
|-------------------------------------------------|-------------------|
| (logo)                                          | `/` (Home)        |
| Nav: The Firm                                   | `/about`          |
| Nav: Who We Serve                               | `/who-we-serve`   |
| Nav: Solutions                                  | `/solutions`      |
| Nav: Testimonials, footer: Client Experiences   | `/testimonials`   |
| Nav: Perspective                                | `/perspective`    |
| Nav: Disclosure, footer: Disclosures            | `/disclosure`     |
| Nav: Contact, "Start a conversation" buttons     | `/contact`        |
| Nav: "Start Risk Profile" button, "Take the risk assessment" buttons | `/risk-profiler` |
| Footer: Employee sign-in                         | `/employee-login` (noindex) |
| anything else                                   | 404 page (noindex, real 404 status) |

"Client Login" (nav and footer) opens `FIRM.clientLoginUrl` (Wealth Elite)
in a new tab.

## Design system

`src/styles/styles.css` (v3, "private-wealth editorial"):

- **Colour:** warm ivory ground (`--bg #FAF6F0`), sand for alternate
  sections (`--bg-tint`), charcoal text and primary buttons (`--ink
  #1C1A17`). The logo orange `--orange #F1650C` is only used for graphics
  and hairlines (it's 2.95:1 on ivory). Orange *text* uses `--accent
  #B24A07` (5:1). Dark mode is still available from the toggle, but light
  is the default (`index.html` + `ThemeContext`). The footer is charcoal
  in both themes.
- **Type:** Cormorant Garamond (self-hosted variable font, picked to echo
  the logo's serif) for `.display-*` headings, with lining numerals.
  Inter for everything else, including the smaller `.display-s` headings,
  where Cormorant gets too thin.
- **Shape:** squared 4px buttons (no pills), flat hairline-bordered cards,
  and numbered serif sequences (01, 02…) instead of icon tiles.
- The printable proposal (`profiler.css`, `.report-page`) pins its own
  palette and isn't affected by the site theme.

**Home page order:** hero → trust bar → philosophy ("Risk first. Return
follows.") → how we work (5 steps) → who we serve → what we do → why
RISCH → founder → client experiences → risk assessment (secondary CTA)
→ FAQ → closing CTA.

**Firm facts:** the trust bar, footer and schema read from
`src/data/firm.js`. The trust bar shows only facts the site already
states (career length from the About timeline, founding year, no
proprietary products, the 8-point diagnostic). `clientCount`, `assets`,
`minimumInvestable`, `registrations` and `grievance` start as `null`/empty
and appear automatically once filled. Only add figures that are accurate
and cleared by compliance.

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
- Fonts are self-hosted (`@fontsource-variable/inter` for body text,
  `@fontsource-variable/cormorant-garamond` for headings), and both Latin
  files are preloaded by the prerender step. There are no Google Fonts
  requests.
- The logo (`src/assets/logo.png`) is sized for its 32px display height
  (10 KB, was 267 KB). The favicons are generated from the logo's "R".
- `docker/nginx.conf` gzips text assets, caches hashed `/assets/` files
  for a year and HTML with `no-cache` (so deploys show up immediately),
  redirects `/page/` → `/page`, and returns a real 404 for unknown URLs.

The home-page FAQ answers (`FAQS` in `seo.js`) are also emitted as
FAQPage schema, so the visible text and the schema can't drift apart.
Every answer restates something the site already says elsewhere. Keep it
that way, and have compliance review any change.

Lighthouse (mobile, local Docker builds):

| | Before SEO pass | After SEO pass | After redesign |
|---|---|---|---|
| Performance | 58–71 | 99 | 98–99 |
| Accessibility | 93–95 | 95 | **100** |
| Best Practices | 96–100 | 100 | 100 |
| SEO | 92 | 100 | 100 |
| Home page weight | ~960 KB | ~175 KB | ~250 KB (adds the serif font) |

Accessibility reached 100 once buttons moved to charcoal and orange text
to `--accent`. White on the logo orange was only 3.2:1.

## Known gaps (by design, until more of the backend exists)

- Employee login (`/employee-login`) is UI only. There are no staff
  accounts or auth yet; submitting shows a "not available yet" message,
  and nothing is sent or stored.

- The contact form has no backend. On submit it opens the visitor's
  email app with a pre-filled message to `FIRM.email`. Once the API can
  send or store enquiries, POST the form there instead.
- Perspective's blog posts are hard-coded placeholder content
  (`src/data/perspectives.js`) pending a real CMS/backend.
- The risk profiler's basic-details step (name/email/phone) is not
  persisted anywhere yet — only the answers are sent to `../be`, and only
  to compute a result, not to save a submission record.

## Change log

Newest first.

**Investment principles (client brochure)**
- Added an "Our Investment Principles" section to the Solutions page,
  between the four disciplines and the allocation universe: RISCH's own
  seven-principle client brochure ("We put investors first", "We're
  independent-minded", "We invest for the long term", "We're
  valuation-driven investors", "We take a fundamental approach", "We
  strive to minimise costs", "We build portfolios holistically"), each
  with a small stroke icon, in the same card grid as the allocation
  universe below it. Titles and copy are the firm's own text
  (light copy-edits only), not written for this redesign. The data now
  lives in `src/data/principles.jsx` (icon + title + body), shared with
  the home page hero below.
- Home page hero: the seven principle titles now run right-aligned
  beside "Capital deserves a considered hand" (a numbered list with
  hairline dividers, linking to the Solutions page for the full text).
  Stacks below the CTAs on mobile. The decorative wave graph under the
  hero is shorter (viewBox height 300 → 150, same curve, just
  compressed) to make room.
- The Allocation Universe section lost its `on-dark`/tint background
  (it would otherwise sit directly against the new tinted Investment
  Principles section with no visual break) and its icons dropped the
  now-redundant `icon-badge-dark` modifier.

**Private-wealth redesign**
- New design system (see "Design system"): ivory default theme, charcoal
  primary buttons, the orange as a restrained accent, Cormorant Garamond
  display headings, squared buttons, flat cards. Replaces the previous
  "consumer fintech" look. Accessibility is 95 → 100.
- Home page rebuilt around a private-wealth story: trust bar, 5-step
  "How we work with you", four client profiles, four disciplines, "Why
  RISCH", founder section with career summary, and a closing
  consultation CTA. The allocation-universe ticker was removed.
- The main CTA on inner pages/sections is "Start a conversation"
  (`/contact`); the risk profiler is offered as a secondary action
  ("Take the risk assessment"). The nav's top-right button is the
  exception: it stays "Start Risk Profile" → `/risk-profiler`, so it
  doesn't duplicate the "Contact" nav link next to it.
- Nav: The Firm, Who We Serve, Solutions, Testimonials, Perspective,
  Disclosure, Contact (7 links). Fits down to ~1180px before the burger
  (was 1400px in the previous design).
- Kept the Login dropdown ("Login ▾" → Client Login / Employee Login),
  restyled for the new design system (squared corners, ivory/charcoal).
  The footer also keeps a small "Employee sign-in" link as a second way in.
- Disclosure page rewritten as 12 numbered clauses (same numbered-row
  pattern as the home page's philosophy section): purpose, entity,
  regulatory compliance, risk assessment methodology, its limits,
  independence, deviation policy, no advice/no endorsement, risk
  warning, no guarantee of returns, confidentiality, trademarks, and
  contact. The regulatory-compliance and no-advice/no-endorsement
  clauses are drawn from RISCH's own client brochure ("Investment
  Principles"), not written for this redesign. Regulatory registration
  and grievance rows appear automatically once `FIRM.registrations` /
  `FIRM.grievance` are filled in — nothing is invented ahead of that.
- New charcoal footer: legal entity, location, link columns, registration
  line (from `firm.js`), disclaimer.
- `src/data/firm.js` holds firm facts; `src/data/segments.jsx` holds the
  client profiles shared by two pages.
- Contact page: the "design preview" message is gone. The form now opens
  a pre-filled email to `FIRM.email`, and "Portfolio review" was added as
  a topic.
- `contact@rischwealth.com` (used on Disclosure and in the profiler
  footer) replaced with `FIRM.email`. The domain has no MX records yet,
  so that address bounced.
- Risk profiler: the intro now says "preliminary proposal". The result
  screen shows a "preliminary assessment, not a final investment
  recommendation" notice, with "Discuss this with RISCH" as the primary
  action.
- Copy: removed "more than two decades" / "20+ years" from the FAQ, the
  About meta description and `llms.txt`. The About timeline (career from
  2006, RISCH from 2014) doesn't support it. The trust bar computes the
  career length from `FIRM.careerStartYear`.
- New share image (`public/og-image.png`) in the new design.

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
