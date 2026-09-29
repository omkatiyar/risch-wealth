-- Client portal data: saved risk-profile results and requests to RISCH.

-- One row per completed risk assessment by a signed-in client. The config
-- version is kept so an old result can still be explained after weights
-- change.
CREATE TABLE risk_profiles (
  id                     BIGSERIAL PRIMARY KEY,
  user_id                BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  config_version         INTEGER     NOT NULL,
  answers                JSONB       NOT NULL,
  time_horizon_score     NUMERIC     NOT NULL,
  risk_preference_score  NUMERIC     NOT NULL,
  tier                   INTEGER     NOT NULL,
  tier_name              TEXT        NOT NULL,
  allocation             JSONB       NOT NULL,
  investment_amount      NUMERIC,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX risk_profiles_user_idx ON risk_profiles (user_id, created_at DESC);

-- Requests a client sends from the portal (review, callback, etc.).
CREATE TABLE client_requests (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  topic       TEXT        NOT NULL,
  message     TEXT        NOT NULL CHECK (length(message) BETWEEN 1 AND 4000),
  status      TEXT        NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX client_requests_user_idx ON client_requests (user_id, created_at DESC);
CREATE INDEX client_requests_status_idx ON client_requests (status, created_at DESC);
