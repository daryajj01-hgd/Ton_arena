# Cloudflare deployment setup

TON ARENA is deployed as one Cloudflare Worker with static frontend assets and a Hyperdrive binding to the existing Neon PostgreSQL database. This keeps the browser UI and API on the same origin.

## Free-tier boundaries

- Workers Free: 100,000 requests per day and 10 ms CPU time per request.
- Hyperdrive Free: 100,000 database statements per day.
- Cloudflare Pages/Workers static assets are served by Cloudflare's asset network.
- These are hard quotas, not unlimited service. Requests or database statements beyond the free quotas can fail until the quota resets. Do not enable paid billing if the project must remain at $0.
- Neon remains a separate provider with its own free-plan quotas and possible overage/upgrade rules. Monitor both accounts.

## One-time Cloudflare setup

1. Create or sign in to a Cloudflare account and keep the account on the Free plan.
2. In Cloudflare Dashboard, open Workers & Pages > Hyperdrive and create a configuration named `ton-arena-neon`.
3. Use the existing Neon PostgreSQL connection string for the `ton_arena_app` role. In Neon Connection Details, select the `ton_arena_app` role and turn **connection pooling off** before copying the connection string. Hyperdrive supplies its own global connection pool, so do not put Neon's `-pooler` URL behind Hyperdrive. Never paste this value into GitHub source code, an issue, or a chat.
4. Copy the Hyperdrive configuration ID (32 lowercase hexadecimal characters).
5. In Workers & Pages, create a basic Worker named `ton-arena` (this lets the deployment token be limited to that one existing Worker). Do not choose a paid plan.
6. Create a Cloudflare API token with the **Workers Editor** role scoped only to the `ton-arena` Worker. Do not use the Global API Key. Creating the Worker in advance avoids granting the CI token account-wide Admin permissions.
7. In GitHub, open Settings > Secrets and variables > Actions and add:
   - Secret `CLOUDFLARE_API_TOKEN`: the scoped Cloudflare API token.
   - Secret `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID.
   - Repository variable `HYPERDRIVE_ID`: the Hyperdrive configuration ID.
8. In Cloudflare Workers & Pages, open `ton-arena` > Settings > Variables and Secrets and add these two values as **Secrets**:
   - `TELEGRAM_BOT_TOKEN`
   - `BRAIN_SPRINT_ANSWER_KEY`
   Then run the `Build check` workflow once and, after it passes, run `Deploy TON ARENA to Cloudflare Workers` from GitHub Actions.

## Important release gate

The previous question-answer key appeared in public Git history. Do not run public competitions using the old question bank. Replace the question bank and generate a fresh ten-element answer key before launch. Keep the new key only as a Cloudflare secret.

## Runtime behavior

- `/health` checks Worker availability.
- `/ready` checks the Neon connection through Hyperdrive.
- API routes are handled by `worker/index.ts`; frontend files are served from `dist`.
- Existing Neon migrations have already been applied. This Worker intentionally does not run filesystem-based startup migrations.
- The current in-memory rate limiter is best-effort per Worker isolate and is not a global abuse-control system. Before public scale or prize distribution, replace it with a shared, durable rate limiter and add abuse monitoring.
- Do not configure a custom paid Workers plan. If free quotas are reached, pause/limit traffic rather than silently upgrading.

## GitHub Actions

The workflow `.github/workflows/cloudflare-deploy.yml` runs the repository's existing typecheck, backend build, tests, and frontend build before deploying with Wrangler. A deployment is considered successful only after the workflow succeeds and `/health` and `/ready` are checked.
