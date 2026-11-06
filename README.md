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
