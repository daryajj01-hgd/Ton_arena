CREATE TABLE IF NOT EXISTS player_progress (
  player_id UUID PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  games_played INTEGER NOT NULL DEFAULT 0 CHECK (games_played >= 0),
  total_correct INTEGER NOT NULL DEFAULT 0 CHECK (total_correct >= 0),
  best_score SMALLINT NOT NULL DEFAULT 0 CHECK (best_score BETWEEN 0 AND 10),
  last_game_completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE game_sessions
  ADD COLUMN IF NOT EXISTS xp_awarded INTEGER NOT NULL DEFAULT 0
  CHECK (xp_awarded >= 0);
