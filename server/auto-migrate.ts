import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getDatabasePool } from "./database.js";

const MIGRATION_FILES = [
  "001_create_players.sql",
  "002_create_player_sessions.sql",
  "003_create_game_sessions.sql",
  "004_create_player_progress.sql",
  "005_add_daily_mission_progress.sql"
];

export async function runStartupMigrations(): Promise<void> {
  if (process.env.AUTO_MIGRATE !== "true") return;

  const pool = getDatabasePool();
  for (const fileName of MIGRATION_FILES) {
    const path = resolve(process.cwd(), "db/migrations", fileName);
    const sql = await readFile(path, "utf8");
    await pool.query(sql);
    process.stdout.write(`Startup migration ${fileName} completed.\n`);
  }
}
