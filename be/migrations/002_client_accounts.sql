-- Client accounts share the users table with staff. Clients have no
-- employee ID; staff (employee/admin) must have one.

ALTER TABLE users ALTER COLUMN employee_id DROP NOT NULL;

ALTER TABLE users DROP CONSTRAINT users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('client', 'employee', 'admin'));

ALTER TABLE users ADD CONSTRAINT users_staff_have_employee_id
  CHECK (role = 'client' OR employee_id IS NOT NULL);

ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN created_by BIGINT REFERENCES users (id) ON DELETE SET NULL;
