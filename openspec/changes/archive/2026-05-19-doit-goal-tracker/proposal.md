## Why

Users need a lightweight, motivating goal-tracking tool that makes it effortless to define personal goals, track deadlines, and celebrate completions — all without the friction of complex project management software. This is the initial build of the "Do It" application.

## What Changes

- **New**: Two-column dashboard showing active goals (left) and completed goals (right)
- **New**: Goal cards displaying title, days remaining, and urgency highlighting (≤3 days to deadline)
- **New**: Checkbox interaction to mark goals complete, moving them to the completed column
- **New**: Permanent deletion of goals from either column
- **New**: "Add Goal" modal with title and end date fields
- **New**: Environment-variable-driven storage: `localStorage` (demo mode) vs. PostgreSQL via Next.js API routes (production mode)
- **New**: Orange design theme ("The Radiant Editorial") with warm citrus palette, pill buttons, tonal layering

## Capabilities

### New Capabilities

- `goal-management`: Core CRUD for goals — create with title/end date, list active vs. completed, mark complete, delete permanently
- `goal-dashboard`: Two-column layout rendering active and completed goal lists with days-remaining countdown and urgency highlighting
- `storage-adapter`: Abstraction layer that switches between `localStorage` (when `NEXT_PUBLIC_STORAGE_MODE=demo`) and PostgreSQL via Next.js API routes (when `NEXT_PUBLIC_STORAGE_MODE=production`)

### Modified Capabilities

<!-- None — this is a greenfield application -->

## Impact

- **New Next.js app** under the `doit_root` pnpm workspace
- **New API routes** (`/api/goals`) for production mode backed by PostgreSQL (via `pg` or Prisma)
- **Dependencies**: `pg` or Prisma for DB, `date-fns` for countdown calculation, `@shadcn/ui` + Tailwind for component library
- **Environment variables**: `NEXT_PUBLIC_STORAGE_MODE` (`demo` | `production`), `DATABASE_URL` (production only)
- **Rollback plan**: Storage adapter pattern means switching back to `demo` mode requires only an env var change; no data migration needed
- **Affected teams**: Solo / greenfield — no downstream consumers
