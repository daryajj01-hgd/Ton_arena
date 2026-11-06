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
- [x] Frontend session token is kept in memory only; a fresh Telegram launch re-authenticates rather than persisting a bearer token in browser storage.
- [x] CI runs frontend type-checking, backend compilation, Telegram authentication tests, and frontend production build as separate steps.
- [x] Automated GitHub Actions workflow with separate frontend type-check, backend TypeScript compilation, and frontend production-build steps.

## Important limitations
- This is a frontend prototype only.
- Language preference is now saved in browser localStorage and should survive page reloads on the same browser/device; this has been verified in source code but not yet tested in a live browser.
- Translations are initial product copy and should receive native-speaker review before public launch.
- The 11-language foundation is extensible; it does not mean every world language has been added.
- Answers, countdown, and score are handled in the browser only.
- Neon has been selected, but no Neon project/account has been created or connected and the migration has not been applied. Player persistence is therefore not live yet.
- Session endpoints are implemented in the API, but they are not yet deployed or end-to-end tested. The frontend does not yet consume the session token. Do not consider authentication production-ready.
- No database, server-side game sessions/scoring, anti-cheat system, XP persistence, or live leaderboard exists yet.
- GitHub Actions completed successfully on commit `1d7551a34d91537d26a745b1f4f68a05291b9cab`, including frontend type-check, backend compilation, Telegram auth tests, and frontend production build. This validates the code build, not a live Telegram/Neon deployment.
- Do not use this prototype for paid play, prizes, or competitive rankings.

## Next milestone
1. Verify language switching and RTL/LTR rendering on mobile.
2. Confirm the GitHub Actions build passes and test the app in a live browser.
3. Select and connect a PostgreSQL provider; apply the initial player migration.
4. Configure the Telegram bot token as a server-only secret and test signed Telegram launch data end-to-end.
5. Verify session flows with a connected database and Telegram Mini App, then integrate frontend session handling.
6. Add server-issued game sessions and server-side scoring.
