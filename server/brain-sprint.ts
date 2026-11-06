export const BRAIN_SPRINT_QUESTION_COUNT = 10;
export const BRAIN_SPRINT_QUESTION_SECONDS = 15;
export const BRAIN_SPRINT_SESSION_SECONDS = 5 * 60;

export function getBrainSprintAnswerKey(): number[] {
  const raw = process.env.BRAIN_SPRINT_ANSWER_KEY;
  if (!raw) throw new Error("BRAIN_SPRINT_ANSWER_KEY_NOT_CONFIGURED");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("BRAIN_SPRINT_ANSWER_KEY_INVALID");
  }

  if (
    !Array.isArray(parsed) ||
    parsed.length !== BRAIN_SPRINT_QUESTION_COUNT ||
    !parsed.every((value) => Number.isInteger(value) && value >= 0 && value <= 3)
  ) {
    throw new Error("BRAIN_SPRINT_ANSWER_KEY_INVALID");
  }

  return parsed as number[];
}

export function evaluateBrainSprintAnswer(
  questionId: number,
  answerIndex: number,
  answerKey: readonly number[]
): boolean {
  if (!Number.isInteger(questionId) || questionId < 0 || questionId >= answerKey.length) {
    return false;
  }
  return Number.isInteger(answerIndex) && answerIndex >= 0 &&
    answerIndex === answerKey[questionId];
}

export function createBrainSprintQuestionOrder(random: () => number = Math.random): number[] {
  const order = Array.from({ length: BRAIN_SPRINT_QUESTION_COUNT }, (_, index) => index);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
  }
  return order;
}

export function calculateBrainSprintXp(score: number): number {
  if (!Number.isInteger(score) || score < 0 || score > BRAIN_SPRINT_QUESTION_COUNT) {
    throw new Error("INVALID_BRAIN_SPRINT_SCORE");
  }
  return 10 + score * 5;
}

export function getPlayerLevelFromXp(xp: number): number {
  if (!Number.isInteger(xp) || xp < 0) throw new Error("INVALID_PLAYER_XP");
  return Math.floor(xp / 100) + 1;
}

export function calculateDailyMissionReward(
  lastBonusDate: string | null,
  today: string,
  yesterday: string,
  previousStreak: number
): { bonusXp: number; streak: number } {
  if (lastBonusDate === today) {
    return { bonusXp: 0, streak: previousStreak };
  }
  if (lastBonusDate === yesterday) {
    return { bonusXp: 20, streak: previousStreak + 1 };
  }
  return { bonusXp: 20, streak: 1 };
}
