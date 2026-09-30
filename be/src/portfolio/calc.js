// Portfolio maths from a client's purchase orders and current NAVs.

const DAY_MS = 86_400_000;

// XIRR by bisection on NPV (robust where Newton's method can diverge).
// cashflows: [{ amount, date }] — purchases negative, current value positive.
// Returns an annual rate (0.1482 = 14.82%) or null if it can't be computed.
export function xirr(cashflows) {
  if (cashflows.length < 2) return null;
  const t0 = Math.min(...cashflows.map((c) => c.date.getTime()));
  const years = cashflows.map((c) => (c.date.getTime() - t0) / (365 * DAY_MS));
  if (Math.max(...years) < 1 / 365) return null;
  const npv = (r) => cashflows.reduce((s, c, i) => s + c.amount / (1 + r) ** years[i], 0);
  let lo = -0.9999;
  let hi = 10;
  let fLo = npv(lo);
  const fHi = npv(hi);
  if (!Number.isFinite(fLo) || !Number.isFinite(fHi) || fLo * fHi > 0) return null;
  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + hi) / 2;
    const fMid = npv(mid);
    if (Math.abs(fMid) < 1e-7) return mid;
    if (fLo * fMid < 0) hi = mid;
    else { lo = mid; fLo = fMid; }
  }
  return (lo + hi) / 2;
}

const round = (n, d = 2) => (n === null || n === undefined ? null : Math.round(n * 10 ** d) / 10 ** d);
// XIRR is only meaningful once money has been invested for a while;
// under 30 days it swings wildly, so we show simple return instead.
const MIN_XIRR_DAYS = 30;

// rows: active transactions joined with fund data (see client routes).
export function buildPortfolio(rows, today = new Date()) {
  const byFund = new Map();
  for (const r of rows) {
    const f = byFund.get(r.scheme_code) || {
      schemeCode: r.scheme_code, name: r.fund_name, amc: r.amc, assetClass: r.asset_class,
      nav: r.fund_nav === null ? null : Number(r.fund_nav), navDate: r.nav_date,
      units: 0, invested: 0, flows: [], firstDate: null,
    };
    f.units += Number(r.units);
    f.invested += Number(r.amount);
    f.flows.push({ amount: -Number(r.amount), date: new Date(r.trade_date) });
    if (!f.firstDate || r.trade_date < f.firstDate) f.firstDate = r.trade_date;
    byFund.set(r.scheme_code, f);
  }

  const holdings = [];
  const allFlows = [];
  let invested = 0;
  let current = 0;
  let firstDate = null;
  let navDate = null;

  for (const f of byFund.values()) {
    // No NAV yet (fund just added, import pending): value it at cost.
    const value = f.nav === null ? f.invested : f.units * f.nav;
    const days = (today - new Date(f.firstDate)) / DAY_MS;
    const r = days >= MIN_XIRR_DAYS ? xirr([...f.flows, { amount: value, date: today }]) : null;
    holdings.push({
      schemeCode: f.schemeCode, name: f.name, amc: f.amc, assetClass: f.assetClass,
      units: round(f.units, 4), invested: round(f.invested), nav: f.nav, navDate: f.navDate,
      currentValue: round(value), gain: round(value - f.invested),
      returnPct: f.invested ? round(((value - f.invested) / f.invested) * 100) : null,
      xirr: r === null ? null : round(r * 100),
    });
    invested += f.invested;
    current += value;
    allFlows.push(...f.flows);
    if (!firstDate || f.firstDate < firstDate) firstDate = f.firstDate;
    if (f.navDate && (!navDate || f.navDate > navDate)) navDate = f.navDate;
  }

  holdings.sort((a, b) => b.currentValue - a.currentValue);

  // Per asset class: value, share of the portfolio, and XIRR across all
  // of that class's purchases.
  const classes = new Map();
  for (const f of byFund.values()) {
    const c = classes.get(f.assetClass) || { value: 0, invested: 0, flows: [], firstDate: null };
    c.value += f.nav === null ? f.invested : f.units * f.nav;
    c.invested += f.invested;
    c.flows.push(...f.flows);
    if (!c.firstDate || f.firstDate < c.firstDate) c.firstDate = f.firstDate;
    classes.set(f.assetClass, c);
  }
  const allocation = [...classes.entries()]
    .map(([assetClass, c]) => {
      const r = (today - new Date(c.firstDate)) / DAY_MS >= MIN_XIRR_DAYS ? xirr([...c.flows, { amount: c.value, date: today }]) : null;
      return {
        assetClass, value: round(c.value), invested: round(c.invested),
        pct: current ? round((c.value / current) * 100, 1) : 0, xirr: r === null ? null : round(r * 100),
      };
    })
    .sort((a, b) => b.value - a.value);

  const days = firstDate ? (today - new Date(firstDate)) / DAY_MS : 0;
  const totalXirr = days >= MIN_XIRR_DAYS && current > 0 ? xirr([...allFlows, { amount: current, date: today }]) : null;

  return {
    summary: {
      invested: round(invested),
      currentValue: round(current),
      gain: round(current - invested),
      returnPct: invested ? round(((current - invested) / invested) * 100) : null,
      xirr: totalXirr === null ? null : round(totalXirr * 100),
      sinceDate: firstDate,
      navDate,
    },
    allocation,
    holdings,
  };
}

// Portfolio value over time, for the value chart.
//   txns: active transactions { scheme_code, trade_date, units, amount, nav }
//   navs: nav_history rows { scheme_code, nav_date, nav } for those funds
// One point per NAV date from the first purchase on: value = units held
// that day × that day's NAV (the last known NAV carried over holidays),
// invested = money put in so far. Before a fund has any NAV on record
// it's valued at its buying NAV.
export function buildHistory(txns, navs, today = new Date()) {
  if (!txns.length) return [];
  const byDate = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  const trades = [...txns].sort((a, b) => byDate(a.trade_date, b.trade_date));
  const first = trades[0].trade_date;
  const todayIso = today.toISOString().slice(0, 10);

  const navList = [...navs].sort((a, b) => byDate(a.nav_date, b.nav_date));
  const dates = [...new Set([...navList.map((n) => n.nav_date).filter((d) => d >= first && d <= todayIso), ...trades.map((t) => t.trade_date)])].sort(byDate);

  const units = new Map(); // fund -> units held
  const lastNav = new Map(); // fund -> last NAV seen
  const buyNav = new Map(); // fund -> most recent buying NAV
  let invested = 0;
  let ti = 0;
  let ni = 0;
  const out = [];
  for (const d of dates) {
    while (ni < navList.length && navList[ni].nav_date <= d) {
      lastNav.set(navList[ni].scheme_code, Number(navList[ni].nav));
      ni += 1;
    }
    while (ti < trades.length && trades[ti].trade_date <= d) {
      const t = trades[ti];
      units.set(t.scheme_code, (units.get(t.scheme_code) || 0) + Number(t.units));
      buyNav.set(t.scheme_code, Number(t.nav));
      invested += Number(t.amount);
      ti += 1;
    }
    let value = 0;
    for (const [code, u] of units) value += u * (lastNav.get(code) ?? buyNav.get(code));
    out.push({ date: d, value: Math.round(value * 100) / 100, invested: Math.round(invested * 100) / 100 });
  }
  return out;
}
