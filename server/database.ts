import { Pool } from "pg";

export type PlayerRecord = {
  [column: string]: unknown;
  id: string;
  telegram_id: string;
  first_name: string | null;
  username: string | null;
  created_at: Date;
  last_seen_at: Date;
};

let pool: Pool | undefined;

export function getDatabasePool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000
  });

  pool.on("error", (error: Error) => {
    process.stderr.write(`Unexpected database pool error: ${error.message}\n`);
  });

  return pool;
}

export async function upsertPlayer(input: {
  telegramId: number;
  firstName: string | null;
  username: string | null;
}): Promise<PlayerRecord> {
  const result = await getDatabasePool().query<PlayerRecord>(
    `INSERT INTO players (telegram_id, first_name, username)
     VALUES ($1, $2, $3)
     ON CONFLICT (telegram_id) DO UPDATE SET
       first_name = EXCLUDED.first_name,
       username = EXCLUDED.username,
       updated_at = NOW(),
       last_seen_at = NOW()
     RETURNING id, telegram_id, first_name, username, created_at, last_seen_at`,
    [input.telegramId, input.firstName, input.username]
  );

  const player = result.rows[0];
  if (!player) throw new Error("PLAYER_UPSERT_FAILED");
  return player;
}

export async function checkDatabaseConnection(): Promise<void> {
  await getDatabasePool().query("SELECT 1");
}
