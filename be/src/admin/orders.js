import { Router } from 'express';
import { pool, query } from '../db/pool.js';
import { requireRole } from '../auth/routes.js';
import { findScheme, refreshHeldNavs, searchSchemes } from '../portfolio/amfi.js';
import { buildPortfolio } from '../portfolio/calc.js';

// Admin order entry for client portfolios (admins only).
//   GET  /api/admin/clients?q=              search client accounts
//   GET  /api/admin/schemes?q=              search AMFI's fund list (in memory)
//   GET  /api/admin/clients/:id/portfolio   holdings + orders for one client
//   POST /api/admin/orders                  { userId, schemeCode, assetClass?, tradeDate, amount, nav, units?, folio?, notes? }
//   POST /api/admin/orders/:id/void         { reason }
//   GET  /api/admin/nav-status              last NAV import
//   POST /api/admin/nav-refresh             run the NAV import now

const router = Router();
router.use(requireRole('admin'));

const ASSET_CLASSES = ['Equity', 'Debt', 'Hybrid', 'Commodities', 'International', 'Other'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

router.get('/clients', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.json({ clients: [] });
    const like = `%${q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`;
    const { rows } = await query(
      `SELECT id, full_name, email, phone FROM users
        WHERE role = 'client' AND status = 'active'
          AND (full_name ILIKE $1 OR email ILIKE $1 OR coalesce(phone, '') ILIKE $1 OR id::text = $2)
        ORDER BY full_name LIMIT 15`,
      [like, q],
    );
    return res.json({ clients: rows.map((r) => ({ id: r.id, fullName: r.full_name, email: r.email, phone: r.phone })) });
  } catch (err) {
    return next(err);
  }
});

router.get('/schemes', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 3) return res.json({ schemes: [] });
    const schemes = await searchSchemes(q, 20);
    // Funds a client already holds keep the asset class stored for them.
    const { rows } = schemes.length
      ? await query('SELECT scheme_code, asset_class FROM funds WHERE scheme_code = ANY($1)', [schemes.map((s) => s.code)])
      : { rows: [] };
    const held = new Map(rows.map((r) => [r.scheme_code, r.asset_class]));
    return res.json({ schemes: schemes.map((s) => ({ ...s, heldAssetClass: held.get(s.code) || null })) });
  } catch (err) {
    return next(Object.assign(err, { status: 502, expose: true, message: 'Could not load the AMFI fund list. Please try again.' }));
  }
});

router.get('/clients/:id/portfolio', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid client.' });
    const { rows: u } = await query("SELECT id, full_name, email FROM users WHERE id = $1 AND role = 'client'", [id]);
    if (!u.length) return res.status(404).json({ error: 'Client not found.' });
    const { rows } = await query(
      `SELECT t.*, f.name AS fund_name, f.amc, f.asset_class, f.nav AS fund_nav, f.nav_date,
              c.full_name AS created_by_name, v.full_name AS voided_by_name
         FROM transactions t JOIN funds f USING (scheme_code)
         LEFT JOIN users c ON c.id = t.created_by LEFT JOIN users v ON v.id = t.voided_by
        WHERE t.user_id = $1 ORDER BY t.trade_date DESC, t.id DESC`,
      [id],
    );
    const active = rows.filter((r) => r.status === 'active');
    return res.json({
      client: { id: u[0].id, fullName: u[0].full_name, email: u[0].email },
      portfolio: buildPortfolio(active),
      orders: rows.map((r) => ({
        id: r.id, fundName: r.fund_name, schemeCode: r.scheme_code, tradeDate: r.trade_date,
        amount: Number(r.amount), nav: Number(r.nav), units: Number(r.units), folio: r.folio, notes: r.notes,
        status: r.status, voidReason: r.void_reason, createdBy: r.created_by_name, createdAt: r.created_at,
        voidedBy: r.voided_by_name, voidedAt: r.voided_at,
      })),
    });
  } catch (err) {
    return next(err);
  }
});

