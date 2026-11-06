# TON ARENA — Project Charter

**Status:** Initial baseline  
**Version:** 0.2  
**Last updated:** 2026-11-06

## 1. Vision

Build a global, Telegram-first digital ecosystem that combines skill-based play, gamified learning, and community participation. The long-term ambition is a large, polished, continually expanding product—not a single-game app. It should be extensible beyond Telegram without requiring a rewrite of its core foundations.

BRAIN SPRINT is the first small release used to validate the platform and learn from real players. It is not the final scope or the only planned game.

## 2. Connected products

The ecosystem has three connected experiences, not three disconnected applications:

- **TON ARENA:** a growing catalog of skill-based games, friendly competition, leagues, tournaments, and leaderboards.
- **TON ACADEMY:** gamified learning, short lessons, quizzes, learning paths, and progress challenges.
- **TON CLUB:** social groups, clubs, friends, teams, and community challenges.

They share identity, profiles, progression, missions, achievements, and (where appropriate) a common rewards framework. New games and modules should plug into shared services instead of becoming isolated mini-apps.

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
10. Design for enjoyable, voluntary engagement—not compulsive use. Avoid manipulative scarcity, punitive streak mechanics, pay-to-win advantages, and pressure-based notifications.
11. Prioritize game quality, fairness, accessibility, localization, privacy, and player safety over shipping a large quantity of unfinished features.

## 4. First MVP: BRAIN SPRINT

A short skill-based general-knowledge game:

- 10 questions per round.
- A clear time limit.
- Score based on correctness and response speed.
- Free play; no wager, stake, or paid entry.
- Player profile, XP, levels, and daily mission.
- Friendly leaderboard.
- Basic anti-abuse controls and server-side score validation.

The first release should prioritize a reliable complete game loop over a large feature list. After validation, the game catalog will expand in phases to include other skill-based game types.

## 5. Long-term product scope

The intended evolution is:
1. Establish shared identity, profile, progression, and secure backend foundations.
2. Complete and validate BRAIN SPRINT.
3. Add multiple high-quality games under TON ARENA.
4. Grow TON ACADEMY with structured learning experiences.
5. Grow TON CLUB with safe social and group experiences.
6. Launch the Telegram Mini App publicly in controlled stages.
7. Consider sustainable monetization and optional Web3 only after real user value is demonstrated.

This is a staged ambition, not a promise that every feature will ship regardless of user feedback, cost, safety, or feasibility.

## 6. Engagement and retention

The product should earn repeat visits through:
- Skill mastery and visible progression.
- Varied, fair challenges and meaningful competition.
- Fresh content and well-run events.
- Friends, teams, and belonging.
- Clear rewards and satisfying feedback.

Success is not measured by screen time alone. Track satisfaction, voluntary return behavior, completion, fairness, user reports, and healthy notification engagement. Give players control over notifications and natural stopping points.

## 7. Initial success measure

The first validation milestone is to learn whether real users return and invite others. The working acquisition target is 1,000 real users; this is a target, not a forecast or guarantee.

Track at minimum:
- New users and completed first rounds.
- Daily and weekly active users.
- Round completion rate.
- Day-1 and Day-7 retention.
- Games played per active user.
- Invites and invite conversion.
- Errors, suspicious scores, and support reports.
- User satisfaction and reasons for returning or leaving.

Do not claim progress toward these metrics until analytics are implemented and actual data exists.

## 8. Constraints

- Initial budget: effectively zero.
- Project owner has no programming experience.
- Work should be manageable from an Android phone using cloud tools; do not make the old laptop a dependency.
- Prefer free tiers and avoid paid infrastructure until a measured need exists.
- The assistant should handle planning, documentation, code drafting, and available repository operations; the owner performs account approvals and device-only steps.

## 9. Delivery principles

- Keep a single source of truth in this repository.
- Use Git commits to record meaningful changes.
- Separate confirmed decisions from proposals and open questions.
- Never describe an untested feature as working.
- Before launch, review privacy, security, moderation, platform compliance, and applicable local laws.

## 10. Current status

Confirmed:
- One connected ecosystem with three product areas.
- Telegram-first distribution.
- No gambling or betting.
- No initial token issuance.
- BRAIN SPRINT as the first MVP, not the final product scope.
- Long-term multi-game expansion plus TON ACADEMY and TON CLUB.
- Low-cost, cloud-first development.
- Healthy engagement rather than manipulative or compulsive design.

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

## 11. Telegram release approach

Telegram is the first launch channel. Public release comes after:
- A deployed HTTPS Mini App is connected to the official bot.
- Telegram identity is validated securely on the backend.
- Core flows are tested inside Telegram on supported mobile devices.
- Privacy, support, security, moderation, and platform-policy requirements are reviewed.
- A private alpha and invite-only beta have exposed critical issues before staged public availability.
