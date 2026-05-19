## ADDED Requirements

### Requirement: Environment-variable-driven storage mode selection
The system SHALL select its storage backend based on the `NEXT_PUBLIC_STORAGE_MODE` environment variable. A value of `demo` SHALL use `localStorage`; a value of `production` SHALL use PostgreSQL via Next.js API routes. Any other value SHALL default to `demo` and log a warning.

#### Scenario: Demo mode uses localStorage
- **WHEN** `NEXT_PUBLIC_STORAGE_MODE` is set to `demo`
- **THEN** all goal reads and writes are performed against `window.localStorage` under the key `doit_goals`, with no network requests to `/api/goals`

#### Scenario: Production mode uses API routes backed by PostgreSQL
- **WHEN** `NEXT_PUBLIC_STORAGE_MODE` is set to `production`
- **THEN** all goal reads and writes are performed via HTTP calls to `/api/goals` endpoints, which execute SQL against the PostgreSQL database specified by `DATABASE_URL`

#### Scenario: Unknown mode falls back to demo
- **WHEN** `NEXT_PUBLIC_STORAGE_MODE` is set to an unrecognised value
- **THEN** the system SHALL behave as if the value were `demo` and SHALL log a console warning

### Requirement: StorageAdapter interface contract
Both storage implementations SHALL conform to the same `StorageAdapter` interface: `listGoals()`, `createGoal(data)`, `updateGoal(id, data)`, and `deleteGoal(id)`. All methods SHALL return Promises and resolve to typed `Goal` objects or `void`.

#### Scenario: Adapter methods return consistent Goal shape
- **WHEN** `createGoal` is called on either the `LocalStorageAdapter` or `ApiAdapter`
- **THEN** the resolved value SHALL be a `Goal` object containing `id`, `title`, `endDate`, `completed`, and `createdAt`

### Requirement: LocalStorageAdapter persistence
The `LocalStorageAdapter` SHALL serialize the goals array as JSON under the `localStorage` key `doit_goals`. On initialisation, if the key is absent it SHALL treat the goal list as empty.

#### Scenario: Goals persist across page reloads in demo mode
- **WHEN** a user creates a goal in demo mode and reloads the page
- **THEN** the goal still appears in the active column

#### Scenario: Empty storage initialises to empty list
- **WHEN** `localStorage` has no `doit_goals` key
- **THEN** `listGoals()` resolves to an empty array

### Requirement: PostgreSQL schema for production mode
In production mode the system SHALL use a `goals` table with columns: `id` (UUID, primary key, default `gen_random_uuid()`), `title` (TEXT NOT NULL), `end_date` (DATE NOT NULL), `completed` (BOOLEAN NOT NULL DEFAULT false), `created_at` (TIMESTAMPTZ NOT NULL DEFAULT now()).

#### Scenario: Goals table migration runs without error
- **WHEN** the migration SQL is executed against a fresh PostgreSQL database
- **THEN** the `goals` table is created with all required columns and constraints

### Requirement: REST API routes for production mode
The system SHALL expose the following API routes when in production mode:
- `GET /api/goals` — returns all goals as a JSON array
- `POST /api/goals` — creates a new goal, returns the created goal
- `PATCH /api/goals/[id]` — updates `completed` or other fields, returns the updated goal
- `DELETE /api/goals/[id]` — deletes the goal, returns 204

#### Scenario: GET /api/goals returns JSON array
- **WHEN** a `GET` request is made to `/api/goals`
- **THEN** the response is `200 OK` with a JSON array of goal objects

#### Scenario: POST /api/goals creates and returns goal
- **WHEN** a `POST` request with `{ title, endDate }` body is made to `/api/goals`
- **THEN** the response is `201 Created` with the persisted goal object including its generated `id`

#### Scenario: DELETE /api/goals/[id] removes goal
- **WHEN** a `DELETE` request is made to `/api/goals/<valid-id>`
- **THEN** the response is `204 No Content` and the goal no longer appears in `GET /api/goals`
