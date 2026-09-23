# RISCH Wealth — Backend (planned)

This directory is reserved for the future Node.js / Express.js API that will
serve the React frontend in `../fe`.

Not implemented yet. Phase 1 of the rebuild only migrates the static
frontend (`risch-wealth/*.html`) to React — no backend, no database.

## Planned scope (future phases)

- Express.js REST API
- MySQL for client, portfolio, investment, and report data
- Endpoints to replace the current client-side-only contact form and
  risk-profiler flow in the frontend (`fe/src/pages/Contact.jsx` and
  `fe/src/pages/RiskProfiler`), which currently do not call any backend
- Authentication, client management, portfolio/investment data, dashboards

## Security notes for when this is built

- No credentials, API keys, or secrets committed to this repo — use
  environment variables / a secrets manager instead.
- All client financial data lives server-side (MySQL), never in the
  frontend bundle or browser storage.
- Keep this service as the only thing with direct database access; the
  frontend should only ever talk to it over an authenticated API.
