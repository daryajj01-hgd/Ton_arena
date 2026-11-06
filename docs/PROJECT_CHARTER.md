# TON ARENA — Project Charter

**Status:** Initial baseline  
**Version:** 0.1  
**Last updated:** 2026-11-06

## 1. Vision

Build a global, Telegram-first digital ecosystem that combines skill-based play, gamified learning, and community participation. The long-term product should be extensible beyond Telegram without requiring a rewrite of its core foundations.

## 2. Connected products

The ecosystem has three connected experiences, not three disconnected applications:

- **TON ARENA:** skill-based games, friendly competition, tournaments, and leaderboards.
- **TON ACADEMY:** gamified learning, short lessons, quizzes, and progress challenges.
- **TON CLUB:** social groups, clubs, friends, and community challenges.

They share identity, profiles, progression, missions, achievements, and (where appropriate) a common rewards framework.

## 3. Product principles

1. No gambling or betting mechanics.
2. Do not make users stake money or pay an entry fee for a chance to win pooled user funds.
3. Start with a useful, free MVP; validate demand before adding paid features.
4. Keep initial operating costs as close to zero as practical.
5. Build in small, testable increments and document decisions.
6. Do not issue a project token at launch.
7. Use TON/Web3 only where it adds real utility and complies with platform rules.
8. For digital goods and services sold inside Telegram Mini Apps, follow Telegram's applicable Stars payment requirements.
9. Preserve portability: Telegram is the first distribution channel, not a permanent technical lock-in.

## 4. First MVP: BRAIN SPRINT

A short skill-based general-knowledge game:

- 10 questions per round.
- A clear time limit.
- Score based on correctness and response speed.
- Free play; no wager, stake, or paid entry.
- Player profile, XP, levels, and daily mission.
- Friendly leaderboard.
- Basic anti-abuse controls and server-side score validation.

The first release should prioritize a reliable complete game loop over a large feature list.

## 5. Initial success measure

The first validation milestone is to learn whether real users return and invite others. The working acquisition target is 1,000 real users; this is a target, not a forecast or guarantee.

Track at minimum:
- New users and completed first rounds.
- Daily and weekly active users.
- Round completion rate.
- Day-1 and Day-7 retention.
- Games played per active user.
- Invites and invite conversion.
- Errors, suspicious scores, and support reports.

Do not claim progress toward these metrics until analytics are implemented and actual data exists.

## 6. Constraints

- Initial budget: effectively zero.
- Project owner has no programming experience.
- Work should be manageable from an Android phone using cloud tools; do not make the old laptop a dependency.
- Prefer free tiers and avoid paid infrastructure until a measured need exists.
- The assistant should handle planning, documentation, code drafting, and available repository operations; the owner performs account approvals and device-only steps.

## 7. Delivery principles

- Keep a single source of truth in this repository.
- Use Git commits to record meaningful changes.
- Separate confirmed decisions from proposals and open questions.
- Never describe an untested feature as working.
- Before launch, review privacy, security, moderation, platform compliance, and applicable local laws.

## 8. Current status

Confirmed:
- One connected ecosystem with three product areas.
- Telegram-first distribution.
- No gambling or betting.
- No initial token issuance.
- BRAIN SPRINT as the first MVP.
- Low-cost, cloud-first development.

Proposed baseline, subject to review:
- React + TypeScript for the Mini App frontend.
- A small server API with TypeScript.
- PostgreSQL for durable data.
- Add Redis only if a demonstrated need arises.
- GitHub as the source repository.

Open:
- Final hosting provider and deployment workflow.
- Bot name and Telegram bot setup.
- Final visual identity and supported languages.
- Detailed privacy/retention policy.
- Whether the first MVP needs a database from day one or can start with a simpler managed setup.
