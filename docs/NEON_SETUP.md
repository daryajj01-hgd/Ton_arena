# Neon PostgreSQL setup

**Provider decision:** Neon is the selected PostgreSQL provider for the TON ARENA MVP.
**Current state:** Application code and migration tooling are prepared. No Neon project, database, or connection secret has been created or connected yet.

## Why Neon

- Managed PostgreSQL, so no server maintenance is needed.
- A free starting tier is suitable for an early prototype, subject to provider limits and current pricing.
- Standard PostgreSQL keeps the application portable if the project later moves providers.

## One-time setup

1. Create a Neon account and a project using the closest available region to the chosen application hosting region.
2. Create or use the default database and role.
3. Copy the pooled or direct PostgreSQL connection string from Neon. Keep it private.
4. Set it as the server-side environment variable `DATABASE_URL`. Use Neon’s SSL-enabled connection string.
5. Set `TELEGRAM_BOT_TOKEN` only as a server-side secret when Telegram authentication is ready.
6. Run `npm run db:migrate` from the repository root. This applies both the player and player-session tables; the SQL uses `IF NOT EXISTS` and can be safely re-run.
7. Start the API and check `GET /ready`. It should return HTTP 200 only when PostgreSQL is reachable.

## Environment variables

See [`.env.example`](../.env.example) for names and placeholder formats. Set `VITE_API_BASE_URL` only if the frontend and API are hosted on different origins; otherwise leave it blank. Never commit a real `.env` file, database URL, or bot token.

## Database behavior

- Telegram IDs are unique; a returning player updates their profile and last-seen timestamp rather than creating a duplicate.
- The API uses parameterized SQL queries.
- The connection pool is intentionally small for the MVP.
- `/health` checks whether the API process is alive.
- `/ready` checks whether the database is reachable.
- Player sessions are seven-day opaque tokens; only SHA-256 hashes are stored. `GET /api/me` checks a session and `POST /api/auth/logout` revokes it.

## Before real users

Configure automated backups/restore expectations, review data retention and deletion, set provider spending/usage alerts where available, and complete browser-side session integration, rate limiting, HTTPS/origin controls, and end-to-end authentication tests. The server session API is implemented but not yet deployed or validated against a live Neon database.
