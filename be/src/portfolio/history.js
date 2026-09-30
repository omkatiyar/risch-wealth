import { query } from '../db/pool.js';

// Fills nav_history with past NAVs for the funds clients hold, from AMFI's
// historical NAV report (the same public source as the daily file, no
// account or key). It's downloaded per fund house (AMC) for a date range;
// only the rows for held funds are kept.
//
//   https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=<AMC code>&tp=1&frmdt=01-Jan-2025&todt=31-Dec-2025
//
// A fund needs history back to its first purchase; funds.history_from
// records how far back it has been filled.

const HIST_URL = process.env.AMFI_HISTORY_URL || 'https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MON_NUM = Object.fromEntries(MONTHS.map((m, i) => [m, i + 1]));
const DAY_MS = 86_400_000;
const WINDOW_DAYS = 365; // one request per year of history

// AMFI's fund-house codes (September 2026). A fund house that isn't listed
// here is looked up once by scanning the codes (see findAmcCode).
const AMC_CODES = {
  'aditya birla sun life mutual fund': 3,
  'baroda bnp paribas mutual fund': 4,
  'dsp mutual fund': 6,
  'hdfc mutual fund': 9,
  'quant mutual fund': 13,
  'jm financial mutual fund': 16,
  'kotak mahindra mutual fund': 17,
  'lic mutual fund': 18,
  'icici prudential mutual fund': 20,
  'nippon india mutual fund': 21,
  'sbi mutual fund': 22,
  'tata mutual fund': 25,
  'taurus mutual fund': 26,
  'franklin templeton mutual fund': 27,
  'uti mutual fund': 28,
  'canara robeco mutual fund': 32,
  'sundaram mutual fund': 33,
  'hsbc mutual fund': 37,
  'quantum mutual fund': 41,
  'invesco mutual fund': 42,
  'mirae asset mutual fund': 45,
  'bank of india mutual fund': 46,
  'edelweiss mutual fund': 47,
  'bandhan mutual fund': 48,
  'axis mutual fund': 53,
  'navi mutual fund': 54,
  'motilal oswal mutual fund': 55,
  'pgim india mutual fund': 58,
  'union mutual fund': 61,
  '360 one mutual fund': 62,
  'groww mutual fund': 63,
  'ppfas mutual fund': 64,
  'shriram mutual fund': 67,
  'mahindra manulife mutual fund': 69,
  'iti mutual fund': 70,
  'whiteoak capital mutual fund': 71,
  'trust mutual fund': 72,
  'nj mutual fund': 73,
  'samco mutual fund': 74,
  'bajaj finserv mutual fund': 75,
  'helios mutual fund': 76,
  'zerodha mutual fund': 77,
  'old bridge mutual fund': 78,
  'unifi mutual fund': 79,
  'angel one mutual fund': 80,
  'capitalmind mutual fund': 81,
  'jio blackrock mutual fund': 82,
  'the wealth company mutual fund': 83,
  'choice mutual fund': 84,
  'abakkus mutual fund': 85,
  'alphagrep mutual fund': 86,
  'ask mutual fund': 87,
  'lakshya mutual fund': 88,
  'monarch mutual fund': 89,
};
const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();

let discovered = null; // name -> code, from a one-off scan
async function findAmcCode(amc) {
  const name = norm(amc);
  if (AMC_CODES[name]) return AMC_CODES[name];
  if (!discovered) {
    discovered = {};
    const probe = fmt(new Date(Date.now() - 7 * DAY_MS));
    for (let code = 1; code <= 150; code += 1) {
      if (Object.values(AMC_CODES).includes(code)) continue;
      try {
        const text = await download(code, probe, probe);
        const line = text.split(/\r?\n/).map((l) => l.trim()).find((l) => l && !l.includes(';') && /mutual fund/i.test(l));
        if (line) discovered[norm(line)] = code;
      } catch { /* skip */ }
    }
  }
  return discovered[name] || null;
}

