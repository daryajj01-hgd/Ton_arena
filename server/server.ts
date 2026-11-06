import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { checkDatabaseConnection, closeDatabasePool, upsertPlayer } from "./database.js";
import { createPlayerSession, findPlayerBySession, revokePlayerSession } from "./sessions.js";
import { getLeaderboard, getPlayerProgress, startBrainSprint, submitBrainSprintAnswer } from "./game-sessions.js";
import { validateTelegramInitData } from "./telegram-auth.js";
import { isRateLimited } from "./rate-limit.js";
import { runStartupMigrations } from "./auto-migrate.js";

const PORT = Number(process.env.PORT ?? 3001);
const MAX_BODY_BYTES = 16 * 1024;


const STATIC_MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

async function serveFrontend(request: IncomingMessage, response: ServerResponse): Promise<boolean> {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  if (pathname.startsWith("/api/")) return false;

  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return false;
  }

  const distRoot = resolve(process.cwd(), "dist");
  const requestedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const filePath = resolve(distRoot, `.${requestedPath}`);
  if (filePath !== distRoot && !filePath.startsWith(`${distRoot}${sep}`)) return false;

  let content: Buffer;
  let resolvedPath = filePath;
  try {
    content = await readFile(filePath);
  } catch {
    if (extname(requestedPath)) return false;
    resolvedPath = resolve(distRoot, "index.html");
    try {
      content = await readFile(resolvedPath);
    } catch {
      return false;
    }
  }

  const extension = extname(resolvedPath).toLowerCase();
  const isHtml = extension === ".html";
  response.writeHead(200, {
    "content-type": STATIC_MIME_TYPES[extension] ?? "application/octet-stream",
    "cache-control": isHtml ? "no-cache" : "public, max-age=31536000, immutable",
    "x-content-type-options": "nosniff"
  });
  response.end(request.method === "HEAD" ? undefined : content);
  return true;
}

function sendJson(response: ServerResponse, status: number, payload: unknown, extraHeaders: Record<string, string> = {}): void {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    ...extraHeaders
  });
  response.end(JSON.stringify(payload));
}



function getClientIp(request: IncomingMessage): string {
  if (process.env.TRUST_PROXY === "true") {
    const forwardedFor = request.headers["x-forwarded-for"];
    if (typeof forwardedFor === "string") {
      const forwardedIps = forwardedFor.split(",").map((value) => value.trim()).filter(Boolean);
      const trustedProxyClientIp = forwardedIps[0];
      if (trustedProxyClientIp && trustedProxyClientIp.length <= 128) return trustedProxyClientIp;
    }
  }
  return request.socket.remoteAddress ?? "unknown";
}

