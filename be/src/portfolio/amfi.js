import { query } from '../db/pool.js';
import { backfillHistory } from './history.js';

// AMFI's daily NAV file (every mutual fund scheme in India, one download).
// Two uses:
//   1. search()  — admins find a fund when entering an order. Served from an
//                  in-memory copy of the file; nothing is written to the DB.
//   2. refreshHeldNavs() — once a day, update the NAV of the funds clients
//                  actually hold (the `funds` table) and nothing else.
//
// File format (semicolon-separated, CRLF), with heading lines in between:
//   Scheme Code;ISIN Div Payout/ ISIN Growth;ISIN Div Reinvestment;Scheme Name;Plan;Option;Net Asset Value;Date
//   Open Ended Schemes(Equity Scheme - Large Cap Fund)     <- category heading
//   Axis Mutual Fund                                        <- AMC heading
//   120503;INF846K01EW2;-;Axis Large Cap Fund;Direct Plan;Growth Option;58.1234;29-Sep-2026

const AMFI_URL = process.env.AMFI_NAV_URL || 'https://portal.amfiindia.com/spages/NAVAll.txt';
const CACHE_MS = 6 * 60 * 60 * 1000;
const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

let cache = { at: 0, schemes: null, byCode: null };
let inflight = null;

function toIsoDate(s) {
  const m = /^(\d{2})-([A-Za-z]{3})-(\d{4})$/.exec(s.trim());
  if (!m || !MONTHS[m[2]]) return null;
  return `${m[3]}-${String(MONTHS[m[2]]).padStart(2, '0')}-${m[1]}`;
}

// Best guess at the asset class; the admin confirms it when a fund is
// first added.
export function classify(category = '', name = '') {
  const c = category.toLowerCase();
  const n = name.toLowerCase();
  if (/gold|silver/.test(c) || /\b(gold|silver)\b/.test(n)) return 'Commodities';
  if (/overseas/.test(c) || /nasdaq|s&p 500|\bus\b|u\.s\.|global|international|overseas|world|hang seng|taiwan|japan|china|europe|fang/.test(n)) return 'International';
  if (/hybrid|arbitrage|equity savings|balanced|dynamic asset|multi asset|solution oriented|retirement|children|life cycle/.test(c)) return 'Hybrid';
  if (/debt|gilt|money market|liquid|overnight|income|bond|fixed term|floating|credit risk|dynamic term|constant maturity/.test(c)) return 'Debt';
  if (/equity|elss|growth/.test(c)) return 'Equity';
  if (/index|etf/.test(c)) {
    return /gilt|g-sec|gsec|sdl|bond|debt|crisil ibx|psu|treasury|liquid|money market/.test(n) ? 'Debt' : 'Equity';
  }
  return 'Other';
}

export function parseNavFile(text) {
  const schemes = [];
  let category = null;
  let amc = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const parts = line.split(';');
    if (parts.length >= 8 && /^\d+$/.test(parts[0])) {
      const [code, isinGrowth, isinReinvest, schemeName, plan, option, navStr, dateStr] = parts;
      const nav = Number(navStr);
      const fullName = [schemeName, plan, option].map((x) => x && x.trim()).filter((x) => x && x !== '-').join(' - ');
      schemes.push({
        code,
        name: fullName,
        amc,
        category,
        isin: isinGrowth && isinGrowth !== '-' ? isinGrowth : (isinReinvest && isinReinvest !== '-' ? isinReinvest : null),
        nav: Number.isFinite(nav) && nav > 0 ? nav : null,
        navDate: toIsoDate(dateStr || ''),
      });
    } else if (parts.length === 1) {
      const m = /Schemes?\s*\((.*)\)\s*$/.exec(line);
      if (m) category = m[1].replace(/\s+/g, ' ').trim();
      else amc = line;
    }
  }
  return schemes;
}

async function download() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000);
  try {
    const res = await fetch(AMFI_URL, { signal: controller.signal, headers: { 'User-Agent': 'RISCH-Wealth-NAV/1.0' } });
    if (!res.ok) throw new Error(`AMFI responded ${res.status}`);
    const schemes = parseNavFile(await res.text());
    if (schemes.length < 1000) throw new Error(`AMFI file looked incomplete (${schemes.length} schemes)`);
    cache = { at: Date.now(), schemes, byCode: new Map(schemes.map((s) => [s.code, s])) };
    return cache;
  } finally {
    clearTimeout(timer);
  }
}

