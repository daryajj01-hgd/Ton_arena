# Neon PostgreSQL setup

**Provider decision:** Neon is the selected PostgreSQL provider for the TON ARENA MVP.
**Current state:** Application code and migration tooling are prepared. No Neon project, database, or connection secret has been created or connected yet.

## Why Neon

- Managed PostgreSQL, so no server maintenance is needed.
- A free starting tier is suitable for an early prototype, subject to provider limits and current pricing.
- Standard PostgreSQL keeps the application portable if the project later moves providers.

## One-time setup

1. Create a Neon account and a project in Frankfurt (`eu-central-1`) to match the Render staging service region.
2. Create or use the default database and role.
3. Copy the pooled PostgreSQL connection string from Neon’s Connect panel (choose the pooled option). Keep it private.
4. Set it as the server-side environment variable `DATABASE_URL`. Use Neon’s SSL-enabled connection string.
5. Set `TELEGRAM_BOT_TOKEN` only as a server-side secret when Telegram authentication is ready.
6. Set `BRAIN_SPRINT_ANSWER_KEY` as a server-only JSON array containing ten correct option indexes (each from 0 to 3). Never use a `VITE_` prefix or expose this value to the frontend. The game start endpoint fails closed if this secret is missing or invalid.
7. The Render staging Blueprint sets `AUTO_MIGRATE=true`, so the service applies migrations before accepting traffic. For other deployments, run `node dist-server/migrate.js` from the application container (or `npm run db:migrate` from the repository root during development). This applies migrations 001–005: player, player-session, game-session, player-progress, and daily mission tracking schema. The SQL uses `IF NOT EXISTS` and can be safely re-run.
8. Start the API and check `GET /ready`. It should return HTTP 200 only when PostgreSQL is reachable.

## Environment variables

See [`.env.example`](../.env.example) for names and placeholder formats. Set `VITE_API_BASE_URL` only if the frontend and API are hosted on different origins; otherwise leave it blank. Never commit a real `.env` file, database URL, bot token, or answer-key secret.

## Database behavior

- Telegram IDs are unique; a returning player updates their profile and last-seen timestamp rather than creating a duplicate.
- The API uses parameterized SQL queries.
- The connection pool is intentionally small for the MVP.
- `/health` checks whether the API process is alive.
- `/ready` checks whether the database is reachable.
- Player sessions are seven-day opaque tokens; only SHA-256 hashes are stored. `GET /api/me` checks a session and `POST /api/auth/logout` revokes it.
- Player progression is stored in `player_progress`; completing a round awards 10 XP plus 5 XP per correct answer, with a level increase every 100 XP. The first completed round each UTC day adds a 20 XP daily mission bonus and updates the consecutive-day streak. `GET /api/progress` returns saved totals and daily mission state.
- Brain Sprint game rounds are created by `POST /api/games/brain-sprint/start`; submit each selected answer to `POST /api/games/brain-sprint/:sessionId/answer` using the session bearer token.

## Before real users

Configure automated backups/restore expectations, review data retention and deletion, set provider spending/usage alerts where available, and complete rate limiting, HTTPS/origin controls, and end-to-end authentication tests. Frontend Telegram authentication and server-authoritative game API integration are implemented but not yet validated against a live Neon database.


## Question-bank security note

The current localized question prompts and choices are shipped to the client, but answer indexes are no longer included in the current frontend bundle or server source. The answer key is loaded only from `BRAIN_SPRINT_ANSWER_KEY`. Earlier public Git commits contained the prototype answer indexes, so this exact prototype question set must be replaced with a fresh question bank before any competitive public launch; moving the current key to a secret alone does not erase its historical exposure.
