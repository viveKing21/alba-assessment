# ProjectPulse Build Log

## Goal and Scope

Build a portfolio-quality SaaS project-management dashboard with authenticated, user-isolated project and task CRUD; Realtime synchronization; task analytics; and a polished responsive interface. The implementation intentionally favors a small, auditable surface area over features unrelated to the assessment.

## Stack and Tooling

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Supabase Auth, Postgres, RLS, and Realtime
- shadcn/ui primitives, Lucide, Sonner, date-fns
- React Hook Form and Zod
- Recharts

## Key Decisions

### Supabase is the single data source

Projects and tasks are never read from JSON, `localStorage`, or mock adapters. Server-rendered routes query Supabase with the active user session, while client components make only authenticated browser mutations.

### Authorization lives in the database

RLS policies are the security boundary, not client navigation. Projects compare `user_id` with `auth.uid()`; tasks authorize through their parent project. This matches the normalized schema and prevents bypassing the UI with direct API calls.

### Server-first route design

Pages, data access, and authentication checks are server components where possible. Client components are limited to interactive forms, dialogs, search, profile sign-out, Recharts, and Realtime subscriptions. `proxy.ts`, rather than deprecated `middleware.ts`, refreshes Supabase SSR sessions for Next.js 16.

### Realtime refresh over duplicated client cache

The workspace layout listens to `projects` and `tasks` changes and refreshes route data. It gives both tabs a consistent, RLS-filtered representation of the database without introducing a second cache, reconciliation logic, or optimistic race conditions.

### Accessibility and interaction quality

Base UI-backed shadcn components provide keyboard-friendly dialogs, menus, focus treatment, and modal behavior. Forms have labels, validation messages, invalid state, and non-color-only status labels. Destructive actions require a confirmation dialog.

## Trade-offs

- The initial product is a personal workspace, so no team/member schema was added. This keeps authorization policies simple and verifiable.
- UI mutations use explicit pending states and toast feedback instead of optimistic local state. This is more conservative under Realtime event ordering and still communicates progress clearly.
- A single layout-level subscription is deliberately broad for the current data model. For large team workspaces, subscriptions should be filtered or backed by a query cache.
- The manual database type model keeps the starter independent of a Supabase CLI generation step. In a long-lived production project, generated types should be refreshed in CI after every migration.

## Hard Parts

- Correct SSR session handling requires a browser client, a server client that reads Next.js cookies, and a Next.js 16 `proxy.ts` that persists Supabase token refreshes.
- Task authorization cannot simply compare a task column to `auth.uid()` because `tasks` is normalized. Policies therefore use a parent-project ownership check for every operation.
- Realtime database changes need both publication enrollment and `REPLICA IDENTITY FULL` to provide useful update/delete events.
- The dashboard must distinguish a clean empty workspace from a failed Supabase query, while preserving a calm experience on mobile.

## Verification

Completed locally:

```text
npm run lint
npm run build
```

The production build completed successfully and verified all routes, TypeScript, static generation, and the Next.js 16 proxy convention.

## Known Limitations

- Supabase credentials are not included, so runtime database behavior requires the environment variables and migration described in the README.
- The assessment scope does not include project membership, task assignment, or audit history.
- Automated tests are a logical next investment; the current verification is lint plus a successful production build.

## Time Breakdown

| Area | Relative effort |
| --- | ---: |
| Data model, indexes, RLS, Realtime, seed setup | 25% |
| Auth and Next.js SSR session architecture | 20% |
| Project and task CRUD workflows | 25% |
| Dashboard, analytics, responsive visual design | 20% |
| Documentation and build verification | 10% |
