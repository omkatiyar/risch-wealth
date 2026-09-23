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

## Structure

```
src/
  assets/            logo, founder photo
  styles/            styles.css + profiler.css, copied verbatim from the
                      original site and imported globally in main.jsx
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
    Home.jsx, About.jsx, Expertise.jsx, Contact.jsx
    RiskProfiler/
      RiskProfiler.jsx   the multi-step questionnaire (intro -> basics ->
                         8 questions -> report), state-machine driven
      data.js            question bank + tier/allocation data
      scoring.js          scoring + suitability-matrix logic
      report/            the 4-page printable proposal (donuts, tables,
                         tier tabs), split into small presentational
                         components instead of the original's string-built
                         HTML
```

## Routes

| Original page        | React route      |
|-----------------------|------------------|
| index.html            | `/`              |
| about.html             | `/about`         |
| expertise.html         | `/expertise`     |
| contact.html            | `/contact`       |
| risk-profiler.html      | `/risk-profiler` |

## Known gaps vs. the live site (by design, until the backend exists)

- The contact form and the risk-profiler's "basic details" step do not
  submit anywhere yet — same as the original site, which only showed a
  "this is a design preview" message. Once `../be` exists, wire these to
  real endpoints instead of local component state.
- No client data is persisted or sent anywhere; everything lives in
  React state for the duration of the session.
