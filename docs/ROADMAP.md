# TON ARENA — Product Roadmap

**Status:** Working plan  
**Version:** 0.2  
**Last updated:** 2026-11-06

The roadmap is outcome-based. A phase is complete only when its acceptance checks pass; writing a plan is not the same as shipping a feature. BRAIN SPRINT is the first game and validation entry point, not the full product.

## Product destination

Build one connected, expandable Telegram-first ecosystem with three areas:
- **TON ARENA:** a growing catalog of skill-based games and competitive experiences.
- **TON ACADEMY:** gamified learning and skill progression.
- **TON CLUB:** clubs, friends, teams, and community challenges.

All areas should share a player identity, profile, progression, missions, achievements, and safe social features where appropriate. The architecture should allow new games and experiences to be added without rebuilding the whole app.

## Phase 0 — Project foundation

**Goal:** Establish a clear, manageable project baseline.

Tasks:
- [x] Create GitHub repository.
- [x] Add initial project overview.
- [x] Record project charter.
- [x] Record proposed architecture.
- [x] Record phased roadmap.
- [ ] Confirm Telegram bot and Mini App ownership/setup.
- [ ] Select cloud development and hosting path.
- [ ] Define first-release language and visual direction.

Exit checks:
- Project decisions and open questions are documented.
- Repository structure is usable.
- No credentials or secrets are committed.

## Phase 1 — Shared platform skeleton

**Goal:** A user can open the Mini App and receive a validated player profile.

Tasks:
- [ ] Create frontend project.
- [ ] Create backend/API project.
- [ ] Configure environment variables safely.
- [ ] Implement Telegram launch-data validation on the server.
- [ ] Create player profile storage.
- [ ] Add a minimal health/status endpoint.
- [ ] Deploy a private test build over HTTPS.

Exit checks:
- A real Telegram test account can open the app.
- Server validates Telegram identity.
- Invalid or expired launch data is rejected.
- No secret is exposed in frontend code or Git.

## Phase 2 — BRAIN SPRINT MVP

**Goal:** Deliver one complete, fair, replayable skill-game loop as the first playable title.

Tasks:
- [ ] Define question format and content review process.
- [ ] Build 10-question round.
- [ ] Add timer and answer submission.
- [ ] Calculate score on the server.
- [ ] Add XP and levels.
- [ ] Add one daily mission.
- [ ] Add leaderboard.
- [ ] Add basic rate limits and suspicious-score checks.
- [ ] Test on common Android screen sizes.

Exit checks:
- A user can start, finish, and review a round.
- Score is calculated and stored server-side.
- Repeated submissions cannot duplicate rewards.
- Leaderboard reflects validated results.
- No payment, wager, or user-funded prize pool exists.

## Phase 3 — Closed beta and validation

**Goal:** Learn from real usage before expanding the catalog.

Tasks:
- [ ] Invite a small test group.
- [ ] Track onboarding and round completion.
- [ ] Measure day-1 and day-7 retention.
- [ ] Collect usability feedback.
- [ ] Fix critical bugs and confusing flows.
- [ ] Test anti-abuse rules.
- [ ] Validate that the game is enjoyable and users return voluntarily.

Exit checks:
- Metrics are based on real events.
- Main user journey works reliably.
- The team can explain why users return or leave.
- A decision is made to iterate, expand, or stop.

## Phase 4 — TON ARENA game catalog

**Goal:** Grow from the first title into a varied, high-quality game destination.

Potential game families (prioritize only after user research and feasibility review):
- Knowledge and trivia.
- Logic, memory, and pattern challenges.
- Word and language games.
- Reaction, timing, and speed challenges.
- Turn-based strategy and asynchronous head-to-head games.
- Team and club competitions.

Shared systems:
- Unified player profile, XP, levels, achievements, and game history.
- Fair matchmaking and leaderboards appropriate to each game.
- Seasonal events and rotating challenges.
- Game discovery, favorites, and recommendations.
- Accessibility, localization, anti-cheat, and moderation standards.

Exit checks:
- More than one polished game is live and uses shared platform services.
- Adding a game does not require duplicating identity, progression, or leaderboard foundations.
- Game quality, fairness, and performance are tested before release.

## Phase 5 — TON ACADEMY

**Goal:** Reuse the shared platform for structured learning.

Potential features:
- Short learning paths.
- Quizzes and spaced practice.
- Progress tracking.
- Learning missions and achievements.
- Learning challenges that connect to relevant games without making education feel compulsory.

Start after the core platform and first game loop are stable; expand iteratively.

## Phase 6 — TON CLUB

**Goal:** Add community participation safely.

Potential features:
- Clubs and groups.
- Friends and invitations.
- Group challenges.
- Team events and shared milestones.
- Moderation and reporting.
- Privacy controls.

Moderation, abuse prevention, and user safety must be designed before opening public community spaces.

## Phase 7 — Public Telegram launch

**Goal:** Release a dependable, discoverable Telegram Mini App in controlled stages.

Tasks:
- [ ] Create and configure the official Telegram bot.
- [ ] Connect the deployed HTTPS Mini App to the bot.
- [ ] Validate Telegram launch data server-side.
- [ ] Test launch, navigation, deep links, and return flows inside Telegram on Android and iOS.
- [ ] Complete privacy, support, moderation, security, and platform-policy reviews.
- [ ] Run private alpha, invite-only beta, then staged public release.
- [ ] Monitor crashes, abuse, onboarding, retention, and support feedback.

Exit checks:
- Telegram users can reliably discover and open the Mini App.
- Identity and sensitive operations are validated server-side.
- Public-facing policies and support paths are available.
- Critical issues have an owner and response process.

## Phase 8 — Monetization and Web3

**Goal:** Introduce sustainable revenue only after users receive clear value.

Potential options:
- Optional subscriptions or premium features.
- Cosmetic/customization items.
- Sponsorships and clearly labeled advertising.
- TON Connect for genuinely useful optional blockchain features.

Requirements:
- Follow Telegram's current rules for digital goods and Stars payments.
- No gambling or betting mechanics.
- No paid entry to a chance-based prize.
- No token issuance merely for speculation.
- Review applicable laws and platform rules before launch.

## Phase 9 — Long-term expansion

Potential directions:
- More languages and regions.
- Richer social and competitive formats.
- Public APIs and partner integrations.
- AI-assisted learning and content tools with quality controls.
- Standalone app or web experience.
- Carefully scoped NFT/game integrations if they provide real utility.

## Healthy engagement principles

Design for excitement, mastery, belonging, and meaningful progress—not compulsive use:
- Give users clear goals and satisfying feedback.
- Make rewards transparent, attainable, and non-exploitative.
- Avoid pay-to-win, manipulative scarcity, punitive streak loss, and pressure-based notifications.
- Provide notification controls and natural stopping points.
- Measure satisfaction and healthy retention alongside session length.

## Immediate next actions

1. Choose the simplest cloud development path that works from an Android phone.
2. Verify the current frontend builds and runs.
3. Implement the shared backend foundation and secure player identity.
4. Complete and test BRAIN SPRINT as the first end-to-end title.
5. Prepare Telegram private testing before public release.