// The parsed file, downloaded at most every 6 hours (or when forced).
export async function getAmfi({ force = false } = {}) {
  if (!force && cache.schemes && Date.now() - cache.at < CACHE_MS) return cache;
  if (!inflight) inflight = download().finally(() => { inflight = null; });
  return inflight;
}

// Fund search for the order form: every word must appear in the name,
// AMC, scheme code or ISIN (the ISIN is printed on every client statement,
// and some AMFI rows don't say Direct/Regular in the name).
export async function searchSchemes(q, limit = 20) {
  const norm = (t) => t.toLowerCase().replace(/&/g, ' and ');
  const words = norm(String(q || '')).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const { schemes } = await getAmfi();
  const out = [];
  for (const s of schemes) {
    const hay = norm(`${s.name} ${s.amc || ''} ${s.code} ${s.isin || ''}`);
    if (words.every((w) => hay.includes(w))) {
      out.push({ ...s, suggestedAssetClass: classify(s.category, s.name) });
      if (out.length >= limit) break;
    }
  }
  return out;
}

export async function findScheme(code) {
  const { byCode } = await getAmfi();
  const s = byCode.get(String(code));
  return s ? { ...s, suggestedAssetClass: classify(s.category, s.name) } : null;
}

// Daily job: update NAVs of the funds clients hold, and record history.
export async function refreshHeldNavs() {
  const { rows: run } = await query('INSERT INTO nav_imports DEFAULT VALUES RETURNING id');
  const runId = run[0].id;
  try {
    const { byCode } = await getAmfi({ force: true });
    const { rows: held } = await query('SELECT scheme_code FROM funds');
    let updated = 0;
    let changed = 0; // funds that moved to a newer NAV date
    let latestDate = null;
    for (const { scheme_code: code } of held) {
      const s = byCode.get(code);
      if (!s || s.nav === null || !s.navDate) continue;
      // Same-date rows are rewritten too (AMFI occasionally corrects a
      // NAV); only a newer date counts as "changed".
      const { rows: upd } = await query(
        `UPDATE funds f SET nav = $2, nav_date = $3, updated_at = now()
           FROM (SELECT nav_date AS old FROM funds WHERE scheme_code = $1) o
          WHERE f.scheme_code = $1 AND (f.nav_date IS NULL OR f.nav_date <= $3)
          RETURNING (o.old IS NULL OR o.old < $3) AS newer`,
        [code, s.nav, s.navDate],
      );
      if (upd[0]?.newer) changed += 1;
      await query(
        'INSERT INTO nav_history (scheme_code, nav_date, nav) VALUES ($1, $2, $3) ON CONFLICT (scheme_code, nav_date) DO UPDATE SET nav = EXCLUDED.nav',
        [code, s.navDate, s.nav],
      );
      updated += 1;
      if (!latestDate || s.navDate > latestDate) latestDate = s.navDate;
    }
    await query('UPDATE nav_imports SET finished_at = now(), funds_updated = $2, nav_date = $3 WHERE id = $1', [runId, updated, latestDate]);
    return { fundsUpdated: updated, fundsChanged: changed, navDate: latestDate };
  } catch (err) {
    await query('UPDATE nav_imports SET finished_at = now(), error = $2 WHERE id = $1', [runId, err.message.slice(0, 500)]);
    throw err;
  }
}

// Runs at start-up if the last successful import is over 6 hours old, then
// every 6 hours. AMFI publishes each evening (IST), so this always picks up
// the latest NAV the same night.
export function scheduleNavRefresh() {
  const run = async () => {
    // Past NAVs for the value chart: a no-op once every fund is filled.
    backfillHistory().catch((e) => console.error('NAV history:', e.message));
    try {
      const { rows } = await query(
        "SELECT max(finished_at) AS last FROM nav_imports WHERE error IS NULL AND finished_at > now() - interval '6 hours'",
      );
      if (rows[0].last) return;
      const r = await refreshHeldNavs();
      console.log(`NAV refresh: ${r.fundsUpdated} funds updated (NAV date ${r.navDate || '—'})`);
    } catch (err) {
      console.error('NAV refresh failed:', err.message);
    }
  };
  setTimeout(run, 10_000).unref();
  setInterval(run, 60 * 60 * 1000).unref();
}
