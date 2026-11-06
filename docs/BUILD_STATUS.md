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
- [x] CI runs frontend type-checking, backend compilation, Telegram authentication tests, and frontend production build as separate steps.
- [x] Automated GitHub Actions workflow with separate frontend type-check, backend TypeScript compilation, and frontend production-build steps.

## Important limitations
- This is a frontend prototype only.
- Language preference is now saved in browser localStorage and should survive page reloads on the same browser/device; this has been verified in source code but not yet tested in a live browser.
- Translations are initial product copy and should receive native-speaker review before public launch.
- The 11-language foundation is extensible; it does not mean every world language has been added.
- Answers, countdown, and score are handled in the browser only.
- Neon has been selected, but no Neon project/account has been created or connected and the migration has not been applied. Player persistence is therefore not live yet.
- The API does not yet issue secure player sessions; Telegram identity verification is not yet a complete login/session system.
- No database, server-side game sessions/scoring, anti-cheat system, XP persistence, or live leaderboard exists yet.
- The production build, backend compilation, and authentication tests have not yet been confirmed by a completed GitHub Actions run. CI has separate steps so a failing stage is identifiable.
- Do not use this prototype for paid play, prizes, or competitive rankings.

## Next milestone
1. Verify language switching and RTL/LTR rendering on mobile.
2. Confirm the GitHub Actions build passes and test the app in a live browser.
3. Select and connect a PostgreSQL provider; apply the initial player migration.
4. Configure the Telegram bot token as a server-only secret and test signed Telegram launch data end-to-end.
5. Add secure player sessions, then server-side game sessions/scoring.
