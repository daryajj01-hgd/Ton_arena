import assert from "node:assert/strict";
import test from "node:test";
import { clearRateLimitsForTests, isRateLimited } from "../dist-server/rate-limit.js";

test("rate limiter allows requests up to the configured limit", () => {
  clearRateLimitsForTests();
  assert.equal(isRateLimited("player:1", 2, 60_000, 1_000), false);
  assert.equal(isRateLimited("player:1", 2, 60_000, 2_000), false);
  assert.equal(isRateLimited("player:1", 2, 60_000, 3_000), true);
});

test("rate limiter resets after the time window", () => {
  clearRateLimitsForTests();
  assert.equal(isRateLimited("player:2", 1, 1_000, 1_000), false);
  assert.equal(isRateLimited("player:2", 1, 1_000, 1_500), true);
  assert.equal(isRateLimited("player:2", 1, 1_000, 2_001), false);
});

test("rate limits are isolated by key", () => {
  clearRateLimitsForTests();
  assert.equal(isRateLimited("ip:a", 1, 60_000, 1_000), false);
  assert.equal(isRateLimited("ip:b", 1, 60_000, 1_000), false);
  assert.equal(isRateLimited("ip:a", 1, 60_000, 1_001), true);
});
