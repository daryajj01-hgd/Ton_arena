import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { validateTelegramInitData } from "../dist-server/telegram-auth.js";

const botToken = "test-bot-token:123456";
const nowSeconds = 1_800_000_000;

function signedInitData(user, authDate = nowSeconds) {
  const params = new URLSearchParams({
    auth_date: String(authDate),
    query_id: "test-query",
    user: JSON.stringify(user)
  });
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const hash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  params.set("hash", hash);
  return params.toString();
}

test("accepts correctly signed, recent Telegram initData", () => {
  const initData = signedInitData({ id: 987654321, first_name: "Test", username: "tester" });
  const user = validateTelegramInitData(initData, botToken, nowSeconds);
  assert.equal(user?.id, 987654321);
  assert.equal(user?.first_name, "Test");
});

test("rejects initData whose signed fields were modified", () => {
  const initData = signedInitData({ id: 987654321, first_name: "Test" })
    .replace("first_name%22%3A%22Test", "first_name%22%3A%22Other");
  assert.equal(validateTelegramInitData(initData, botToken, nowSeconds), null);
});

test("rejects expired authentication data", () => {
  const initData = signedInitData({ id: 987654321 }, nowSeconds - 86_401);
  assert.equal(validateTelegramInitData(initData, botToken, nowSeconds), null);
});

test("rejects authentication data too far in the future", () => {
  const initData = signedInitData({ id: 987654321 }, nowSeconds + 61);
  assert.equal(validateTelegramInitData(initData, botToken, nowSeconds), null);
});

test("rejects a signed payload with an invalid Telegram user id", () => {
  const initData = signedInitData({ id: "987654321" });
  assert.equal(validateTelegramInitData(initData, botToken, nowSeconds), null);
});

test("rejects an invalid signature", () => {
  const initData = signedInitData({ id: 987654321 }).replace(/hash=[a-f0-9]/, "hash=0");
  assert.equal(validateTelegramInitData(initData, botToken, nowSeconds), null);
});
