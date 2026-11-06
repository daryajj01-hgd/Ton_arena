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
    "002_create_player_sessions.sql"
  ];
  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 10_000
  });

  try {
    await pool.query(sql);
    process.stdout.write("Database migration 001_create_players completed successfully.\n");
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "UNKNOWN_MIGRATION_ERROR";
  process.stderr.write(`Database migration failed: ${message}\n`);
  process.exitCode = 1;
});
