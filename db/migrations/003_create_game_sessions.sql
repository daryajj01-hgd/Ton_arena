CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game_code VARCHAR(40) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  question_order SMALLINT[] NOT NULL,
  current_question_index SMALLINT NOT NULL DEFAULT 0 CHECK (current_question_index >= 0),
  score SMALLINT NOT NULL DEFAULT 0 CHECK (score >= 0),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  question_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  CHECK (expires_at > started_at)
);
CREATE INDEX IF NOT EXISTS game_sessions_player_recent_idx ON game_sessions (player_id, started_at DESC);
CREATE INDEX IF NOT EXISTS game_sessions_active_expiry_idx ON game_sessions (expires_at) WHERE status = 'active';
CREATE TABLE IF NOT EXISTS game_session_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  question_index SMALLINT NOT NULL CHECK (question_index >= 0),
  question_id SMALLINT NOT NULL CHECK (question_id >= 0),
  answer_index SMALLINT NOT NULL CHECK (answer_index BETWEEN -1 AND 3),
  is_correct BOOLEAN NOT NULL,
  response_ms INTEGER NOT NULL CHECK (response_ms >= 0),
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (game_session_id, question_index)
);
CREATE INDEX IF NOT EXISTS game_session_answers_session_idx ON game_session_answers (game_session_id, question_index);
