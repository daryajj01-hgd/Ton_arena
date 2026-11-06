# TON ARENA — Product Roadmap

**Status:** Working plan  
**Version:** 0.1  
**Last updated:** 2026-11-06

The roadmap is outcome-based. A phase is complete only when its acceptance checks pass; writing a plan is not the same as shipping a feature.

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

**Goal:** Deliver one complete, fair, replayable skill-game loop.

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

**Goal:** Learn from real usage before expanding.

Tasks:
- [ ] Invite a small test group.
- [ ] Track onboarding and round completion.
- [ ] Measure day-1 and day-7 retention.
- [ ] Collect usability feedback.
- [ ] Fix critical bugs and confusing flows.
- [ ] Test anti-abuse rules.

Exit checks:
- Metrics are based on real events.
- Main user journey works reliably.
- The team can explain why users return or leave.
- A decision is made to iterate, expand, or stop.

## Phase 4 — TON ACADEMY

**Goal:** Reuse the shared platform for structured learning.

Potential features:
- Short learning paths.
- Quizzes and spaced practice.
- Progress tracking.
- Learning missions and achievements.

Start only after the core platform and game loop are stable.

## Phase 5 — TON CLUB

**Goal:** Add community participation safely.

Potential features:
- Clubs and groups.
- Friends and invitations.
- Group challenges.
- Moderation and reporting.
- Privacy controls.

Moderation, abuse prevention, and user safety must be designed before opening public community spaces.

## Phase 6 — Monetization and Web3

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

## Phase 7 — Expansion

Potential directions:
- More languages and regions.
- Public APIs and partner integrations.
- Richer AI-assisted learning and content tools.
- Standalone app or web experience.
- Carefully scoped NFT/game integrations if they provide real utility.

## Immediate next actions

1. Choose the simplest cloud development path that works from an Android phone.
2. Create the initial codebase and verify it runs.
3. Connect a Telegram test bot only after the web app skeleton is ready.
