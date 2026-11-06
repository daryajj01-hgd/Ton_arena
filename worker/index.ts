import {
  checkDatabaseConnection,
  upsertPlayer
} from "../server/database.js";
import {
  createPlayerSession,
  findPlayerBySession,
  revokePlayerSession
} from "../server/sessions.js";
import {
  getLeaderboard,
  getPlayerProgress,
  startBrainSprint,
  submitBrainSprintAnswer
} from "../server/game-sessions.js";
import { validateTelegramInitData } from "../server/telegram-auth.js";
import { isRateLimited } from "../server/rate-limit.js";

interface Env {
  HYPERDRIVE: { connectionString: string };
  ASSETS: { fetch(request: Request): Promise<Response> };
  TELEGRAM_BOT_TOKEN: string;
  BRAIN_SPRINT_ANSWER_KEY: string;
}

const MAX_BODY_BYTES = 16 * 1024;

function json(status: number, payload: unknown, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...extraHeaders
    }
  });
}

function rateLimited(key: string, maximumRequests: number, windowMs: number): Response | null {
  if (!isRateLimited(key, maximumRequests, windowMs)) return null;
  return json(429, { ok: false, error: "RATE_LIMITED" }, {
    "retry-after": String(Math.ceil(windowMs / 1000))
  });
}

async function readJsonBody(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) throw new Error("BODY_TOO_LARGE");
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) throw new Error("BODY_TOO_LARGE");
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error("INVALID_JSON");
  }
}

function getSessionToken(request: Request): string | null {
  const match = /^Bearer ([A-Za-z0-9_-]{40,60})$/.exec(request.headers.get("authorization") ?? "");
  return match?.[1] ?? null;
}

