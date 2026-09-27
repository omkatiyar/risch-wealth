# RISCH Wealth — Backend

Express API. Currently owns one thing: the risk-profiler's question bank,
suitability grid, tier allocations, and the scoring math that turns a set
of answers into a recommended portfolio. This used to live entirely in
the frontend (`fe/src/pages/RiskProfiler/data.js` + `scoring.js`) — it
was moved here so the "weights" aren't stuck in a static JS bundle.

## Run

Locally without Docker:

```bash
npm install
cp .env.example .env   # optional locally; see env vars below
npm start        # http://localhost:4000
npm run dev       # same, but restarts on file changes
```

In dev, the frontend talks to this over Vite's dev-server proxy (see
`fe/vite.config.js`), so no CORS setup is needed locally either.

In production this runs as a Docker container (see `Dockerfile` here and
`docker-compose.yml` at the repo root) — you normally won't run this
directly on the server. Full steps: `../deploy/README.md`.

### Environment variables (`.env`, see `.env.example`)

- `PORT` — default `4000`.
- `HOST` — default `127.0.0.1` when run directly with `npm start`
  (nothing but a same-machine reverse proxy should reach it). The Docker
  Compose setup overrides this to `0.0.0.0` inside the container, since
  `127.0.0.1` there would mean "only this container," making it
  unreachable from the frontend container too — the container boundary
  itself is what keeps it off the public internet, not the bind address.
- `CORS_ORIGIN` — comma-separated allowlist for direct (non-proxied) API
  access from non-localhost origins. Defaults to `https://rischwealth.com`
  + `https://www.rischwealth.com`. Any `localhost`/`127.0.0.1` origin
  (any port) is always allowed, for local dev. Same-origin requests
  through the nginx/Vite proxy don't need this at all.

## Endpoints

- `GET /api/risk-profiler/config` — question bank + tier allocations, used
  by the frontend to render the quiz and the report.
- `POST /api/risk-profiler/score` — body `{ answers: { q1: <points>, ... } }`
  for all 8 questions. Returns the computed time-horizon/risk-preference
  scores, the recommended tier, and every tier's full allocation +
  granular breakdown (the report needs all four, not just the
  recommended one, for its tabs). This is the only place the tier is
  ever decided — the frontend just displays whatever this returns.

## Where the config lives right now

`src/riskProfiler/config.js` — a hard-coded object (`getActiveConfig()`).
This is a deliberate stepping stone, not the end state:

- **Not yet done:** Postgres-backed config, versioning (so a proposal
  generated last month can still be explained even if weights change
  later), and a superAdmin UI to edit weights from the frontend.
- **Already true today:** the scoring math (`src/riskProfiler/scoring.js`)
  is written to take a `config` object as a parameter rather than
  importing hard-coded constants — so swapping `getActiveConfig()` for a
  real DB read later shouldn't require touching the scoring logic itself.

`POST /score` also validates that every submitted answer's point value
actually matches one of that question's real options
(`validateAnswers` in `scoring.js`) — this catches obviously-tampered
requests, though it isn't full protection since points are still visible
to the browser today. Once questions have stable option ids and the
frontend submits those instead of raw points, this can be tightened to
reject anything except a known option id.

## Planned scope (future phases)

- PostgreSQL for the risk-profiler config (with version history) and for
  client, portfolio, investment, and report data
- RBAC (`superAdmin` and others) so config edits are gated
- Endpoints to replace the current client-side-only contact form
  (`fe/src/pages/Contact.jsx`)
- Authentication, client management, portfolio/investment data, dashboards

## Security notes for when this grows

- No credentials, API keys, or secrets committed to this repo — use
  environment variables / a secrets manager instead.
- All client financial data lives server-side (Postgres, once added),
  never in the frontend bundle or browser storage.
- Keep this service as the only thing with direct database access; the
  frontend should only ever talk to it over an authenticated API.
- This process must not be reachable on the public IP directly. In the
  Docker setup it has no published port at all (see `docker-compose.yml`)
  — only the frontend container can reach it, over the internal Docker
  network.

## Change log

Newest first. The backend's own code (`src/`) has not changed in any of
these; they're about how it's deployed and reached. Frontend changes are
listed in `../fe/README.md`.

**Private-wealth redesign (frontend only)**
- No API changes. The contact form still has no endpoint here. For now
  the frontend opens a pre-filled email to the firm's inbox instead. A
  future `POST /api/enquiries` (send and/or store) should replace that.
  It will need the same care as client data, since enquiries can include
  investable-asset details.
- The risk profiler's result screen now labels the output a preliminary
  assessment, not a recommendation. The tier logic in
  `src/riskProfiler/` is unchanged.

**SEO audit fixes**
- `robots.txt` (served by the frontend) now has `Disallow: /api/`, so
  search engines don't crawl these endpoints.
- The frontend container's nginx now gzips responses, including JSON
  from `/api/` (`gzip_types` includes `application/json`).
- Prepared, not yet applied (it needs a manual step on the server, see
  `../deploy/README.md`): HTTP/2 on the host nginx, plus a
  `www.rischwealth.com` → `rischwealth.com` redirect. Once that's live,
  every browser request comes from `https://rischwealth.com`, which the
  default `CORS_ORIGIN` already allows.

**Production actually running on Docker**
- Docker Engine + Compose plugin installed on the server
  (`get.docker.com`). The `ubuntu` user is in the `docker` group.
- The host nginx site (`/etc/nginx/sites-available/risch-wealth`) was
  still serving an old static build from `/var/www/risch-wealth`, so
  nothing proxied `/api` and the live risk profiler couldn't reach this
  service. It now proxies everything to the frontend container
  (`127.0.0.1:8080`), which proxies `/api/` and `/health` here. The
  pre-switch config is backed up at `~/risch-wealth-nginx.backup`.
- Check it's live with `curl -s https://rischwealth.com/health`, which
  should return `{"ok":true}`, not HTML.
- Deploy: `git pull && docker compose up -d --build` from the repo root.
  `docker compose restart` doesn't pick up code changes.
