-- Staff accounts for the employee sign-in, and their login sessions.

CREATE TABLE users (
  id             BIGSERIAL PRIMARY KEY,
  full_name      TEXT        NOT NULL CHECK (length(trim(full_name)) BETWEEN 2 AND 120),
  employee_id    TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  password_hash  TEXT        NOT NULL,
  role           TEXT        NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'admin')),
  -- New sign-ups start as 'pending' and can't log in until approved
  -- (npm run user:approve). 'disabled' blocks an existing account.
  status         TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'disabled')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at  TIMESTAMPTZ
);

-- Case-insensitive uniqueness; values are also stored normalised by the API.
CREATE UNIQUE INDEX users_email_key       ON users (lower(email));
CREATE UNIQUE INDEX users_employee_id_key ON users (upper(employee_id));

-- Only a SHA-256 hash of each session token is stored, so a database leak
-- doesn't hand out live sessions.
CREATE TABLE sessions (
  token_hash   TEXT        PRIMARY KEY,
  user_id      BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at   TIMESTAMPTZ NOT NULL,
  ip           TEXT,
  user_agent   TEXT
);

CREATE INDEX sessions_user_id_idx    ON sessions (user_id);
CREATE INDEX sessions_expires_at_idx ON sessions (expires_at);
