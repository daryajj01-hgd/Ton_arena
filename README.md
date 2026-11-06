# TON ARENA

TON ARENA is a Telegram-first skill gaming ecosystem designed to grow into a connected platform.

## Products

- **TON ARENA** — skill-based games and friendly competitions.
- **TON ACADEMY** — gamified learning and daily challenges.
- **TON CLUB** — social spaces, groups, and community activities.

## Product principles

- No gambling or betting mechanics.
- Start with a free, measurable MVP and validate with real users.
- Build shared foundations for profiles, progression, missions, and leaderboards.
- Keep the architecture extensible for multilingual support, AI features, and permitted Web3 integrations.
- Follow Telegram platform rules, including applicable Telegram Stars requirements for digital goods.

## First MVP

**BRAIN SPRINT**: a short general-knowledge challenge with 10 timed questions, scoring for accuracy and speed, XP, levels, daily missions, and friendly leaderboards.

## Development approach

Build incrementally, keep costs low, document confirmed decisions, and never report unverified progress as completed.


## Database foundation

Neon is the selected PostgreSQL provider for the MVP. The repository includes the initial player schema, a small connection pool, and a repeatable migration command. See [Neon setup](docs/NEON_SETUP.md) before connecting a live database. Never commit real environment secrets.


## Container deployment

The repository includes a multi-stage Dockerfile that builds the React frontend and serves it from the same Node.js process as the API. This keeps the frontend and API on one origin, so VITE_API_BASE_URL can remain unset.

Configure these values as runtime secrets/environment variables in the hosting provider:
- DATABASE_URL
- TELEGRAM_BOT_TOKEN
- BRAIN_SPRINT_ANSWER_KEY (server-only JSON array of ten option indexes)

After the first deployment, run the one-time database migration command inside the service/container:

```sh
node dist-server/migrate.js
```

Use /health for process health and /ready for database readiness. Do not bake secrets into the Docker image or build arguments. The current rate limiter is in-memory and intended for a single API instance; use a shared Redis-backed limiter before scaling horizontally.
