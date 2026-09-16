# Anshul AutoPilot

The original React interface with a replacement Python API and Supabase Auth/PostgreSQL backend. The former Express/MongoDB server has been removed. Historical implementation notes are in `docs/legacy` and do not describe the current backend.

## Run locally

Use Python 3.12+ and Node.js 22.12+ (Node 24 recommended).

```sh
npm ci
python -m backend
```

In another terminal:

```sh
npm run dev
```

Open the Vite URL. Vite proxies `/api` to Python on port 5000; use that same origin for sign-in and API calls. No Python dependencies are required. Configuration defaults to the provisioned project in `backend/project.json`; this contains only the public publishable key. Override with shell environment variables `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` for a different project. `.env.example` documents the names; Python does not automatically load dotenv files. Never put a service-role key in frontend code.

## Database

Provisioned Supabase project: **Anshul AutoPilot**, ref `hvekozprrymxapuagxbc`, Mumbai.

The 33 `ap_*` tables store UUID identifiers, owner IDs, validated JSON payloads, timestamps and optimistic concurrency versions. Every table uses row-level security for its authenticated owner. The API verifies sessions with Supabase Auth and forwards the user's JWT to PostgREST, retaining RLS enforcement. `id` and `_id` response aliases preserve the existing UI contract.

For a **new, empty** Supabase project apply `supabase/schema.sql` followed by `supabase/focus_rewards.sql`. These scripts are already applied to the provisioned project; do not rerun the initial schema there. Focus completion and XP rewards use one authenticated database transaction and an idempotency key.

## Authentication

Password signup/login, session lookup, refresh and logout live under `/api/v1/auth`. Tokens stay in HttpOnly cookies; production cookies are Secure and SameSite=Lax. The frontend refreshes an expired session once and retries the original request. Mutations require a same-origin verification header. Browser caches are scoped per signed-in user, and automatic demo seeding is disabled.

When Supabase email confirmation is enabled, registration displays an instruction to confirm the email before signing in. It deliberately does not create a session before confirmation. Set Supabase **Authentication → URL Configuration → Site URL** to the final production URL and configure allowed redirects before testing confirmation emails. No email delivery or real-user login end-to-end test has been completed yet.

## Vercel

Import this repository as a Vite project. `vercel.json` builds the frontend and routes `/api/v1/*` to the WSGI function `api/index.py`. The frontend uses the same-origin `/api/v1` URL; do not set it to localhost for production. Python runtime is pinned by `.python-version`.

The connected Vercel account currently denies deployment inspection with HTTP 403 for scope `anshuldhiman533-1980`. An initial preview was submitted, but build completion and live authentication are **not verified**. Reconnect that scope to finish deployment verification. Before release verify registration/confirmation, login, refresh, task creation/reload and isolation using two accounts.

## Verification

```sh
python -m unittest discover -s tests -v
npm run build
```

15 Python tests pass, covering route contracts, cookie behavior, refresh/logout, ownership, validation, updates, imports and queue deduplication. Auth transport is mocked in these unit tests. Separate rollback-only SQL checks on the provisioned Supabase database passed owner isolation and transactional focus reward idempotency. Local frontend build is currently blocked by the uploaded Windows-only native modules and unavailable package downloads; a clean Linux `npm ci` is required. `/api/v1/health` reports configuration presence, not live database connectivity.

## Scope and limitations

The API covers the existing task, planner, project, study, coding, health, skill, settings, notification and chat-history contracts. Existing UI behavior is preserved: PDF entries are metadata, chat storage does not add an external AI provider, and notification queues run when the app polls rather than as background push notifications. Settings JSON backups remain browser-cache backups, not full PostgreSQL exports. Legacy JSON import is explicit and retry-deduplicated but is not a MongoDB migration or an atomic multi-record restore. Historical unscoped browser data must be explicitly exported/imported; it is not automatically assigned to a new account.
