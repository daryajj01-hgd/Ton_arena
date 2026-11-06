import { createHmac, timingSafeEqual } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

const PORT = Number(process.env.PORT ?? 3001);
const MAX_BODY_BYTES = 16 * 1024;
const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;
const MAX_FUTURE_SKEW_SECONDS = 60;

function sendJson(response: ServerResponse, status: number, payload: unknown): void {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  let body = "";
  for await (const chunk of request) {
    body += chunk.toString();
    if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
      throw new Error("BODY_TOO_LARGE");
    }
  }
  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new Error("INVALID_JSON");
  }
}

function validateTelegramInitData(initData: string, botToken: string): Record<string, unknown> | null {
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
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(authDate) || now - authDate > MAX_AUTH_AGE_SECONDS || authDate - now > MAX_FUTURE_SKEW_SECONDS) {
    return null;
  }

  const userValue = params.get("user");
  if (!userValue) return null;
  try {
    const user: unknown = JSON.parse(userValue);
    if (typeof user !== "object" || user === null || !("id" in user) || typeof user.id !== "number") {
      return null;
    }
    return user as Record<string, unknown>;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, { ok: true, service: "ton-arena-api" });
    return;
  }

  if (request.method === "POST" && request.url === "/api/auth/telegram") {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      sendJson(response, 503, { ok: false, error: "TELEGRAM_AUTH_NOT_CONFIGURED" });
      return;
    }

    try {
      const body = await readJsonBody(request);
      if (typeof body !== "object" || body === null || !("initData" in body) || typeof body.initData !== "string") {
        sendJson(response, 400, { ok: false, error: "INVALID_REQUEST" });
        return;
      }
      const user = validateTelegramInitData(body.initData, botToken);
      if (!user) {
        sendJson(response, 401, { ok: false, error: "INVALID_OR_EXPIRED_TELEGRAM_DATA" });
        return;
      }
      sendJson(response, 200, {
        ok: true,
        authenticated: true,
        player: {
          telegramId: user.id,
          firstName: typeof user.first_name === "string" ? user.first_name : null,
          username: typeof user.username === "string" ? user.username : null
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
      sendJson(response, message === "BODY_TOO_LARGE" ? 413 : 400, {
        ok: false,
        error: message === "BODY_TOO_LARGE" ? "REQUEST_TOO_LARGE" : "INVALID_REQUEST"
      });
    }
    return;
  }

  sendJson(response, 404, { ok: false, error: "NOT_FOUND" });
});

server.listen(PORT, "0.0.0.0", () => {
  process.stdout.write(`TON ARENA API listening on port ${PORT}\n`);
});
