// Small admin CLI for staff accounts (there's no admin UI yet).
//   npm run user:list
//   npm run user:approve -- <email or employee ID>
//   npm run user:disable -- <email or employee ID>
//   npm run user:make-admin -- <email or employee ID>
//   npm run user:create-admin -- <employee ID> <email> "<Full Name>"
//     creates an active admin and prints a one-time temporary password
// In production:  docker compose exec backend npm run user:approve -- jane@firm.com

import 'dotenv/config';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

const [cmd, who, ...rest] = process.argv.slice(2);
const find = 'lower(email) = lower($1) OR upper(employee_id) = upper($1)';

async function main() {
  if (cmd === 'list') {
    const { rows } = await pool.query(
      'SELECT id, full_name, employee_id, email, role, status, created_at, last_login_at FROM users ORDER BY created_at',
    );
    console.table(rows);
    return;
  }
  if (cmd === 'create-admin') {
    const [email, ...nameParts] = rest;
    const fullName = nameParts.join(' ').trim();
    if (!who || !email || !fullName) {
      console.error('Usage: npm run user:create-admin -- <employee ID> <email> "<Full Name>"');
      process.exitCode = 1;
      return;
    }
    const tempPassword = crypto.randomBytes(9).toString('base64url');
    const hash = await bcrypt.hash(tempPassword, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (full_name, employee_id, email, password_hash, role, status)
       VALUES ($1, upper($2), lower($3), $4, 'admin', 'active')
       ON CONFLICT DO NOTHING RETURNING full_name, employee_id, email, role, status`,
      [fullName, who, email, hash],
    );
    if (!rows.length) {
      console.error('An account with that email or employee ID already exists. Use user:make-admin and user:approve instead.');
      process.exitCode = 1;
      return;
    }
    console.table(rows);
    console.log(`Temporary password: ${tempPassword}`);
    console.log('Share it privately; it is not stored anywhere in plain text.');
    return;
  }
  const updates = {
    approve: "status = 'active'",
    disable: "status = 'disabled'",
    'make-admin': "role = 'admin'",
  };
  if (!updates[cmd] || !who) {
    console.error('Usage: node src/db/userAdmin.js <list|approve|disable|make-admin> [email or employee ID]');
    process.exitCode = 1;
    return;
  }
  const { rows } = await pool.query(
    `UPDATE users SET ${updates[cmd]}, updated_at = now() WHERE ${find} RETURNING full_name, employee_id, email, role, status`,
    [who],
  );
  if (!rows.length) {
    console.error(`No user found for "${who}".`);
    process.exitCode = 1;
    return;
  }
  if (cmd === 'disable') await pool.query('DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE ' + find + ')', [who]);
  console.table(rows);
}

main().catch((err) => { console.error(err.message); process.exitCode = 1; }).finally(() => pool.end());
