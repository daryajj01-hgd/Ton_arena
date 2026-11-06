import { getDatabasePool } from "./database.js";
import {
  getBrainSprintAnswerKey,
  BRAIN_SPRINT_QUESTION_COUNT,
  BRAIN_SPRINT_QUESTION_SECONDS,
  BRAIN_SPRINT_SESSION_SECONDS,
  createBrainSprintQuestionOrder,
  evaluateBrainSprintAnswer,
  calculateBrainSprintXp,
  getPlayerLevelFromXp
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
    };

export async function submitBrainSprintAnswer(input: {
  playerId: string;
  sessionId: string;
  answerIndex: number;
}): Promise<BrainSprintAnswerResult> {
  if (!Number.isInteger(input.answerIndex) || input.answerIndex < -1 || input.answerIndex > 3) {
    return { status: "invalid_question" };
  }

  const answerKey = getBrainSprintAnswerKey();
  const pool = getDatabasePool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query<GameSessionRow>(
      `SELECT id, question_order, current_question_index, score, status,
              question_started_at, expires_at
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
    if (session.status === "completed") {
      await client.query("ROLLBACK");
      return { status: "completed" };
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
    const xpEarned = completed ? calculateBrainSprintXp(newScore) : 0;
    let totalXp: number | null = null;
    let level: number | null = null;

    if (completed) {
      const progressResult = await client.query<{ xp: number }>(
        `INSERT INTO player_progress
         (player_id, xp, games_played, total_correct, best_score, last_game_completed_at)
         VALUES ($1, $2, 1, $3, $3, NOW())
         ON CONFLICT (player_id) DO UPDATE SET
           xp = player_progress.xp + EXCLUDED.xp,
           games_played = player_progress.games_played + 1,
           total_correct = player_progress.total_correct + EXCLUDED.total_correct,
           best_score = GREATEST(player_progress.best_score, EXCLUDED.best_score),
           last_game_completed_at = NOW(),
           updated_at = NOW()
         RETURNING xp`,
        [input.playerId, xpEarned, newScore]
      );
      totalXp = progressResult.rows[0]?.xp ?? xpEarned;
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
      level
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
};

export async function getPlayerProgress(playerId: string): Promise<PlayerProgress> {
  const result = await getDatabasePool().query<{
    xp: number;
    games_played: number;
    total_correct: number;
    best_score: number;
  }>(
    `SELECT xp, games_played, total_correct, best_score
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
    bestScore: row?.best_score ?? 0
  };
}
