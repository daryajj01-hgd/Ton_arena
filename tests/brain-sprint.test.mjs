import assert from "node:assert/strict";
import test from "node:test";
import {
  BRAIN_SPRINT_ANSWER_KEY,
  BRAIN_SPRINT_QUESTION_COUNT,
  createBrainSprintQuestionOrder,
  evaluateBrainSprintAnswer
} from "../dist-server/brain-sprint.js";

test("Brain Sprint has ten answer-key entries", () => {
  assert.equal(BRAIN_SPRINT_ANSWER_KEY.length, BRAIN_SPRINT_QUESTION_COUNT);
});

test("question order contains every question exactly once", () => {
  const order = createBrainSprintQuestionOrder(() => 0.37);
  assert.equal(order.length, BRAIN_SPRINT_QUESTION_COUNT);
  assert.deepEqual([...order].sort((a, b) => a - b), Array.from({ length: 10 }, (_, i) => i));
});

test("answer evaluation accepts the correct option only", () => {
  for (const [questionId, correctIndex] of BRAIN_SPRINT_ANSWER_KEY.entries()) {
    assert.equal(evaluateBrainSprintAnswer(questionId, correctIndex), true);
    assert.equal(evaluateBrainSprintAnswer(questionId, (correctIndex + 1) % 4), false);
  }
});

test("invalid question and answer indexes are rejected", () => {
  assert.equal(evaluateBrainSprintAnswer(-1, 0), false);
  assert.equal(evaluateBrainSprintAnswer(10, 0), false);
  assert.equal(evaluateBrainSprintAnswer(0, -1), false);
  assert.equal(evaluateBrainSprintAnswer(0, 4), false);
  assert.equal(evaluateBrainSprintAnswer(0, 1.5), false);
});