router.post('/orders', async (req, res, next) => {
  const client = await pool.connect();
  try {
    const b = req.body || {};
    const userId = Number(b.userId);
    const schemeCode = String(b.schemeCode || '').trim();
    const tradeDate = String(b.tradeDate || '');
    const amount = Number(b.amount);
    const nav = Number(b.nav);
    const units = b.units === undefined || b.units === '' || b.units === null ? amount / nav : Number(b.units);

    if (!Number.isInteger(userId)) return res.status(400).json({ error: 'Please choose a client.' });
    if (!/^\d+$/.test(schemeCode)) return res.status(400).json({ error: 'Please choose a mutual fund.' });
    if (!DATE_RE.test(tradeDate) || Number.isNaN(Date.parse(tradeDate))) return res.status(400).json({ error: 'Please enter the buying date.' });
    if (new Date(tradeDate) > new Date()) return res.status(400).json({ error: 'The buying date can’t be in the future.' });
    if (!(amount > 0) || amount > 1e11) return res.status(400).json({ error: 'Please enter the amount invested.' });
    if (!(nav > 0) || nav > 1e7) return res.status(400).json({ error: 'Please enter the buying NAV.' });
    if (!(units > 0)) return res.status(400).json({ error: 'Units must be more than zero.' });
    // Units may be overridden to match the statement (stamp duty etc.), but
    // not by more than 1% from amount / NAV — that would be a typo.
    if (Math.abs(units - amount / nav) / (amount / nav) > 0.01) {
      return res.status(400).json({ error: 'Units differ from amount ÷ NAV by more than 1%. Please check the figures.' });
    }
    const assetClass = b.assetClass && ASSET_CLASSES.includes(b.assetClass) ? b.assetClass : null;

    const { rows: u } = await client.query("SELECT id FROM users WHERE id = $1 AND role = 'client'", [userId]);
    if (!u.length) return res.status(404).json({ error: 'Client not found.' });

    // Add the fund to our funds table the first time any client buys it.
    const { rows: existing } = await client.query('SELECT scheme_code FROM funds WHERE scheme_code = $1', [schemeCode]);
    await client.query('BEGIN');
    if (!existing.length) {
      const s = await findScheme(schemeCode);
      if (!s) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'That fund isn’t in AMFI’s current list.' });
      }
      await client.query(
        `INSERT INTO funds (scheme_code, name, amc, category, asset_class, nav, nav_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (scheme_code) DO NOTHING`,
        [s.code, s.name, s.amc, s.category, assetClass || s.suggestedAssetClass, s.nav, s.navDate],
      );
      if (s.nav && s.navDate) {
        await client.query('INSERT INTO nav_history (scheme_code, nav_date, nav) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [s.code, s.navDate, s.nav]);
      }
    }
    // Catch a NAV typed for the wrong fund: no mutual fund's NAV moves 20x
    // either way over the life of an order.
    const { rows: cur } = await client.query('SELECT nav FROM funds WHERE scheme_code = $1', [schemeCode]);
    const current = cur[0] && cur[0].nav !== null ? Number(cur[0].nav) : null;
    if (current && (nav / current > 20 || current / nav > 20)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `The buying NAV (${nav}) is far from this fund’s current NAV (${current}). Please check the fund and the NAV.` });
    }
    if (existing.length && assetClass) {
      await client.query('UPDATE funds SET asset_class = $2, updated_at = now() WHERE scheme_code = $1', [schemeCode, assetClass]);
    }
    const { rows } = await client.query(
      `INSERT INTO transactions (user_id, scheme_code, trade_date, amount, nav, units, folio, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [userId, schemeCode, tradeDate, amount.toFixed(2), nav.toFixed(4), units.toFixed(4),
        String(b.folio || '').trim().slice(0, 40) || null, String(b.notes || '').trim().slice(0, 500) || null, req.user.id],
    );
    await client.query('COMMIT');
    return res.status(201).json({ id: rows[0].id });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    return next(err);
  } finally {
    client.release();
  }
});

router.post('/orders/:id/void', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const reason = String(req.body?.reason || '').trim();
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid order.' });
    if (reason.length < 3) return res.status(400).json({ error: 'Please give a reason for voiding this order.' });
    const { rows } = await query(
      `UPDATE transactions SET status = 'void', void_reason = $2, voided_by = $3, voided_at = now()
        WHERE id = $1 AND status = 'active' RETURNING id`,
      [id, reason.slice(0, 300), req.user.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Order not found or already voided.' });
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

router.get('/nav-status', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT (SELECT row_to_json(i) FROM (SELECT finished_at, funds_updated, nav_date, error FROM nav_imports
                ORDER BY started_at DESC LIMIT 1) i) AS last,
              (SELECT count(*)::int FROM funds) AS funds`,
    );
    res.json({ lastImport: rows[0].last, funds: rows[0].funds });
  } catch (err) {
    next(err);
  }
});

router.post('/nav-refresh', async (req, res, next) => {
  try {
    const r = await refreshHeldNavs();
    res.json(r);
  } catch (err) {
    next(Object.assign(err, { status: 502, expose: true, message: `NAV update failed: ${err.message}` }));
  }
});

export default router;
