import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Pool } from "pg";
import { MIGRATION_FILES } from "./migration-files.js";

async function main(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_NOT_CONFIGURED: set DATABASE_URL before running migrations");
  }

  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 10_000
  });

  try {
    for (const fileName of MIGRATION_FILES) {
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
