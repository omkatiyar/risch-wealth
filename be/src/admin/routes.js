import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { BCRYPT_COST, EMAIL_RE, requireRole } from '../auth/routes.js';

// Staff account management, for signed-in admins only.
//   GET   /api/admin/staff             list employees and admins
//   POST  /api/admin/staff             { fullName, employeeId, email, password, role }
//   PATCH /api/admin/staff/:id         { status: 'active'|'disabled' }, { role }, or { password } (reset)
// Staff accounts are created active with a password the admin sets and
// shares with the employee.

const router = Router();
router.use(requireRole('admin'));

const EMP_ID_RE = /^[A-Za-z0-9-]{2,20}$/;
const staffRow = (u) => ({
  id: u.id, fullName: u.full_name, employeeId: u.employee_id, email: u.email,
  role: u.role, status: u.status, createdAt: u.created_at, lastLoginAt: u.last_login_at,
});

router.get('/staff', async (req, res, next) => {
  try {
    const { rows } = await query(
      "SELECT * FROM users WHERE role IN ('employee','admin') ORDER BY role, full_name",
    );
    res.json({ staff: rows.map(staffRow) });
  } catch (err) {
    next(err);
  }
});

router.post('/staff', async (req, res, next) => {
  try {
    const fullName = String(req.body?.fullName || '').trim();
    const employeeId = String(req.body?.employeeId || '').trim().toUpperCase();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const role = req.body?.role === 'admin' ? 'admin' : 'employee';

    if (fullName.length < 2 || fullName.length > 120) return res.status(400).json({ error: 'Please enter the full name.' });
    if (!EMP_ID_RE.test(employeeId)) return res.status(400).json({ error: 'Employee ID should be 2–20 letters, numbers or hyphens.' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
    if (password.length < 10 || password.length > 128) return res.status(400).json({ error: 'Password must be at least 10 characters.' });

    const hash = await bcrypt.hash(password, BCRYPT_COST);
    try {
      const { rows } = await query(
        `INSERT INTO users (full_name, employee_id, email, password_hash, role, status, created_by)
         VALUES ($1, $2, $3, $4, $5, 'active', $6) RETURNING *`,
        [fullName, employeeId, email, hash, role, req.user.id],
      );
      return res.status(201).json({ user: staffRow(rows[0]) });
    } catch (err) {
      if (err.code === '23505') return res.status(409).json({ error: 'An account with this email or employee ID already exists.' });
      throw err;
    }
  } catch (err) {
    return next(err);
  }
});

router.patch('/staff/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid account.' });
    if (String(id) === String(req.user.id)) return res.status(400).json({ error: 'You can’t change your own account here.' });

    const { status, role, password } = req.body || {};
    let sql; let value; let signOut = false;
    if (status === 'active' || status === 'disabled') { sql = 'status = $2'; value = status; signOut = status === 'disabled'; }
    else if (role === 'employee' || role === 'admin') { sql = 'role = $2'; value = role; }
    else if (typeof password === 'string') {
      if (password.length < 10 || password.length > 128) return res.status(400).json({ error: 'Password must be at least 10 characters.' });
      sql = 'password_hash = $2'; value = await bcrypt.hash(password, BCRYPT_COST); signOut = true;
    } else return res.status(400).json({ error: 'Nothing to change.' });

    const { rows } = await query(
      `UPDATE users SET ${sql}, updated_at = now() WHERE id = $1 AND role IN ('employee','admin') RETURNING *`,
      [id, value],
    );
    if (!rows.length) return res.status(404).json({ error: 'Account not found.' });
    if (signOut) await query('DELETE FROM sessions WHERE user_id = $1', [id]);
    return res.json({ user: staffRow(rows[0]) });
  } catch (err) {
    return next(err);
  }
});

export default router;
