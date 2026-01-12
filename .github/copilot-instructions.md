<!-- Copilot / AI agent instructions for LJMAAccounting -->
# Copilot instructions — LJMAAccounting

Purpose: quick, actionable context for AI coding agents working on this repository.

- Big picture
  - Frontend: Next.js (app router) lives in `src/app` — pages and API route handlers use the app router conventions.
  - Firebase: client SDK and helpers are in `src/firebase` and are used for auth & Firestore; production relies on Firebase App Hosting automatic init.
  - Database: Prisma + MariaDB adapter used via `src/lib/prisma.ts` and `prisma/schema.prisma`. Local legacy APIs use `server.js` which connects to MySQL on port 5000.
  - UI: TypeScript + Tailwind + Radix components; shared UI lives in `src/components`.

- Developer workflows (commands)
  - Start dev app: `npm run dev` (Next dev with turbopack).
  - Build: `npm run build` and `npm run start` for production runtime.
  - GenKit (AI tooling): `npm run genkit:dev` and `npm run genkit:watch` (see `src/ai/dev.ts`).
  - Static checks: `npm run lint` and `npm run typecheck`.

- Key integration points & envs
  - `src/firebase/config.ts` contains a local `firebaseConfig` used in development. Production uses automatic initializeApp() (see `src/firebase/index.ts`).
  - `src/lib/prisma.ts` expects `DATABASE_URL` environment variable; Prisma is instantiated with a global cache to avoid multiple clients.
  - `server.js` is a small Express/MySQL server (local development, port 5000). Be careful with hard-coded credentials; prefer env vars for changes.

- Project-specific patterns to follow
  - `initializeFirebase()` in `src/firebase/index.ts` must NOT be modified; it intentionally attempts a no-arg `initializeApp()` for Firebase Hosting and falls back to `firebaseConfig` in development.
  - Use `use client` at the top of React components that rely on browser-only APIs — repository mixes server and client components (Next.js app router rules apply).
  - Prisma client uses a global cache pattern in `src/lib/prisma.ts` — replicate this pattern when adding new singleton clients.
  - Hooks live under `src/hooks/*`; prefer those over ad-hoc local state for shared logic (see `use-transactions.ts`, `use-products.ts`).
  - API routes follow `src/app/api/...` layout. Prefer server components / route handlers for server-side logic rather than sprinkling fetches into client components.

- Files to read first when making changes
  - `src/firebase/index.ts` — initialization behavior and exported helpers.
  - `src/lib/prisma.ts` and `prisma/schema.prisma` — DB access patterns and models.
  - `src/app/api/*` — existing route handlers to mirror request/response patterns.
  - `src/components/*` and `src/hooks/*` — UI & shared logic conventions.

- Safety and non-goals
  - Don't change Firebase initialization semantics or remove the fallback to `firebaseConfig` — doing so breaks local dev or hosted runs.
  - Avoid creating multiple PrismaClient instances; follow `src/lib/prisma.ts` global caching pattern.

- Quick examples
  - Reuse Prisma pattern: copy the global client pattern from `src/lib/prisma.ts`.
  - To add an API route, create a handler under `src/app/api/<resource>/route.ts` following existing handlers.

If anything in this file is unclear or you want more examples for a particular folder, tell me which part to expand and I will iterate.