function rejectIfRateLimited(
  response: ServerResponse,
  key: string,
  maximumRequests: number,
  windowMs: number
): boolean {
  if (!isRateLimited(key, maximumRequests, windowMs)) return false;
  sendJson(response, 429, { ok: false, error: "RATE_LIMITED" }, {
    "retry-after": String(Math.ceil(windowMs / 1000))
  });
  return true;
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

const server = createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, { ok: true, service: "ton-arena-api" });
    return;
  }

  if (request.method === "GET" && request.url === "/ready") {
    try {
      await checkDatabaseConnection();
      sendJson(response, 200, { ok: true, service: "ton-arena-api", database: "ready" });
    } catch {
      sendJson(response, 503, { ok: false, error: "DATABASE_NOT_READY" });
    }
    return;
  }

  if (request.method === "POST" && request.url === "/api/auth/telegram") {
    if (rejectIfRateLimited(response, `auth:${getClientIp(request)}`, 10, 60_000)) return;
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
        sendJson(response, 503, { ok: false, error: code });
        return;
      }

      let session;
      try {
        session = await createPlayerSession(player);
      } catch {
        sendJson(response, 503, { ok: false, error: "SESSION_CREATION_FAILED" });
        return;
      }

      sendJson(response, 200, {
        ok: true,
        authenticated: true,
        session: {
          token: session.token,
          expiresAt: session.expiresAt.toISOString()
        },
        player: {
          id: player.id,
          telegramId: player.telegram_id,
          firstName: player.first_name,
          username: player.username
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

  if (request.method === "GET" && request.url === "/api/me") {
    const authorization = request.headers.authorization ?? "";
    const match = /^Bearer ([A-Za-z0-9_-]{40,60})$/.exec(authorization);
    if (!match) {
      sendJson(response, 401, { ok: false, error: "UNAUTHENTICATED" });
      return;
    }

    try {
      const player = await findPlayerBySession(match[1]);
      if (!player) {
        sendJson(response, 401, { ok: false, error: "SESSION_INVALID_OR_EXPIRED" });
        return;
      }
      if (rejectIfRateLimited(response, `profile:${player.id}`, 60, 60_000)) return;
      sendJson(response, 200, {
        ok: true,
        player: {
          id: player.id,
          telegramId: player.telegram_id,
          firstName: player.first_name,
          username: player.username
        }
      });
    } catch {
      sendJson(response, 503, { ok: false, error: "SESSION_SERVICE_UNAVAILABLE" });
    }
    return;
  }

  if (request.method === "GET" && request.url === "/api/progress") {
    const authorization = request.headers.authorization ?? "";
    const match = /^Bearer ([A-Za-z0-9_-]{40,60})$/.exec(authorization);
    if (!match) {
      sendJson(response, 401, { ok: false, error: "UNAUTHENTICATED" });
      return;
    }
    try {
      const player = await findPlayerBySession(match[1]);
      if (!player) {
        sendJson(response, 401, { ok: false, error: "SESSION_INVALID_OR_EXPIRED" });
        return;
      }
      if (rejectIfRateLimited(response, `progress:${player.id}`, 60, 60_000)) return;
      const progress = await getPlayerProgress(player.id);
      sendJson(response, 200, { ok: true, progress });
    } catch {
      sendJson(response, 503, { ok: false, error: "PROGRESS_SERVICE_UNAVAILABLE" });
    }
    return;
  }

  if (request.method === "GET" && request.url === "/api/leaderboard") {
    const authorization = request.headers.authorization ?? "";
    const match = /^Bearer ([A-Za-z0-9_-]{40,60})$/.exec(authorization);
    if (!match) {
      sendJson(response, 401, { ok: false, error: "UNAUTHENTICATED" });
      return;
    }
    try {
      const player = await findPlayerBySession(match[1]);
      if (!player) {
        sendJson(response, 401, { ok: false, error: "SESSION_INVALID_OR_EXPIRED" });
        return;
      }
      if (rejectIfRateLimited(response, `leaderboard:${player.id}`, 30, 60_000)) return;
      const leaderboard = await getLeaderboard(10);
      sendJson(response, 200, { ok: true, leaderboard });
    } catch {
      sendJson(response, 503, { ok: false, error: "LEADERBOARD_UNAVAILABLE" });
    }
    return;
  }

  if (request.method === "POST" && request.url === "/api/auth/logout") {
    const authorization = request.headers.authorization ?? "";
    const match = /^Bearer ([A-Za-z0-9_-]{40,60})$/.exec(authorization);
    if (!match) {
      sendJson(response, 401, { ok: false, error: "UNAUTHENTICATED" });
      return;
    }
    try {
      await revokePlayerSession(match[1]);
      sendJson(response, 200, { ok: true, loggedOut: true });
    } catch {
      sendJson(response, 503, { ok: false, error: "SESSION_SERVICE_UNAVAILABLE" });
    }
    return;
  }

  if (request.method === "POST" && request.url === "/api/games/brain-sprint/start") {
    const authorization = request.headers.authorization ?? "";
    const match = /^Bearer ([A-Za-z0-9_-]{40,60})$/.exec(authorization);
    if (!match) {
      sendJson(response, 401, { ok: false, error: "UNAUTHENTICATED" });
      return;
    }
    try {
      const player = await findPlayerBySession(match[1]);
      if (!player) {
        sendJson(response, 401, { ok: false, error: "SESSION_INVALID_OR_EXPIRED" });
        return;
      }
      if (rejectIfRateLimited(response, `game-start:${player.id}`, 5, 60_000)) return;
      const game = await startBrainSprint(player.id);
      sendJson(response, 201, { ok: true, game });
    } catch {
      sendJson(response, 503, { ok: false, error: "GAME_SERVICE_UNAVAILABLE" });
    }
    return;
  }

  const answerRoute = request.method === "POST"
    ? /^\/api\/games\/brain-sprint\/([0-9a-f-]{36})\/answer$/.exec(request.url ?? "")
    : null;
  if (answerRoute) {
    const authorization = request.headers.authorization ?? "";
    const authMatch = /^Bearer ([A-Za-z0-9_-]{40,60})$/.exec(authorization);
    if (!authMatch) {
      sendJson(response, 401, { ok: false, error: "UNAUTHENTICATED" });
      return;
    }
    try {
      const player = await findPlayerBySession(authMatch[1]);
      if (!player) {
        sendJson(response, 401, { ok: false, error: "SESSION_INVALID_OR_EXPIRED" });
        return;
      }
      if (rejectIfRateLimited(response, `game-answer:${player.id}`, 30, 60_000)) return;
      const body = await readJsonBody(request);
      if (
        typeof body !== "object" ||
        body === null ||
        !("answerIndex" in body) ||
        !("questionIndex" in body) ||
        typeof body.questionIndex !== "number" ||
        !Number.isInteger(body.questionIndex) ||
        body.questionIndex < 0 ||
        body.questionIndex >= 10 ||
        typeof body.answerIndex !== "number" ||
        !Number.isInteger(body.answerIndex) ||
        body.answerIndex < -1 ||
        body.answerIndex > 3
      ) {
        sendJson(response, 400, { ok: false, error: "INVALID_ANSWER" });
        return;
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
      sendJson(response, statusCode, { ok: result.status === "accepted", result });
    } catch {
      sendJson(response, 503, { ok: false, error: "GAME_SERVICE_UNAVAILABLE" });
    }
    return;
  }

  if (await serveFrontend(request, response)) return;
  sendJson(response, 404, { ok: false, error: "NOT_FOUND" });
});

async function startServer(): Promise<void> {
  await runStartupMigrations();
  server.listen(PORT, "0.0.0.0", () => {
    process.stdout.write(`TON ARENA API listening on port ${PORT}\n`);
  });
}

void startServer().catch(async (error: unknown) => {
  const message = error instanceof Error ? error.message : "UNKNOWN_STARTUP_ERROR";
  process.stderr.write(`TON ARENA startup failed: ${message}\n`);
  await closeDatabasePool().catch(() => undefined);
  process.exitCode = 1;
});
