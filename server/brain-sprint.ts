export const BRAIN_SPRINT_QUESTION_COUNT = 10;
export const BRAIN_SPRINT_QUESTION_SECONDS = 15;
export const BRAIN_SPRINT_SESSION_SECONDS = 5 * 60;

export const BRAIN_SPRINT_ANSWER_KEY = [
  1, // Mars
  2, // Pacific Ocean
  2, // 12 x 8
  1, // Oxygen
  2, // Tokyo
  1, // Platypus
  2, // 1,000 meters
  2, // Nitrogen
  2, // Asia
  1  // 8 minutes
] as const;

export function evaluateBrainSprintAnswer(questionId: number, answerIndex: number): boolean {
  if (!Number.isInteger(questionId) || questionId < 0 || questionId >= BRAIN_SPRINT_ANSWER_KEY.length) {
    return false;
  }
  return Number.isInteger(answerIndex) && answerIndex >= 0 &&
    answerIndex === BRAIN_SPRINT_ANSWER_KEY[questionId];
}

export function createBrainSprintQuestionOrder(random: () => number = Math.random): number[] {
  const order = Array.from({ length: BRAIN_SPRINT_QUESTION_COUNT }, (_, index) => index);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
  }
  return order;
}
