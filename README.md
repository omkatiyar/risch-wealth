# RISCH Wealth — rebuild

Modernization of `rischwealth.com` into a full-stack app. This is Phase 1:
migrating the existing static HTML/CSS/JS site (kept untouched as the
reference implementation in `../risch-wealth`) to a React frontend.

```
risch-wealth-new/
├── fe/   React.js frontend — see fe/README.md
└── be/   Node.js backend (not implemented yet) — see be/README.md
```

## Status

- [x] Phase 1 — React frontend migration (`fe/`), 1:1 with the original site
- [ ] Phase 2 — Node.js/Express API (`be/`)
- [ ] Phase 3 — MySQL for client/portfolio/investment/report data
- [ ] Phase 4 — wire the contact form and risk-profiler to the real backend
