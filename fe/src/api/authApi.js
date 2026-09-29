// Accounts (be/src/auth, be/src/admin). The session is an httpOnly cookie
// set by the API, so nothing is stored in the browser by this code.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function call(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || 'Something went wrong. Please try again.');
    err.status = res.status;
    throw err;
  }
  return body;
}

const post = (path, data) => call(path, { method: 'POST', body: JSON.stringify(data || {}) });

// Clients sign up themselves; staff accounts are created by an admin.
export const signupClient = (data) => post('/auth/signup', data);
export const login = (identifier, password, portal) => post('/auth/login', { identifier, password, portal });
export const logout = () => post('/auth/logout');
export const me = () => call('/auth/me');

// Admin only.
export const listStaff = () => call('/admin/staff');
export const createStaff = (data) => post('/admin/staff', data);
export const updateStaff = (id, data) => call(`/admin/staff/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
