import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireRole } from '../auth/routes.js';

// Staff inbox for requests clients send from the client portal.
//   GET   /api/staff/requests?status=open|in_progress|closed|all
//   PATCH /api/staff/requests/:id   { status }

const router = Router();
router.use(requireRole('employee', 'admin'));

const STATUSES = ['open', 'in_progress', 'closed'];

router.get('/requests', async (req, res, next) => {
  try {
    // Default view: everything not yet closed. 'all' shows history too.
    const filter = req.query.status;
    const where = filter === 'all' ? 'TRUE'
      : STATUSES.includes(filter) ? 'r.status = $1'
        : "r.status <> 'closed'";
    const { rows } = await query(
      `SELECT r.id, r.topic, r.message, r.status, r.created_at, r.updated_at,
              u.full_name AS client_name, u.email AS client_email, u.phone AS client_phone
         FROM client_requests r JOIN users u ON u.id = r.user_id
        WHERE ${where}
        ORDER BY r.created_at DESC LIMIT 200`,
      STATUSES.includes(filter) ? [filter] : [],
    );
    res.json({
      requests: rows.map((r) => ({
        id: r.id, topic: r.topic, message: r.message, status: r.status, createdAt: r.created_at, updatedAt: r.updated_at,
        client: { name: r.client_name, email: r.client_email, phone: r.client_phone },
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/requests/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const status = req.body?.status;
    if (!Number.isInteger(id) || !STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid update.' });
    const { rows } = await query(
      'UPDATE client_requests SET status = $2, updated_at = now() WHERE id = $1 RETURNING id, status',
      [id, status],
    );
    if (!rows.length) return res.status(404).json({ error: 'Request not found.' });
    return res.json({ request: rows[0] });
  } catch (err) {
    return next(err);
  }
});

export default router;
