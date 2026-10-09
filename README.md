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


Venkatesh Varadan - https://www.linkedin.com/in/venkythgreat/

https://www.linkedin.com/in/sriranjan/

https://www.linkedin.com/in/giridhar-vetcha-a68a4525/

https://www.linkedin.com/in/thomas-thomas-7597577/

Mathew Varghese restuarant Liz

https://www.linkedin.com/in/selwyncolaco/

https://www.linkedin.com/in/nikhil-porwal-377718a7/

https://www.linkedin.com/in/jitendra-purswani-b1807212/

https://www.linkedin.com/in/jeevanath-avaroth-b8713b22/

https://www.linkedin.com/in/tushar-jajoo-376295b/

https://www.linkedin.com/in/arti-maheshwari-57322b12/

https://www.linkedin.com/in/sandeep-kumar-jain-22200b280/

aurobindo nayak broadcom 

https://www.linkedin.com/in/korath-abraham-78b78b56/

https://www.linkedin.com/in/shubhrat-agrawal-456a35209/

The 3D ring slider in the hero (RingSlider.jsx). Cards seated round a 3D ring that spun when you dragged it, with the far side showing through the gaps. Early on it carried the four disciplines, and I then rebuilt it on a navy stage.
The seven principles scroll-morph (PrinciplesMorph.jsx). Seven flip cards scattered, lined up, formed a circle, then opened into an arc as you scrolled, and turned over on hover to show each principle.