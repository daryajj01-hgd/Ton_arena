# Build Status

**Updated:** 2026-11-06

## Completed in repository
- [x] Vite + React + TypeScript project scaffold.
- [x] English-first responsive interface.
- [x] Initial internationalization foundation with a language selector.
- [x] 11 initial languages: English, Persian, Arabic, Spanish, French, German, Turkish, Russian, Simplified Chinese, Hindi, and Portuguese.
- [x] Localized BRAIN SPRINT interface, questions, answers, and explanations in all 11 initial languages.
- [x] Automatic left-to-right and right-to-left layout direction.
- [x] 15-second countdown, timeout handling, answer feedback, and local score screen.
- [x] Initial Node.js API skeleton with health endpoint.
- [x] Reusable server-side Telegram Mini App initData validator with constant-time signature comparison and strict Telegram user ID validation.
- [x] Automated Node.js tests for valid signatures, tampering, expired/future payloads, invalid user IDs, and invalid signatures.
- [x] Initial PostgreSQL player-table migration and database connection/persistence module.
- [x] Telegram identity verification now upserts the verified player record when the database is configured.
- [x] Separate `/health` liveness and `/ready` database-readiness endpoints.
- [x] Neon selected as the initial managed PostgreSQL provider; setup and secret-handling guide added.
- [x] Repeatable database migration runner and `npm run db:migrate` command.
- [x] `.env.example` documents required server-only environment variable names without real credentials.
- [x] Opaque seven-day player sessions with cryptographically random tokens and hashed database storage.
- [x] Authenticated profile endpoint (`GET /api/me`) and session revocation endpoint (`POST /api/auth/logout`).
- [x] Second repeatable SQL migration for player sessions; migration runner applies both schema files.
- [x] Frontend detects Telegram Mini App launch data, exchanges it for a server session, verifies the session via `/api/me`, and shows the verified player name.
- [x] Server-side Brain Sprint game-session schema with randomized question order, per-question answer records, server timestamps, and authoritative scoring.
- [x] Authenticated API routes to start a Brain Sprint round and submit answers; server enforces the 15-second question window and 5-minute round expiry.
- [x] Unit tests for answer evaluation, invalid answer rejection, randomized question-order integrity, and server-only answer-key validation.
- [x] Removed answer indexes from the current localized frontend question data; server scoring now reads `BRAIN_SPRINT_ANSWER_KEY` from a server-only environment variable and fails closed when missing or invalid.
- [x] Persistent player progression schema for XP, completed games, total correct answers, best score, daily mission completion, and streak.
- [x] Server awards 10 XP for completing a round plus 5 XP per correct answer; the first completed round each UTC day also earns a 20 XP daily mission bonus. Levels advance every 100 XP.
- [x] Authenticated progress API and frontend level/XP display; result screen shows earned and cumulative XP.
- [x] Answer submission includes the expected question index; the server rejects out-of-sequence answers and safely returns prior recorded answers on retries.
- [x] Authenticated top-ten leaderboard endpoint and localized top-five home-screen panel; only first names (not Telegram IDs or usernames) are displayed.
- [x] Daily mission status and consecutive-day streak are shown in the home screen; streaks are tracked by UTC calendar day.
- [x] Frontend session token is kept in memory only; a fresh Telegram launch re-authenticates rather than persisting a bearer token in browser storage.
- [x] CI runs frontend type-checking, backend compilation, Telegram authentication tests, and frontend production build as separate steps.
- [x] Automated GitHub Actions workflow with separate frontend type-check, backend TypeScript compilation, and frontend production-build steps.

## Important limitations
- The product is still an MVP prototype: Telegram Mini App play now uses server-issued game sessions and server-side scoring, while non-Telegram browser preview remains local.
- Language preference is now saved in browser localStorage and should survive page reloads on the same browser/device; this has been verified in source code but not yet tested in a live browser.
- Translations are initial product copy and should receive native-speaker review before public launch.
- The 11-language foundation is extensible; it does not mean every world language has been added.
- In a verified Telegram Mini App session, submitted answers and score are processed by the server; the browser timer is a display aid and the server enforces the question and round deadlines. Outside Telegram, the app still offers a local preview.
- Neon has been selected, but no Neon project/account has been created or connected and the migration has not been applied. Player persistence is therefore not live yet.
- Frontend Telegram sign-in and server game API integration are implemented in source. They still need a live Mini App end-to-end test against a provisioned database and deployed API. Do not consider authentication production-ready.
- Server-side Brain Sprint sessions, scoring, XP, daily mission, and leaderboard code passed GitHub Actions. These features cannot run against real players until Neon is provisioned and all five migrations are applied. Earlier public commits exposed the prototype answer indexes, so this question set must be replaced before competitive public launch.
- XP, daily mission, and leaderboard features are implemented in code but are not live until Neon is connected and migrations are applied. Rate limiting and full anti-cheat controls are not yet implemented.
- GitHub Actions completed successfully on commit `252a35c51e37aa6a13160da49dafa54ece3fef54`, including frontend type-check, backend compilation, Telegram auth/game logic tests, and frontend production build. This validates the code build, not a live Telegram/Neon deployment.
- Do not use this prototype for paid play, prizes, or competitive rankings.

## Next milestone
1. Create and connect the Neon project; apply migrations 001–005.
2. Configure the Telegram bot token and `BRAIN_SPRINT_ANSWER_KEY` as server-only secrets, then deploy the API.
3. Test Telegram sign-in, full Brain Sprint rounds, XP, daily mission, and leaderboard against the live database.
4. Replace the prototype question bank with fresh questions and protected answer keys before competitive launch.
5. Add rate limiting, stronger anti-cheat controls, and operational monitoring.
6. Verify language switching, RTL/LTR, and accessibility on real mobile devices.
