import { createHash, randomBytes } from "node:crypto";
import { getDatabasePool, type PlayerRecord } from "./database.js";

const SESSION_TTL_DAYS = 7;

export type AuthenticatedPlayer = {
  id: string;
  telegram_id: string;
  first_name: string | null;
  username: string | null;
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPlayerSession(player: PlayerRecord): Promise<{
  token: string;
  expiresAt: Date;
}> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await getDatabasePool().query(
    `INSERT INTO player_sessions (player_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [player.id, hashToken(token), expiresAt]
  );

  return { token, expiresAt };
}

export async function findPlayerBySession(token: string): Promise<AuthenticatedPlayer | null> {
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return null;

  const result = await getDatabasePool().query<AuthenticatedPlayer>(
    `UPDATE player_sessions AS sessions
     SET last_used_at = NOW()
     FROM players
     WHERE sessions.player_id = players.id
       AND sessions.token_hash = $1
       AND sessions.revoked_at IS NULL
       AND sessions.expires_at > NOW()
     RETURNING players.id, players.telegram_id, players.first_name, players.username`,
    [hashToken(token)]
  );

  return result.rows[0] ?? null;
}

export async function revokePlayerSession(token: string): Promise<void> {
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return;
  await getDatabasePool().query(
    `UPDATE player_sessions
     SET revoked_at = NOW()
     WHERE token_hash = $1 AND revoked_at IS NULL`,
    [hashToken(token)]
  );
}
