ALTER TABLE player_progress
  ADD COLUMN IF NOT EXISTS daily_streak INTEGER NOT NULL DEFAULT 0
  CHECK (daily_streak >= 0);

ALTER TABLE player_progress
  ADD COLUMN IF NOT EXISTS last_daily_bonus_date DATE;
