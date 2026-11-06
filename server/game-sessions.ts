import { getDatabasePool } from "./database.js";
import {
  getBrainSprintAnswerKey,
  BRAIN_SPRINT_QUESTION_COUNT,
  BRAIN_SPRINT_QUESTION_SECONDS,
  BRAIN_SPRINT_SESSION_SECONDS,
  createBrainSprintQuestionOrder,
  evaluateBrainSprintAnswer,
  calculateBrainSprintXp,
  getPlayerLevelFromXp,
  calculateDailyMissionReward
} from "./brain-sprint.js";

type GameSessionRow = {
  [column: string]: unknown;
  id: string;
  question_order: number[];
  current_question_index: number;
  score: number;
  status: "active" | "completed" | "expired";
  question_started_at: Date;
  expires_at: Date;
  xp_awarded: number;
};

export async function startBrainSprint(playerId: string): Promise<{
  sessionId: string;
  questionOrder: number[];
  expiresAt: string;
}> {
  getBrainSprintAnswerKey(); // Fail closed if the server-only answer key is not configured.
  const questionOrder = createBrainSprintQuestionOrder();
  const expiresAt = new Date(Date.now() + BRAIN_SPRINT_SESSION_SECONDS * 1000);
  const result = await getDatabasePool().query<{ id: string }>(
    `INSERT INTO game_sessions (player_id, game_code, question_order, expires_at)
     VALUES ($1, 'brain_sprint', $2, $3)
     RETURNING id`,
    [playerId, questionOrder, expiresAt]
  );
  const row = result.rows[0];
  if (!row) throw new Error("GAME_SESSION_CREATE_FAILED");
  return { sessionId: row.id, questionOrder, expiresAt: expiresAt.toISOString() };
}

export type BrainSprintAnswerResult =
  | { status: "not_found" | "expired" | "completed" | "invalid_question" }
  | {
      status: "accepted";
      isCorrect: boolean;
      correctAnswerIndex: number;
      score: number;
      answeredQuestionIndex: number;
      completed: boolean;
      nextQuestionIndex: number;
      xpEarned: number;
      totalXp: number | null;
      level: number | null;
      dailyStreak: number | null;
      dailyMissionCompleteToday: boolean;
    };

