-- Client portfolios, built from purchase orders entered by admins.
--
-- `funds` holds ONLY the mutual funds that clients own (a fund is added the
-- first time an order uses it). The daily AMFI NAV import
-- (src/portfolio/amfi.js) updates the NAV of these funds only; the rest of
-- AMFI's file is ignored. Admins search the full AMFI list from an
-- in-memory copy of the file when entering an order, not from the database.

CREATE TABLE funds (
  scheme_code          TEXT          PRIMARY KEY,         -- AMFI scheme code
  name                 TEXT          NOT NULL,
  amc                  TEXT,
  category             TEXT,                               -- e.g. "Equity Scheme - Large Cap Fund"
  asset_class          TEXT          NOT NULL DEFAULT 'Other'
                         CHECK (asset_class IN ('Equity', 'Debt', 'Hybrid', 'Commodities', 'International', 'Other')),
  nav                  NUMERIC(18,4),                      -- latest NAV from AMFI
  nav_date             DATE,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Daily NAV history of those same funds (for the performance chart later).
CREATE TABLE nav_history (
  scheme_code TEXT          NOT NULL REFERENCES funds (scheme_code) ON DELETE CASCADE,
  nav_date    DATE          NOT NULL,
  nav         NUMERIC(18,4) NOT NULL,
  PRIMARY KEY (scheme_code, nav_date)
);

-- Each client's orders. Only 'purchase' for now; the type column lets
-- redemptions, SIPs and switches be added later without reshaping it.
-- Orders are never deleted: a mistake is voided with a reason.
CREATE TABLE transactions (
  id           BIGSERIAL     PRIMARY KEY,
  user_id      BIGINT        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  scheme_code  TEXT          NOT NULL REFERENCES funds (scheme_code),
  type         TEXT          NOT NULL DEFAULT 'purchase' CHECK (type IN ('purchase')),
  trade_date   DATE          NOT NULL,
  amount       NUMERIC(16,2) NOT NULL CHECK (amount > 0),
  nav          NUMERIC(18,4) NOT NULL CHECK (nav > 0),
  units        NUMERIC(18,4) NOT NULL CHECK (units > 0),
  folio        TEXT,
  notes        TEXT,
  status       TEXT          NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'void')),
  void_reason  TEXT,
  voided_by    BIGINT        REFERENCES users (id) ON DELETE SET NULL,
  voided_at    TIMESTAMPTZ,
  created_by   BIGINT        REFERENCES users (id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT now()
);
CREATE INDEX transactions_user_idx ON transactions (user_id, trade_date DESC);
CREATE INDEX transactions_fund_idx ON transactions (scheme_code);

-- One row per NAV import run: when, how many funds updated, any error.
CREATE TABLE nav_imports (
  id            BIGSERIAL   PRIMARY KEY,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at   TIMESTAMPTZ,
  funds_updated INTEGER,
  nav_date      DATE,
  error         TEXT
);
