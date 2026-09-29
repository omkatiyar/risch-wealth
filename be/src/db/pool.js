import pg from 'pg';

// One shared connection pool. DATABASE_URL is set by docker-compose.yml
// (or .env when running the backend directly).
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. See be/README.md → Database.');
}

// Return DATE columns (trade dates, NAV dates) as 'YYYY-MM-DD' strings.
// Converting them to JS Dates would shift them by the server's timezone.
pg.types.setTypeParser(pg.types.builtins.DATE, (v) => v);

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
  // An idle client died (e.g. Postgres restarted). The pool replaces it;
  // log instead of crashing the process.
  console.error('Postgres pool error:', err.message);
});

export const query = (text, params) => pool.query(text, params);
