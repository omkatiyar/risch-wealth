# RISCH Wealth — rebuild

Modernization of `rischwealth.com` into a full-stack app.

```
risch-wealth/
├── fe/                 React.js frontend (Dockerized) — see fe/README.md
├── be/                 Node.js/Express backend (Dockerized) — see be/README.md
├── docker-compose.yml  runs both containers, restart: unless-stopped
└── deploy/             host nginx (TLS) + step-by-step server setup, see deploy/README.md
```

## Production

Hosted on a single Ubuntu server (`80.225.229.175`), behind nginx at
`https://rischwealth.com`. The app itself runs as two Docker containers
(`docker compose up -d --build` — that's the whole deploy command); host
nginx only terminates TLS and proxies everything to the frontend
container. See `deploy/README.md` for the full setup, including the
one-time nginx + DNS + certbot steps.

## Status

- [x] Phase 1 — React frontend migration (`fe/`), 1:1 with the original site
- [~] Phase 2 — Node.js/Express API (`be/`) — started: owns the risk
      profiler's question bank + scoring logic (moved out of `fe/`).
      No auth, no persistence, no other endpoints yet.
- [x] Phase 2.5 — Dockerized `fe` + `be`, orchestrated by
      `docker-compose.yml` with `restart: unless-stopped`; host nginx
      (`deploy/`) only handles TLS + reverse proxy
- [ ] Phase 3 — Postgres for risk-profiler config (versioned) + client/
      portfolio/investment/report data
- [ ] Phase 4 — RBAC (`superAdmin` and others) + a config screen so
      risk-profiler weights can be edited from the frontend instead of
      hard-coded in `be/src/riskProfiler/config.js`
- [ ] Phase 5 — wire the contact form to the real backend