function fmt(d) {
  return `${String(d.getUTCDate()).padStart(2, '0')}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
}
const isoOf = (d) => d.toISOString().slice(0, 10);

async function download(code, from, to) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120_000);
  try {
    const url = `${HIST_URL}?mf=${code}&tp=1&frmdt=${from}&todt=${to}`;
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'RISCH-Wealth-NAV/1.0' } });
    if (!res.ok) throw new Error(`AMFI history responded ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

// Rows for the wanted scheme codes only.
// Format: Scheme Code;Scheme Name;Plan;Option;ISIN;ISIN;Net Asset Value;Date
export function parseHistory(text, wanted) {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const p = raw.trim().split(';');
    if (p.length < 8 || !wanted.has(p[0])) continue;
    const nav = Number(p[p.length - 2]);
    const m = /^(\d{2})-([A-Za-z]{3})-(\d{4})$/.exec(p[p.length - 1].trim());
    if (!(nav > 0) || !m || !MON_NUM[m[2]]) continue;
    out.push({ code: p[0], date: `${m[3]}-${String(MON_NUM[m[2]]).padStart(2, '0')}-${m[1]}`, nav });
  }
  return out;
}

let running = null;

// Fill whatever is missing. Safe to call often: it does nothing when
// every held fund already has history back to its first purchase.
export function backfillHistory() {
  if (!running) running = run().finally(() => { running = null; });
  return running;
}

async function run() {
  const { rows } = await query(
    `SELECT f.scheme_code, f.amc, f.history_from, min(t.trade_date) AS first
       FROM funds f JOIN transactions t USING (scheme_code)
      WHERE t.status = 'active'
      GROUP BY f.scheme_code
     HAVING f.history_from IS NULL OR min(t.trade_date) < f.history_from`,
  );
  if (!rows.length) return { funds: 0, rows: 0 };

  const byAmc = new Map();
  for (const r of rows) {
    const list = byAmc.get(r.amc) || [];
    list.push(r);
    byAmc.set(r.amc, list);
  }

  let inserted = 0;
  let done = 0;
  for (const [amc, funds] of byAmc) {
    const code = await findAmcCode(amc);
    if (!code) { console.error(`NAV history: no AMFI code for "${amc}"`); continue; }
    // A week before the first purchase, so a purchase on a holiday still
    // has the NAV before it; up to the day before what's already filled.
    const from = new Date(Math.min(...funds.map((f) => Date.parse(f.first))) - 7 * DAY_MS);
    const upto = new Date(Math.min(Date.now(), ...funds.map((f) => (f.history_from ? Date.parse(f.history_from) - DAY_MS : Date.now()))));
    const wanted = new Set(funds.map((f) => f.scheme_code));
    try {
      for (let start = from; start <= upto; start = new Date(start.getTime() + WINDOW_DAYS * DAY_MS)) {
        const end = new Date(Math.min(upto.getTime(), start.getTime() + (WINDOW_DAYS - 1) * DAY_MS));
        const hist = parseHistory(await download(code, fmt(start), fmt(end)), wanted);
        if (hist.length) {
          const r = await query(
            `INSERT INTO nav_history (scheme_code, nav_date, nav)
             SELECT * FROM unnest($1::text[], $2::date[], $3::numeric[])
             ON CONFLICT (scheme_code, nav_date) DO NOTHING`,
            [hist.map((h) => h.code), hist.map((h) => h.date), hist.map((h) => h.nav)],
          );
          inserted += r.rowCount;
        }
      }
      await query(
        'UPDATE funds SET history_from = LEAST(coalesce(history_from, $2::date), $2::date) WHERE scheme_code = ANY($1)',
        [[...wanted], isoOf(from)],
      );
      done += wanted.size;
    } catch (err) {
      console.error(`NAV history for ${amc} failed: ${err.message}`);
    }
  }
  console.log(`NAV history: ${done} fund(s) filled, ${inserted} NAVs added`);
  return { funds: done, rows: inserted };
}
