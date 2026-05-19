## Context

This is a greenfield Next.js application within the `doit_root` pnpm monorepo. The app is a personal goal-tracking tool ("Do It") with a warm orange editorial design theme. Storage must be switchable via environment variable between browser `localStorage` (demo mode for quick tryouts) and PostgreSQL via Next.js API routes (production mode). No NestJS service is required — all backend logic runs inside Next.js API routes.

## Goals / Non-Goals

**Goals:**
- Render a two-column dashboard (active goals / completed goals)
- Allow goal creation via a modal (title + end date)
- Allow marking a goal complete (checkbox → moves to completed column)
- Allow permanently deleting a goal from either column
- Highlight goals with ≤3 days to deadline in an "urgent" visual state
- Abstract storage behind an adapter so switching modes is a single env var change
- Apply the "Radiant Editorial" orange design system (warm citrus palette, tonal surfaces, pill buttons, no 1px borders)

**Non-Goals:**
- User authentication / multi-user support
- Goal editing after creation (future backlog item)
- Progress bars or sub-tasks within goals
- Mobile-specific layouts (responsive is acceptable but not the focus)
- Automated testing

## Decisions

### Decision 1: Next.js App Router with Server Actions vs. API Routes

**Choice**: Next.js API Routes (`/app/api/goals/route.ts`) for production mode.

**Rationale**: The storage adapter needs to run server-side only when accessing PostgreSQL. API routes provide a clear isomorphic boundary — the same `StorageAdapter` interface is implemented by both `LocalStorageAdapter` (client-side) and `PostgresAdapter` (server-side via API routes). This avoids shipping `pg`/Prisma to the browser bundle.

**Alternative considered**: Server Actions — rejected because they are harder to mock and the REST shape (`GET /api/goals`, `POST /api/goals`, `PATCH /api/goals/[id]`, `DELETE /api/goals/[id]`) maps cleanly to the adapter pattern.

### Decision 2: Storage Adapter Pattern

**Choice**: A `StorageAdapter` interface with two concrete implementations selected at runtime via `NEXT_PUBLIC_STORAGE_MODE`.

```
interface StorageAdapter {
  listGoals(): Promise<Goal[]>
  createGoal(data: CreateGoalInput): Promise<Goal>
  updateGoal(id: string, data: Partial<Goal>): Promise<Goal>
  deleteGoal(id: string): Promise<void>
}
```

- `demo` → `LocalStorageAdapter` — reads/writes `window.localStorage` key `doit_goals` directly from the React client
- `production` → `ApiAdapter` — calls `/api/goals` REST endpoints which internally use `PostgresAdapter`

**Rationale**: The env-var switch requires zero code changes; only a deploy config change. The interface contract means both adapters are interchangeable from the component perspective.

### Decision 3: PostgreSQL Client — `pg` (not Prisma)

**Choice**: Raw `pg` (`node-postgres`) inside API routes.

**Rationale**: The schema is minimal (one `goals` table). Prisma adds a significant build step and binary dependency for a single table. `pg` with a typed query wrapper keeps the footprint small.

**Alternative considered**: Prisma — viable if the schema grows, but premature here.

### Decision 4: Date Arithmetic — `date-fns`

**Choice**: `date-fns` for all date calculations (days remaining, urgency threshold).

**Rationale**: Already common in the monorepo ecosystem; tree-shakeable; avoids `dayjs` duplication.

### Decision 5: State Management — React `useState` + adapter calls (no global store)

**Choice**: Local component state with direct adapter calls; no Redux/Zustand.

**Rationale**: The data model is flat (list of goals). A global store would be over-engineering. The dashboard refetches on each mutation, which is acceptable for this scale.

## Risks / Trade-offs

- **`localStorage` size limit (~5 MB)** → Mitigation: Goals are text-only objects; limit is unlikely to be reached in demo use. Warn in README.
- **PostgreSQL connection pooling in serverless** → Mitigation: Use `pg.Pool` with a small `max: 5` setting; add `DATABASE_URL` to Vercel env. For production scale, swap to PgBouncer or Neon serverless driver later.
- **No auth means all goals are globally readable in production mode** → Mitigation: Acceptable for MVP; documented as known limitation.
- **`NEXT_PUBLIC_STORAGE_MODE` is a build-time env for the client** → The `ApiAdapter` path always works regardless of this var; the var only determines which adapter the client instantiates. Mitigation: Document clearly.

## Migration Plan

1. **Demo mode (default)**: No DB needed. Set `NEXT_PUBLIC_STORAGE_MODE=demo`. App runs fully client-side.
2. **Production mode**: 
   - Provision PostgreSQL instance, set `DATABASE_URL`
   - Run migration: `CREATE TABLE goals (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, end_date DATE NOT NULL, completed BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`
   - Set `NEXT_PUBLIC_STORAGE_MODE=production`
3. **Rollback**: Switch env var back to `demo`; no data is lost from `localStorage`.

## Open Questions

- Should completed goals show the date they were completed, or only the original end date? (Assumed: original end date for MVP.)
- Is there a maximum number of goals per column before pagination is needed? (Assumed: no limit for MVP; scroll.)