export async function submitBrainSprintAnswer(input: {
  playerId: string;
  sessionId: string;
  questionIndex: number;
  answerIndex: number;
}): Promise<BrainSprintAnswerResult> {
  if (
    !Number.isInteger(input.questionIndex) ||
    input.questionIndex < 0 ||
    input.questionIndex >= BRAIN_SPRINT_QUESTION_COUNT ||
    !Number.isInteger(input.answerIndex) ||
    input.answerIndex < -1 ||
    input.answerIndex > 3
  ) {
    return { status: "invalid_question" };
  }

  const answerKey = getBrainSprintAnswerKey();
  const pool = getDatabasePool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query<GameSessionRow>(
      `SELECT id, question_order, current_question_index, score, status,
              question_started_at, expires_at, xp_awarded
       FROM game_sessions
       WHERE id = $1 AND player_id = $2 AND game_code = 'brain_sprint'
       FOR UPDATE`,
      [input.sessionId, input.playerId]
    );
    const session = result.rows[0];
    if (!session) {
      await client.query("ROLLBACK");
      return { status: "not_found" };
    }
    if (input.questionIndex < session.current_question_index) {
      const priorResult = await client.query<{ question_id: number; is_correct: boolean }>(
        `SELECT question_id, is_correct
         FROM game_session_answers
         WHERE game_session_id = $1 AND question_index = $2`,
        [input.sessionId, input.questionIndex]
      );
      const prior = priorResult.rows[0];
      if (!prior) {
        await client.query("ROLLBACK");
        return { status: "invalid_question" };
      }
      const scoreResult = await client.query<{ score: number }>(
        `SELECT COUNT(*)::int AS score
         FROM game_session_answers
         WHERE game_session_id = $1 AND question_index <= $2 AND is_correct = TRUE`,
        [input.sessionId, input.questionIndex]
      );
      const completed = session.status === "completed" && input.questionIndex === BRAIN_SPRINT_QUESTION_COUNT - 1;
      let totalXp: number | null = null;
      let level: number | null = null;
      let dailyStreak: number | null = null;
      let dailyMissionCompleteToday = false;
      if (completed) {
        const progressResult = await client.query<{
          xp: number;
          daily_streak: number;
          daily_mission_complete_today: boolean;
        }>(
          `SELECT xp, daily_streak,
                  (last_daily_bonus_date = (NOW() AT TIME ZONE 'UTC')::date) AS daily_mission_complete_today
           FROM player_progress
           WHERE player_id = $1`,
          [input.playerId]
        );
        totalXp = progressResult.rows[0]?.xp ?? 0;
        dailyStreak = progressResult.rows[0]?.daily_streak ?? 0;
        dailyMissionCompleteToday = progressResult.rows[0]?.daily_mission_complete_today ?? false;
        level = getPlayerLevelFromXp(totalXp);
      }
      await client.query("COMMIT");
      return {
        status: "accepted",
        isCorrect: prior.is_correct,
        correctAnswerIndex: answerKey[prior.question_id],
        score: scoreResult.rows[0]?.score ?? 0,
        answeredQuestionIndex: input.questionIndex,
        completed,
        nextQuestionIndex: input.questionIndex + 1,
        xpEarned: completed ? session.xp_awarded : 0,
        totalXp,
        level,
        dailyStreak,
        dailyMissionCompleteToday
      };
    }
    if (session.status === "completed" || input.questionIndex !== session.current_question_index) {
      await client.query("ROLLBACK");
      return { status: session.status === "completed" ? "completed" : "invalid_question" };
    }
    if (session.status !== "active" || new Date(session.expires_at).getTime() <= Date.now()) {
      await client.query(
        "UPDATE game_sessions SET status = 'expired' WHERE id = $1 AND status = 'active'",
        [input.sessionId]
      );
      await client.query("COMMIT");
      return { status: "expired" };
    }

    const questionIndex = session.current_question_index;
    const questionId = session.question_order[questionIndex];
    if (
      questionIndex >= BRAIN_SPRINT_QUESTION_COUNT ||
      input.questionIndex !== questionIndex ||
      !Number.isInteger(questionId) ||
      questionId < 0 ||
      questionId >= answerKey.length
    ) {
      await client.query("ROLLBACK");
      return { status: "invalid_question" };
    }

    const elapsedMs = Math.max(0, Date.now() - new Date(session.question_started_at).getTime());
    const timedOut = elapsedMs > BRAIN_SPRINT_QUESTION_SECONDS * 1000;
    const acceptedAnswer = timedOut ? -1 : input.answerIndex;
    const isCorrect = evaluateBrainSprintAnswer(questionId, acceptedAnswer, answerKey);
    const responseMs = Math.min(elapsedMs, BRAIN_SPRINT_QUESTION_SECONDS * 1000);
    const nextQuestionIndex = questionIndex + 1;
    const completed = nextQuestionIndex >= BRAIN_SPRINT_QUESTION_COUNT;
    const newScore = session.score + (isCorrect ? 1 : 0);

    await client.query(
      `INSERT INTO game_session_answers
       (game_session_id, question_index, question_id, answer_index, is_correct, response_ms)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [input.sessionId, questionIndex, questionId, acceptedAnswer, isCorrect, responseMs]
    );
    const baseXp = completed ? calculateBrainSprintXp(newScore) : 0;
    let xpEarned = 0;
    let totalXp: number | null = null;
    let level: number | null = null;
    let dailyStreak: number | null = null;

    if (completed) {
      // Serialize completions for this player so two simultaneous rounds cannot claim the daily bonus twice.
      await client.query("SELECT id FROM players WHERE id = $1 FOR UPDATE", [input.playerId]);
      const dateResult = await client.query<{ today: string; yesterday: string }>(
        `SELECT
           TO_CHAR((NOW() AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS today,
           TO_CHAR((NOW() AT TIME ZONE 'UTC')::date - 1, 'YYYY-MM-DD') AS yesterday`
      );
      const today = dateResult.rows[0]?.today;
      const yesterday = dateResult.rows[0]?.yesterday;
      if (!today || !yesterday) throw new Error("DAILY_MISSION_DATE_UNAVAILABLE");

      const existingProgress = await client.query<{
        xp: number;
        games_played: number;
        total_correct: number;
        best_score: number;
        daily_streak: number;
        last_daily_bonus_date: string | null;
      }>(
        `SELECT xp, games_played, total_correct, best_score,
                daily_streak, last_daily_bonus_date
         FROM player_progress
         WHERE player_id = $1
         FOR UPDATE`,
        [input.playerId]
      );
      const previous = existingProgress.rows[0];
      const dailyReward = calculateDailyMissionReward(
        previous?.last_daily_bonus_date ?? null,
        today,
        yesterday,
        previous?.daily_streak ?? 0
      );
      dailyStreak = dailyReward.streak;
      xpEarned = baseXp + dailyReward.bonusXp;

      if (previous) {
        const progressResult = await client.query<{ xp: number }>(
          `UPDATE player_progress
           SET xp = xp + $2,
               games_played = games_played + 1,
               total_correct = total_correct + $3,
               best_score = GREATEST(best_score, $3),
               last_game_completed_at = NOW(),
               daily_streak = $4,
               last_daily_bonus_date = $5,
               updated_at = NOW()
           WHERE player_id = $1
           RETURNING xp`,
          [input.playerId, xpEarned, newScore, dailyStreak, today]
        );
        totalXp = progressResult.rows[0]?.xp ?? xpEarned;
      } else {
        const progressResult = await client.query<{ xp: number }>(
          `INSERT INTO player_progress
           (player_id, xp, games_played, total_correct, best_score,
            last_game_completed_at, daily_streak, last_daily_bonus_date)
           VALUES ($1, $2, 1, $3, $3, NOW(), $4, $5)
           RETURNING xp`,
          [input.playerId, xpEarned, newScore, dailyStreak, today]
        );
        totalXp = progressResult.rows[0]?.xp ?? xpEarned;
      }
      level = getPlayerLevelFromXp(totalXp);
    }

    await client.query(
      `UPDATE game_sessions
       SET current_question_index = $2,
           score = $3,
           question_started_at = NOW(),
           status = $4,
           completed_at = CASE WHEN $4 = 'completed' THEN NOW() ELSE NULL END,
           xp_awarded = $5
       WHERE id = $1`,
      [input.sessionId, nextQuestionIndex, newScore, completed ? "completed" : "active", xpEarned]
    );
    await client.query("COMMIT");

    return {
      status: "accepted",
      isCorrect,
      correctAnswerIndex: answerKey[questionId],
      score: newScore,
      answeredQuestionIndex: questionIndex,
      completed,
      nextQuestionIndex,
      xpEarned,
      totalXp,
      level,
      dailyStreak,
      dailyMissionCompleteToday: completed
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export type PlayerProgress = {
  xp: number;
  level: number;
  gamesPlayed: number;
  totalCorrect: number;
  bestScore: number;
  dailyStreak: number;
  dailyMissionCompleteToday: boolean;
};

export async function getPlayerProgress(playerId: string): Promise<PlayerProgress> {
  const result = await getDatabasePool().query<{
    xp: number;
    games_played: number;
    total_correct: number;
    best_score: number;
    daily_streak: number;
    daily_mission_complete_today: boolean;
  }>(
    `SELECT xp, games_played, total_correct, best_score, daily_streak,
            (last_daily_bonus_date = (NOW() AT TIME ZONE 'UTC')::date) AS daily_mission_complete_today
     FROM player_progress
     WHERE player_id = $1`,
    [playerId]
  );
  const row = result.rows[0];
  const xp = row?.xp ?? 0;
  return {
    xp,
    level: getPlayerLevelFromXp(xp),
    gamesPlayed: row?.games_played ?? 0,
    totalCorrect: row?.total_correct ?? 0,
    bestScore: row?.best_score ?? 0,
    dailyStreak: row?.daily_streak ?? 0,
    dailyMissionCompleteToday: row?.daily_mission_complete_today ?? false
  };
}

export type LeaderboardEntry = {
  rank: number;
  displayName: string;
  xp: number;
  level: number;
  gamesPlayed: number;
  bestScore: number;
};

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const safeLimit = Math.min(20, Math.max(1, Math.floor(limit)));
  const result = await getDatabasePool().query<{
    rank: number;
    display_name: string;
    xp: number;
    games_played: number;
    best_score: number;
  }>(
    `SELECT
       ROW_NUMBER() OVER (
         ORDER BY progress.xp DESC,
                  progress.best_score DESC,
                  progress.games_played DESC,
                  progress.last_game_completed_at ASC
       )::int AS rank,
       COALESCE(NULLIF(BTRIM(players.first_name), ''), 'Arena Player') AS display_name,
       progress.xp,
       progress.games_played,
       progress.best_score
     FROM player_progress AS progress
     INNER JOIN players ON players.id = progress.player_id
     ORDER BY progress.xp DESC,
              progress.best_score DESC,
              progress.games_played DESC,
              progress.last_game_completed_at ASC
     LIMIT $1`,
    [safeLimit]
  );

  return result.rows.map((row) => ({
    rank: row.rank,
    displayName: row.display_name,
    xp: row.xp,
    level: getPlayerLevelFromXp(row.xp),
    gamesPlayed: row.games_played,
    bestScore: row.best_score
  }));
}
