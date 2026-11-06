import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getDatabasePool } from "./database.js";
import { MIGRATION_FILES } from "./migration-files.js";

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
