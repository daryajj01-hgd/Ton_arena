import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Pool } from "pg";

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_NOT_CONFIGURED: set DATABASE_URL before running migrations");
  }

  const migrationFiles = [
    "001_create_players.sql",
    "002_create_player_sessions.sql",
    "003_create_game_sessions.sql",
    "004_create_player_progress.sql"
  ];
  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 10_000
  });

  try {
    for (const fileName of migrationFiles) {
      const migrationPath = resolve(process.cwd(), "db/migrations", fileName);
      const sql = await readFile(migrationPath, "utf8");
      await pool.query(sql);
      process.stdout.write(`Database migration ${fileName} completed successfully.\n`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "UNKNOWN_MIGRATION_ERROR";
  process.stderr.write(`Database migration failed: ${message}\n`);
  process.exitCode = 1;
});
