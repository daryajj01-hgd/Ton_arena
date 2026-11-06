import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;
const MAX_FUTURE_SKEW_SECONDS = 60;

export function validateTelegramInitData(
  initData: string,
  botToken: string,
  nowSeconds = Math.floor(Date.now() / 1000)
): Record<string, unknown> | null {
  if (!initData || !botToken) return null;

  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");
  if (!receivedHash || !/^[a-f0-9]{64}$/i.test(receivedHash)) return null;

  const fields = [...params.entries()]
    .filter(([key]) => key !== "hash")
    .sort(([a], [b]) => a.localeCompare(b));
  const dataCheckString = fields.map(([key, value]) => `${key}=${value}`).join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const calculatedHash = createHmac("sha256", secretKey).update(dataCheckString).digest();
  const suppliedHash = Buffer.from(receivedHash, "hex");
  if (suppliedHash.length !== calculatedHash.length || !timingSafeEqual(suppliedHash, calculatedHash)) {
    return null;
  }

  const authDate = Number(params.get("auth_date"));
  if (
    !Number.isSafeInteger(authDate) ||
    nowSeconds - authDate > MAX_AUTH_AGE_SECONDS ||
    authDate - nowSeconds > MAX_FUTURE_SKEW_SECONDS
  ) {
    return null;
  }

  const userValue = params.get("user");
  if (!userValue) return null;
  try {
    const user: unknown = JSON.parse(userValue);
    if (
      typeof user !== "object" ||
      user === null ||
      !("id" in user) ||
      typeof user.id !== "number" ||
      !Number.isSafeInteger(user.id) ||
      user.id <= 0
    ) {
      return null;
    }
    return user as Record<string, unknown>;
  } catch {
    return null;
  }
}
