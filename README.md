# DoIt — Goal Tracker App (OpenSpec-built)

> **Built with [OpenSpec](https://github.com/fission-ai/openspec)** — a spec-driven AI development workflow for coding agents.

---

## Medium Article


> **[Spec Kit vs. OpenSpec: I Built the Same App Twice to Find Out](https://medium.com/@raphaellondner/spec-kit-vs-openspec-i-built-the-same-app-twice-to-find-out-0fcdcfa08b46)** — *Published on Medium*
>
> This repo is the companion codebase for a Medium article walking through how to build a full-stack Next.js app using the OpenSpec spec-driven workflow with Claude Code — from proposal to archive in a single session.

---

## What Is This?

**Do It** is a personal goal-tracking web app. You define goals with a title, end date, and focus area (Personal / Professional). Goals nearing their deadline are highlighted in amber. Complete a goal with a checkbox; revert it if you checked it by accident. Edit or delete goals at any time.

The app runs fully client-side in **demo mode** (localStorage) and connects to **PostgreSQL** in **production mode** — switched by a single environment variable.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Lucide React |
| Design system | "Radiant Editorial" orange palette (custom Tailwind v4 theme) |
| Storage (demo) | `localStorage` via `LocalStorageAdapter` |
| Storage (prod) | PostgreSQL via `pg` + Next.js API routes |
| Language | TypeScript (strict) |
| Package manager | pnpm |

---

## Configuration

### Environment variables

Copy `.env.local.example` to `.env.local` and set the values:

```bash
cp .env.local.example .env.local
```

| Variable | Values | Description |
|---|---|---|
| `NEXT_PUBLIC_STORAGE_MODE` | `demo` (default) \| `production` | Switches between localStorage and PostgreSQL |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Required only when mode is `production` |

### Demo mode (no database needed)

Leave `NEXT_PUBLIC_STORAGE_MODE=demo` (or omit the variable entirely). The app runs fully in the browser with no backend required.

### Production mode (PostgreSQL)

1. Provision a PostgreSQL database.
2. Set `DATABASE_URL` and `NEXT_PUBLIC_STORAGE_MODE=production` in `.env.local`.
3. Run the migration:

```bash
psql $DATABASE_URL -f migrations/001_create_goals.sql
```

---

## Installation & Running

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/installation) — install globally if you don't have it:
  ```bash
  npm install -g pnpm
  ```

### Install dependencies

Clone this repo and install from the app directory:

```bash
git clone <repo-url>
cd <repo-folder>
pnpm install
```

### Set up environment

```bash
cp .env.local.example .env.local
# Edit .env.local if needed (defaults to demo/localStorage mode — no DB required)
```

### Run the dev server

```bash
pnpm dev
```

The app is available at [http://localhost:3002](http://localhost:3002).

### Production build

```bash
pnpm build
pnpm start
```

---

## Project Structure

```
.
├── app/
│   ├── api/goals/          # REST API routes (production mode)
│   ├── globals.css         # Tailwind v4 theme tokens (orange palette)
│   ├── layout.tsx          # Root layout with Plus Jakarta Sans + Inter
│   └── page.tsx            # Dashboard (two-column, full CRUD)
├── components/
│   ├── ui/                 # Button, Input, Checkbox, Dialog primitives
│   ├── GoalCard.tsx        # Goal card with days countdown + urgency highlight
│   └── GoalModal.tsx       # Add / Edit modal with Focus Area selector
├── lib/
│   ├── db.ts               # Singleton pg.Pool
│   └── storage/            # StorageAdapter pattern (LocalStorage + API)
├── migrations/             # SQL migration files
├── types/goal.ts           # Goal, CreateGoalInput, StorageAdapter types
├── design/orange/          # Reference design files (HTML + PNG screens)
└── openspec/               # Spec-driven change artifacts (see below)
```

---

## OpenSpec Artifacts

This app was built using the [OpenSpec](https://github.com/raphaellondner/openspec) spec-driven workflow. The full change history is archived at `openspec/changes/archive/2026-05-19-doit-goal-tracker/`.

### Change: `doit-goal-tracker`

| Artifact | Description | Link |
|---|---|---|
| Proposal | Why this was built and what changed | [proposal.md](openspec/changes/archive/2026-05-19-doit-goal-tracker/proposal.md) |
| Design | Technical decisions, architecture, trade-offs | [design.md](openspec/changes/archive/2026-05-19-doit-goal-tracker/design.md) |
| Tasks | 47-task implementation checklist | [tasks.md](openspec/changes/archive/2026-05-19-doit-goal-tracker/tasks.md) |

### Synced Specs (living requirements)

| Capability | Description | Link |
|---|---|---|
| `goal-management` | CRUD, data model, complete/revert/edit flows | [spec.md](openspec/specs/goal-management/spec.md) |
| `goal-dashboard` | Layout, days countdown, urgency, design theme | [spec.md](openspec/specs/goal-dashboard/spec.md) |
| `storage-adapter` | Env-var storage switching, adapters, REST API, PG schema | [spec.md](openspec/specs/storage-adapter/spec.md) |

---

## Chat Logs

Session transcripts showing the full Claude Code conversation — from proposal through implementation to archive.

| Session | Description | Link |
|---|---|---|
| Propose → Apply | Designing the change (proposal, design, specs, tasks) and implementing | [propose_to_apply.html](chat_logs/propose_to_apply.html) |
| Apply → Archive | Completing implementation and archiving | [propose_to_archive.html](chat_logs/propose_to_archive.html) |