function publicPlayer(player: {
  id: string;
  telegram_id: string;
  first_name: string | null;
  username: string | null;
}) {
  return {
    id: player.id,
    telegramId: player.telegram_id,
    firstName: player.first_name,
    username: player.username
  };
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (method === "GET" && path === "/health") {
    return json(200, { ok: true, service: "ton-arena-api" });
  }

  if (method === "GET" && path === "/ready") {
    try {
      await checkDatabaseConnection();
      return json(200, { ok: true, service: "ton-arena-api", database: "ready" });
    } catch {
      return json(503, { ok: false, error: "DATABASE_NOT_READY" });
    }
  }

  if (method === "POST" && path === "/api/auth/telegram") {
    const clientIp = request.headers.get("cf-connecting-ip") ?? "unknown";
    const limited = rateLimited(`auth:${clientIp}`, 10, 60_000);
    if (limited) return limited;
    if (!env.TELEGRAM_BOT_TOKEN) {
      return json(503, { ok: false, error: "TELEGRAM_AUTH_NOT_CONFIGURED" });
    }
    try {
      const body = await readJsonBody(request);
      if (typeof body !== "object" || body === null || !("initData" in body) || typeof body.initData !== "string") {
        return json(400, { ok: false, error: "INVALID_REQUEST" });
      }
      const user = validateTelegramInitData(body.initData, env.TELEGRAM_BOT_TOKEN);
      if (!user) return json(401, { ok: false, error: "INVALID_OR_EXPIRED_TELEGRAM_DATA" });

      let player;
      try {
        player = await upsertPlayer({
          telegramId: user.id as number,
          firstName: typeof user.first_name === "string" ? user.first_name : null,
          username: typeof user.username === "string" ? user.username : null
        });
      } catch (error) {
        const code = error instanceof Error && error.message === "DATABASE_NOT_CONFIGURED"
          ? "PLAYER_STORAGE_NOT_CONFIGURED"
          : "PLAYER_STORAGE_UNAVAILABLE";
        return json(503, { ok: false, error: code });
      }

      let session;
      try {
        session = await createPlayerSession(player);
      } catch {
        return json(503, { ok: false, error: "SESSION_CREATION_FAILED" });
      }

      return json(200, {
        ok: true,
        authenticated: true,
        session: { token: session.token, expiresAt: session.expiresAt.toISOString() },
        player: publicPlayer(player)
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
      return json(message === "BODY_TOO_LARGE" ? 413 : 400, {
        ok: false,
        error: message === "BODY_TOO_LARGE" ? "REQUEST_TOO_LARGE" : "INVALID_REQUEST"
      });
    }
  }

  if (method === "GET" && path === "/api/me") {
    const token = getSessionToken(request);
    if (!token) return json(401, { ok: false, error: "UNAUTHENTICATED" });
    try {
      const player = await findPlayerBySession(token);
      if (!player) return json(401, { ok: false, error: "SESSION_INVALID_OR_EXPIRED" });
      const limited = rateLimited(`profile:${player.id}`, 60, 60_000);
      if (limited) return limited;
      return json(200, { ok: true, player: publicPlayer(player) });
    } catch {
      return json(503, { ok: false, error: "SESSION_SERVICE_UNAVAILABLE" });
    }
  }

  if (method === "GET" && path === "/api/progress") {
    const token = getSessionToken(request);
    if (!token) return json(401, { ok: false, error: "UNAUTHENTICATED" });
    try {
      const player = await findPlayerBySession(token);
      if (!player) return json(401, { ok: false, error: "SESSION_INVALID_OR_EXPIRED" });
      const limited = rateLimited(`progress:${player.id}`, 60, 60_000);
      if (limited) return limited;
      return json(200, { ok: true, progress: await getPlayerProgress(player.id) });
    } catch {
      return json(503, { ok: false, error: "PROGRESS_SERVICE_UNAVAILABLE" });
    }
  }

  if (method === "GET" && path === "/api/leaderboard") {
    const token = getSessionToken(request);
    if (!token) return json(401, { ok: false, error: "UNAUTHENTICATED" });
    try {
      const player = await findPlayerBySession(token);
      if (!player) return json(401, { ok: false, error: "SESSION_INVALID_OR_EXPIRED" });
      const limited = rateLimited(`leaderboard:${player.id}`, 30, 60_000);
      if (limited) return limited;
      return json(200, { ok: true, leaderboard: await getLeaderboard(10) });
    } catch {
      return json(503, { ok: false, error: "LEADERBOARD_UNAVAILABLE" });
    }
  }

  if (method === "POST" && path === "/api/auth/logout") {
    const token = getSessionToken(request);
    if (!token) return json(401, { ok: false, error: "UNAUTHENTICATED" });
    try {
      await revokePlayerSession(token);
      return json(200, { ok: true, loggedOut: true });
    } catch {
      return json(503, { ok: false, error: "SESSION_SERVICE_UNAVAILABLE" });
    }
  }

  if (method === "POST" && path === "/api/games/brain-sprint/start") {
    const token = getSessionToken(request);
    if (!token) return json(401, { ok: false, error: "UNAUTHENTICATED" });
    try {
      const player = await findPlayerBySession(token);
      if (!player) return json(401, { ok: false, error: "SESSION_INVALID_OR_EXPIRED" });
      const limited = rateLimited(`game-start:${player.id}`, 5, 60_000);
      if (limited) return limited;
      return json(201, { ok: true, game: await startBrainSprint(player.id) });
    } catch {
      return json(503, { ok: false, error: "GAME_SERVICE_UNAVAILABLE" });
    }
  }

  const answerRoute = method === "POST"
    ? /^\/api\/games\/brain-sprint\/([0-9a-f-]{36})\/answer$/.exec(path)
    : null;
  if (answerRoute) {
    const token = getSessionToken(request);
    if (!token) return json(401, { ok: false, error: "UNAUTHENTICATED" });
    try {
      const player = await findPlayerBySession(token);
      if (!player) return json(401, { ok: false, error: "SESSION_INVALID_OR_EXPIRED" });
      const limited = rateLimited(`game-answer:${player.id}`, 30, 60_000);
      if (limited) return limited;
      const body = await readJsonBody(request);
      if (
        typeof body !== "object" || body === null ||
        !("answerIndex" in body) || !("questionIndex" in body) ||
        typeof body.questionIndex !== "number" || !Number.isInteger(body.questionIndex) ||
        body.questionIndex < 0 || body.questionIndex >= 10 ||
        typeof body.answerIndex !== "number" || !Number.isInteger(body.answerIndex) ||
        body.answerIndex < -1 || body.answerIndex > 3
      ) {
        return json(400, { ok: false, error: "INVALID_ANSWER" });
      }
      const result = await submitBrainSprintAnswer({
        playerId: player.id,
        sessionId: answerRoute[1],
        questionIndex: body.questionIndex,
        answerIndex: body.answerIndex
      });
      const statusCode = result.status === "not_found" ? 404
        : result.status === "expired" ? 410
        : result.status === "completed" ? 409
        : result.status === "invalid_question" ? 400
        : 200;
      return json(statusCode, { ok: result.status === "accepted", result });
    } catch {
      return json(503, { ok: false, error: "GAME_SERVICE_UNAVAILABLE" });
    }
  }

  return json(404, { ok: false, error: "NOT_FOUND" });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Hyperdrive provides the pooled PostgreSQL connection string at runtime.
    // Keep it out of source control and out of all logs.
    process.env.DATABASE_URL = env.HYPERDRIVE.connectionString;
    process.env.TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
    process.env.BRAIN_SPRINT_ANSWER_KEY = env.BRAIN_SPRINT_ANSWER_KEY;

    const path = new URL(request.url).pathname;
    if (path === "/health" || path === "/ready" || path.startsWith("/api/")) {
      try {
        return await handleApi(request, env);
      } catch {
        return json(500, { ok: false, error: "INTERNAL_SERVER_ERROR" });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
