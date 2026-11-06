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
- [x] Unit tests for answer evaluation, invalid answer rejection, and randomized question-order integrity.
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
- Server-side Brain Sprint session and scoring code passed backend compilation and automated tests in GitHub Actions on commit `73f07448f4203acb402a59dd2db88c54b79fd463`. It cannot run against real players until Neon is provisioned and all three migrations are applied. The current game question bank is still a prototype and should be moved out of the public repository before competitive public launch.
- XP persistence, rate limiting, full anti-cheat controls, and live leaderboards do not exist yet.
- GitHub Actions completed successfully on commit `1d7551a34d91537d26a745b1f4f68a05291b9cab`, including frontend type-check, backend compilation, Telegram auth tests, and frontend production build. This validates the code build, not a live Telegram/Neon deployment.
- Do not use this prototype for paid play, prizes, or competitive rankings.

## Next milestone
1. Confirm the latest GitHub Actions run passes after frontend game integration.
2. Create and connect the Neon project; apply migrations 001–003.
3. Configure Telegram bot token as a server-only secret and deploy the API.
4. Test Telegram sign-in and complete Brain Sprint rounds end-to-end.
5. Move the question bank and answer key out of the public frontend/repository before competitive launch.
6. Add XP persistence, player progression, and leaderboards.
7. Verify language switching, RTL/LTR, and accessibility on real mobile devices.
