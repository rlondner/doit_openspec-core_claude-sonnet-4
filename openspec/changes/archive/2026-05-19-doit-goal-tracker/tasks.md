## 1. Project Scaffolding

- [x] 1.1 Initialize Next.js app (`doit-web`) inside the pnpm workspace, configuring `packageManager` and resolving `node_modules` two levels up in `doit_root`
- [x] 1.2 Configure `tsconfig.json` with strict TypeScript and path aliases
- [x] 1.3 Install and configure Tailwind CSS with the orange design token palette (`primary` #b43a10, `primary-container` #ff784e, surface hierarchy tokens)
- [x] 1.4 Install shadcn/ui and initialise component library (Button, Dialog, Input, Checkbox)
- [x] 1.5 Install `date-fns` for date arithmetic and `pg` for PostgreSQL client
- [x] 1.6 Add ESLint + Prettier configuration consistent with monorepo style
- [x] 1.7 Create `.env.local.example` documenting `NEXT_PUBLIC_STORAGE_MODE` and `DATABASE_URL`

## 2. Data Model & Types

- [x] 2.1 Define `Goal` TypeScript interface (`id`, `title`, `endDate`, `completed`, `focus_area`, `createdAt`) in `src/types/goal.ts`
- [x] 2.2 Define `CreateGoalInput` and `UpdateGoalInput` types
- [x] 2.3 Define `StorageAdapter` interface with `listGoals`, `createGoal`, `updateGoal`, `deleteGoal` methods

## 3. Storage Adapters

- [x] 3.1 Implement `LocalStorageAdapter` — reads/writes JSON array under `doit_goals` key; initialises to `[]` when key absent
- [x] 3.2 Implement `ApiAdapter` — calls `GET /api/goals`, `POST /api/goals`, `PATCH /api/goals/[id]`, `DELETE /api/goals/[id]`
- [x] 3.3 Implement `getStorageAdapter()` factory that reads `NEXT_PUBLIC_STORAGE_MODE` and returns the appropriate adapter (falls back to `LocalStorageAdapter` with console warning for unknown values)

## 4. API Routes (Production Mode)

- [x] 4.1 Create `app/api/goals/route.ts` handling `GET` (list all goals) and `POST` (create goal) using `pg.Pool`
- [x] 4.2 Create `app/api/goals/[id]/route.ts` handling `PATCH` (update goal) and `DELETE` (delete goal, returns 204)
- [x] 4.3 Create `lib/db.ts` with a singleton `pg.Pool` configured from `DATABASE_URL`
- [x] 4.4 Write the PostgreSQL migration SQL (`migrations/001_create_goals.sql`) with the `goals` table schema including the `focus_area` column

## 5. Goal Dashboard Layout

- [x] 5.1 Create the root dashboard page (`app/page.tsx`) with a two-column layout using Tailwind flex/grid
- [x] 5.2 Apply page-level background (`background` #fffbff) and column surface colors (`surface-container-low` #fdf9ed) with no 1px borders between sections
- [x] 5.3 Add column headings ("Active Goals" / "Completed Goals") using Plus Jakarta Sans `headline-md` in `primary` color
- [x] 5.4 Add the "Add Goal" primary CTA button with 135° gradient (`primary` → `primary-container`), white text, and rounded corners

## 6. Goal Card Component

- [x] 6.1 Create `GoalCard` component accepting a `Goal` prop plus `onToggleComplete`, `onEdit`, and `onDelete` callbacks
- [x] 6.2 Display goal title using Plus Jakarta Sans body typography in `on-surface` (#393831)
- [x] 6.3 Calculate and display days remaining using `date-fns` `differenceInCalendarDays`; show "Overdue" when negative
- [x] 6.4 Apply urgency highlight style (peach `tertiary-container` #fddeb0 background) when days remaining ≤ 3
- [x] 6.5 Render a shadcn `Checkbox` that triggers `onToggleComplete` on both check (active→complete) and uncheck (complete→active)
- [x] 6.6 Render an edit icon/button on active goal cards that triggers `onEdit`; hide edit icon on completed cards
- [x] 6.7 Render a delete icon/button that triggers `onDelete`
- [x] 6.8 Style the card using `surface-container-lowest` (#ffffff) on `surface-container-low`, `xl` border radius, no border lines, ambient shadow

## 7. Goal Modal (Add & Edit)

- [x] 7.1 Create `GoalModal` component using shadcn `Dialog`, accepting optional `goal` prop (populated = edit mode, absent = create mode)
- [x] 7.2 Add a controlled text `Input` for the goal title with validation (non-empty); pre-populate from `goal.title` in edit mode
- [x] 7.3 Add a date `Input` (type="date") for the end date with validation (required); pre-populate from `goal.endDate` in edit mode
- [x] 7.4 Add a Focus Area selector (Personal | Professional) mapped to `focus_area`; pre-populate from `goal.focus_area` in edit mode; default to `personal` in create mode
- [x] 7.5 Wire Submit button: call `createGoal` in create mode or `updateGoal` in edit mode, then close modal and refresh goal list
- [x] 7.6 Wire Cancel / Escape to close modal without saving
- [x] 7.7 Apply glassmorphism style to the modal overlay (`surface-container-lowest` at 80% opacity, `backdrop-filter: blur(12px)`)

## 8. Dashboard State & Data Flow

- [x] 8.1 Initialise goal list state in `app/page.tsx` with a `useEffect` call to `adapter.listGoals()` on mount
- [x] 8.2 Implement `handleAddGoal` — calls `adapter.createGoal`, appends to local state
- [x] 8.3 Implement `handleToggleComplete` — calls `adapter.updateGoal(id, { completed: !goal.completed })`, moves card between columns accordingly
- [x] 8.4 Implement `handleEdit` — opens `GoalModal` pre-populated with the selected goal; on save calls `adapter.updateGoal` and refreshes local state
- [x] 8.5 Implement `handleDelete` — calls `adapter.deleteGoal(id)`, removes card from the relevant list
- [x] 8.6 Pass active goals (filter `completed === false`) to the left column and completed goals to the right column

## 9. Design Polish

- [x] 9.1 Verify no explicit 1px borders exist in the layout — replace with background-color shifts where found
- [x] 9.2 Confirm Plus Jakarta Sans is loaded (Google Fonts or local) and applied to display/headline elements
- [x] 9.3 Confirm Inter is applied to all body/label text
- [x] 9.4 Match the dashboard layout to the reference screens in `design/orange/do_it_dashboard/screen.png` and `design/orange/add_new_goal_modal_orange/screen.png`
- [x] 9.5 Match the "edit/complete" card interactions to `design/orange/edit_existing_goal/screen.png`
