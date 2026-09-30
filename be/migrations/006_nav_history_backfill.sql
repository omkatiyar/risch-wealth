-- How far back nav_history has been filled from AMFI's historical NAV
-- report for each held fund (src/portfolio/history.js). NULL = not yet.
-- The portfolio value chart needs a fund's NAV for every day since the
-- first purchase in it.
ALTER TABLE funds ADD COLUMN history_from DATE;
