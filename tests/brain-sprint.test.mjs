import assert from "node:assert/strict";
import test from "node:test";
import {
  BRAIN_SPRINT_QUESTION_COUNT,
  createBrainSprintQuestionOrder,
  calculateBrainSprintXp,
  getPlayerLevelFromXp,
  calculateDailyMissionReward,
  evaluateBrainSprintAnswer,
  getBrainSprintAnswerKey
} from "../dist-server/brain-sprint.js";

const TEST_ANSWER_KEY = [1, 2, 2, 1, 2, 1, 2, 2, 2, 1];

test("question order contains every question exactly once", () => {
  const order = createBrainSprintQuestionOrder(() => 0.37);
  assert.equal(order.length, BRAIN_SPRINT_QUESTION_COUNT);
  assert.deepEqual([...order].sort((a, b) => a - b), Array.from({ length: 10 }, (_, i) => i));
});

test("answer evaluation accepts the correct option only", () => {
  for (const [questionId, correctIndex] of TEST_ANSWER_KEY.entries()) {
    assert.equal(evaluateBrainSprintAnswer(questionId, correctIndex, TEST_ANSWER_KEY), true);
    assert.equal(evaluateBrainSprintAnswer(questionId, (correctIndex + 1) % 4, TEST_ANSWER_KEY), false);
  }
});

test("invalid question and answer indexes are rejected", () => {
  assert.equal(evaluateBrainSprintAnswer(-1, 0, TEST_ANSWER_KEY), false);
  assert.equal(evaluateBrainSprintAnswer(10, 0, TEST_ANSWER_KEY), false);
  assert.equal(evaluateBrainSprintAnswer(0, -1, TEST_ANSWER_KEY), false);
  assert.equal(evaluateBrainSprintAnswer(0, 4, TEST_ANSWER_KEY), false);
  assert.equal(evaluateBrainSprintAnswer(0, 1.5, TEST_ANSWER_KEY), false);
});

test("answer key is read from server environment and validated", () => {
  const original = process.env.BRAIN_SPRINT_ANSWER_KEY;
  try {
    delete process.env.BRAIN_SPRINT_ANSWER_KEY;
    assert.throws(() => getBrainSprintAnswerKey(), /NOT_CONFIGURED/);
    process.env.BRAIN_SPRINT_ANSWER_KEY = JSON.stringify(TEST_ANSWER_KEY);
    assert.deepEqual(getBrainSprintAnswerKey(), TEST_ANSWER_KEY);
    process.env.BRAIN_SPRINT_ANSWER_KEY = JSON.stringify([0, 1]);
    assert.throws(() => getBrainSprintAnswerKey(), /INVALID/);
  } finally {
    if (original === undefined) delete process.env.BRAIN_SPRINT_ANSWER_KEY;
    else process.env.BRAIN_SPRINT_ANSWER_KEY = original;
  }
});

test("completed rounds award participation and performance XP", () => {
  assert.equal(calculateBrainSprintXp(0), 10);
  assert.equal(calculateBrainSprintXp(5), 35);
  assert.equal(calculateBrainSprintXp(10), 60);
  assert.throws(() => calculateBrainSprintXp(11), /INVALID/);
});

test("player levels advance for each 100 XP", () => {
  assert.equal(getPlayerLevelFromXp(0), 1);
  assert.equal(getPlayerLevelFromXp(99), 1);
  assert.equal(getPlayerLevelFromXp(100), 2);
  assert.equal(getPlayerLevelFromXp(250), 3);
  assert.throws(() => getPlayerLevelFromXp(-1), /INVALID/);
});

test("daily mission rewards once per UTC day and builds consecutive streaks", () => {
  assert.deepEqual(calculateDailyMissionReward(null, "2026-11-06", "2026-11-05", 0), {
    bonusXp: 20,
    streak: 1
  });
  assert.deepEqual(calculateDailyMissionReward("2026-11-06", "2026-11-06", "2026-11-05", 3), {
    bonusXp: 0,
    streak: 3
  });
  assert.deepEqual(calculateDailyMissionReward("2026-11-05", "2026-11-06", "2026-11-05", 3), {
    bonusXp: 20,
    streak: 4
  });
  assert.deepEqual(calculateDailyMissionReward("2026-11-01", "2026-11-06", "2026-11-05", 4), {
    bonusXp: 20,
    streak: 1
  });
});
