## ADDED Requirements

### Requirement: Two-column dashboard layout
The system SHALL render a two-column layout: a left column for active (incomplete) goals and a right column for completed goals. Both columns SHALL be visible simultaneously on the dashboard page.

#### Scenario: Dashboard renders two columns
- **WHEN** a user loads the dashboard
- **THEN** two labelled columns are displayed side by side — one for active goals and one for completed goals

### Requirement: Days remaining displayed on active goal cards
Each active goal card SHALL display the number of calendar days remaining until the goal's end date. The count SHALL be recalculated on each page load relative to the current date.

#### Scenario: Goal with future end date shows positive days remaining
- **WHEN** an active goal has an end date 10 days in the future
- **THEN** the goal card displays "10 days left" (or equivalent phrasing)

#### Scenario: Goal due today shows zero days remaining
- **WHEN** an active goal has an end date equal to today's date
- **THEN** the goal card displays "0 days left" (or equivalent phrasing)

#### Scenario: Overdue goal shows negative or "overdue" indicator
- **WHEN** an active goal has an end date in the past
- **THEN** the goal card SHALL visually indicate it is overdue (e.g., negative days or "Overdue" label)

### Requirement: Urgent goal highlighting
Active goal cards whose end date is within 3 calendar days from today (inclusive of today) SHALL be visually highlighted to signal urgency. The highlight SHALL use the `tertiary-container` peach tone per the design system.

#### Scenario: Goal due in 3 days or fewer is highlighted
- **WHEN** an active goal has an end date that is 0, 1, 2, or 3 days from today
- **THEN** the goal card is rendered with the urgency highlight style

#### Scenario: Goal due in 4 or more days is not highlighted
- **WHEN** an active goal has an end date that is 4 or more days from today
- **THEN** the goal card is rendered without the urgency highlight style

### Requirement: Completed goal cards show revert control
Each completed goal card SHALL display a checked checkbox. Unchecking it SHALL revert the goal to active status, removing it from the completed column and restoring it to the active column.

#### Scenario: Completed card shows checked checkbox
- **WHEN** a goal is in the completed column
- **THEN** its checkbox is rendered in a checked state

#### Scenario: Unchecking completed card checkbox reverts goal
- **WHEN** a user unchecks the checkbox on a completed goal card
- **THEN** the goal's `completed` field is set to `false` in storage and the card moves to the active column

### Requirement: Add Goal button opens modal
The dashboard SHALL provide a clearly labelled button ("Add Goal" or equivalent) that opens the goal creation modal when clicked.

#### Scenario: Clicking Add Goal button
- **WHEN** a user clicks the "Add Goal" button on the dashboard
- **THEN** the Add Goal modal opens with empty title, end date, and Focus Area fields

### Requirement: Add Goal modal fields and submission
The Add Goal modal SHALL contain a text input for the goal title, a date picker for the end date, and a Focus Area selector (Personal | Professional), plus a submit action and a dismiss/cancel action.

#### Scenario: Modal can be dismissed without saving
- **WHEN** a user opens the Add Goal modal and clicks Cancel or presses Escape
- **THEN** the modal closes and no goal is created

#### Scenario: Successful submission closes modal
- **WHEN** a user submits the Add Goal modal with valid data
- **THEN** the modal closes and the new goal appears in the active column

### Requirement: Orange "Radiant Editorial" design theme
The entire application SHALL implement the "Radiant Editorial" design system: warm citrus palette (`primary` #b43a10, `primary-container` #ff784e), tonal surface hierarchy (no 1px borders), Plus Jakarta Sans typography, and pill/rounded buttons. It SHALL follow the design files below:
following the design files:
- `design/orange/add_new_goal_modal_orange/code.html` — authoritative color tokens for the whole app
- `design/orange/do_it_dashboard/code.html` — dashboard layout reference (color tokens overridden by warm orange palette)
- `design/orange/edit_existing_goal/code.html` — edit goal modal layout reference


#### Scenario: Primary CTA button uses gradient
- **WHEN** the Add Goal submit button is rendered
- **THEN** it SHALL display the 135° linear gradient from `primary` (#b43a10) to `primary-container` (#ff784e) with white text and rounded corners

#### Scenario: No 1px solid borders used for section separation
- **WHEN** the dashboard layout is inspected
- **THEN** column or section boundaries SHALL be defined by background color shifts, NOT by explicit border lines
