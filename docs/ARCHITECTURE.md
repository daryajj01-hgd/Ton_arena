# TON ARENA — Initial Technical Architecture

**Status:** Proposed baseline, not yet deployed  
**Version:** 0.1  
**Last updated:** 2026-11-06

## 1. Architecture objective

Create one shared platform for TON ARENA, TON ACADEMY, and TON CLUB. The first implementation should be small enough to operate on free or low-cost cloud services, while keeping clear boundaries so it can grow.

## 2. High-level shape

```text
Telegram
   |
   v
Telegram Bot + Mini App (web frontend)
   |
   v
Application API
   |
   +--> Identity and Telegram session validation
   +--> Player profile and progression
   +--> Missions and achievements
   +--> Game sessions and score validation
   +--> Leaderboards
   +--> Academy modules (later)
   +--> Clubs and social features (later)
   |
   v
PostgreSQL
   |
   +--> Analytics/events (initially lightweight)
   +--> External integrations (later)
             |
             +--> TON Connect (only when needed)
```

This is a logical diagram. No services in it should be considered deployed until implementation and testing confirm that.

## 3. Suggested technology baseline

| Layer | Initial choice | Reason |
|---|---|---|
| Frontend | React + TypeScript | Common ecosystem and maintainable UI |
| Mini App integration | Telegram Web Apps SDK | Telegram launch and user context |
| Backend | Node.js + TypeScript | Shared language across frontend/backend |
| API | Small REST API | Easy to test and understand |
| Database | PostgreSQL | Reliable relational storage |
| Hosting | Select a suitable cloud free tier | Avoid laptop dependency |
| Source control | GitHub | Version history and collaboration |
| Web3 | TON Connect, later | Add only after core product validation |

Neon is selected as the initial PostgreSQL provider; the project is not yet provisioned. These are not irreversible decisions. Confirm current free-tier limits, deployment requirements, and data-region/privacy needs before public launch.

## 4. Shared platform modules

### Identity
- Validate Telegram Mini App initialization data on the server.
- Never trust a user ID or profile supplied only by the browser.
- Create an internal player record linked to the validated Telegram identity.
- Do not request unnecessary personal information.

### Player profile
- Display name and optional avatar.
- XP and level.
- Achievement summary.
- Account creation and last-active timestamps.

### Progression
- XP rules must be deterministic and documented.
- Award XP on the server after validating an action.
- Add rate limits and duplicate-event protection.
- Do not let clients directly set scores, XP, or balances.

### Missions and achievements
- Start with a small set of daily missions.
- Store mission definitions separately from player completion records.
- Make reward rules transparent and auditable.

### Game engine
- Server issues a game session and question set.
- Server validates submitted answers and timing.
- Score calculation happens server-side.
- Store enough session data to investigate disputes and suspicious activity.

### Leaderboards
- Start with all-time and daily rankings.
- Define tie-breaking rules before launch.
- Protect leaderboard endpoints against scraping and abuse where practical.

## 5. Initial API foundation

The repository now contains an initial Node.js HTTP API in `server/server.ts`:
- `GET /health` returns a basic service health response.
- `POST /api/auth/telegram` accepts Telegram Mini App `initData`, validates the HMAC signature with the bot token, checks the `auth_date` freshness window, and returns a minimal authenticated player identity.
- The bot token is read only from the server environment variable `TELEGRAM_BOT_TOKEN`; it must never be placed in frontend code or committed to Git.
- The signature and freshness checks are isolated in `server/telegram-auth.ts` and covered by automated Node.js tests for valid data, modified fields, expired/future timestamps, invalid user IDs, and invalid signatures. The API now includes `server/database.ts`, which uses a PostgreSQL connection pool and upserts a player by unique Telegram ID. The initial schema is in `db/migrations/001_create_players.sql`. `GET /ready` checks database connectivity; `/health` remains a liveness endpoint. These pieces are committed but are not live until a provider is connected and the migration is applied. The API still does not issue a session cookie/token, so identity verification is not yet a complete login/session system.

Before public use, add a secure session strategy, origin/CSRF protections appropriate to the deployment, rate limiting, structured logging, and persistent player records. The CI workflow now runs frontend type-checking, backend compilation, these authentication tests, and the frontend production build as separate steps.

## 6. MVP scope

Build only:
1. Telegram launch and server-side identity validation.
2. Minimal player profile.
3. BRAIN SPRINT 10-question round.
4. Server-validated scoring.
5. XP and level.
6. Daily mission.
7. Leaderboard.
8. Basic event tracking and error reporting.

Do not build clubs, a token, NFTs, a marketplace, paid tournaments, or complex AI features in the first MVP.

## 7. Security and trust baseline

- Keep secrets in cloud environment variables, never in Git.
- Validate Telegram init data on the backend.
- Validate every score and reward on the backend.
- Apply input validation, rate limits, and abuse monitoring.
- Use HTTPS in production.
- Collect the minimum personal data needed.
- Define account deletion and data-retention behavior before public launch.
- Do not hold user funds in the MVP.
- Review Telegram platform policies before enabling payments or blockchain flows.

## 8. Future integrations

### TON Connect
Consider only after the free core loop has retention. Wallet connection must be optional unless a specific feature truly requires it. Never ask users to share seed phrases or private keys.

### Payments
Digital goods/services inside Telegram Mini Apps must follow Telegram's current payment rules, including Stars where applicable. TON transactions should not be used to bypass platform requirements.

### Academy and Club
Reuse identity, progression, missions, and moderation foundations. Add separate domain modules rather than creating separate accounts or isolated databases.

## 9. Decisions still required

- Hosting and frontend/backend deployment arrangement.
- Authentication/session implementation details.
- Analytics provider or self-hosted event table.
- Supported languages for first release.
- Privacy policy and data-retention schedule.
