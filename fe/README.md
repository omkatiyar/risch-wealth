# RISCH Wealth — Frontend (React)

React + Vite migration of the original static `risch-wealth/*.html` site.
Visual output, copy, layout, and behavior are intended to match the
original 1:1 — this is a framework migration, not a redesign.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
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
docker/nginx.conf    the container's own nginx config (static + /api proxy)
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
  hooks/
    ThemeContext.jsx     dark/light mode, persisted to localStorage
    useScrollReveal.js   re-implements the original IntersectionObserver
                         scroll-reveal effect per route
    useDocumentHead.js   sets document.title / meta description per page
  pages/
    Home.jsx, About.jsx, WhoWeServe.jsx, Solutions.jsx, Testimonials.jsx,
    Perspective.jsx, Disclosure.jsx, Contact.jsx
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

| Nav label      | React route      |
|----------------|------------------|
| The Firm       | `/about`         |
| Who We Serve   | `/who-we-serve`  |
| Solutions      | `/solutions`     |
| Risk Profiler  | `/risk-profiler` |
| Testimonials   | `/testimonials`  |
| Perspective    | `/perspective`   |
| Disclosure     | `/disclosure`    |
| Contact Us     | `/contact`       |
| (logo)         | `/` (Home)       |

## Known gaps (by design, until more of the backend exists)

- The contact form does not submit anywhere yet — same as the original
  site, which only showed a "this is a design preview" message.
- Perspective's blog posts are hard-coded placeholder content
  (`src/data/perspectives.js`) pending a real CMS/backend.
- The risk profiler's basic-details step (name/email/phone) is not
  persisted anywhere yet — only the answers are sent to `../be`, and only
  to compute a result, not to save a submission record.
