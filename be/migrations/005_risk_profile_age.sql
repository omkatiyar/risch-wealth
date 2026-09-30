-- The client's age from the risk questionnaire, so a saved assessment's
-- proposal can be downloaded again exactly as it was shown. Assessments
-- saved before this column existed have no age (shown as "—").
ALTER TABLE risk_profiles ADD COLUMN age SMALLINT CHECK (age BETWEEN 18 AND 100);
