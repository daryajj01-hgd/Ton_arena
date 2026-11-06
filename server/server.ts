import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { checkDatabaseConnection, upsertPlayer } from "./database.js";
import { createPlayerSession, findPlayerBySession, revokePlayerSession } from "./sessions.js";
import { getLeaderboard, getPlayerProgress, startBrainSprint, submitBrainSprintAnswer } from "./game-sessions.js";
import { validateTelegramInitData } from "./telegram-auth.js";

const PORT = Number(process.env.PORT ?? 3001);
const MAX_BODY_BYTES = 16 * 1024;

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

  sendJson(response, 404, { ok: false, error: "NOT_FOUND" });
});

server.listen(PORT, "0.0.0.0", () => {
  process.stdout.write(`TON ARENA API listening on port ${PORT}
`);
});
