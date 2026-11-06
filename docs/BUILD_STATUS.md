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
- [x] Server-side Telegram Mini App initData signature and freshness validation endpoint.
- [x] Automated GitHub Actions workflow with separate frontend type-check, backend TypeScript compilation, and frontend production-build steps.

## Important limitations
- This is a frontend prototype only.
- Language preference is now saved in browser localStorage and should survive page reloads on the same browser/device; this has been verified in source code but not yet tested in a live browser.
- Translations are initial product copy and should receive native-speaker review before public launch.
- The 11-language foundation is extensible; it does not mean every world language has been added.
- Answers, countdown, and score are handled in the browser only.
- The API currently validates Telegram initData but does not yet create persistent accounts or server sessions.
- No database, server-side game sessions/scoring, anti-cheat system, XP persistence, or live leaderboard exists yet.
- The production build and backend compilation have not yet been confirmed by a completed GitHub Actions run. CI has been split into separate steps so the failing stage is identifiable.
- Do not use this prototype for paid play, prizes, or competitive rankings.

## Next milestone
1. Verify language switching and RTL/LTR rendering on mobile.
2. Confirm the GitHub Actions build passes and test the app in a live browser.
3. Connect the Telegram bot token as a server-only secret and test signed Telegram launch data.
4. Add persistent player storage and server-side game sessions/scoring.
