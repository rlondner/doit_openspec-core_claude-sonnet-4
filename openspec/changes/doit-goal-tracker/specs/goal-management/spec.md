## ADDED Requirements

### Requirement: Create a new goal
The system SHALL allow a user to create a goal by providing a title, an end date and a focus area (Personal|Professional). The goal SHALL be persisted via the active storage adapter and appear in the active goals list immediately after creation.

#### Scenario: Successful goal creation
- **WHEN** a user fills in a non-empty title and a valid future end date in the "Add Goal" modal and submits
- **THEN** the goal is saved to storage and appears in the active goals column with the correct title and days-remaining count

#### Scenario: Missing title prevents submission
- **WHEN** a user submits the "Add Goal" form with an empty title field
- **THEN** the form SHALL display a validation error and NOT create a goal

#### Scenario: Missing end date prevents submission
- **WHEN** a user submits the "Add Goal" form with no end date selected
- **THEN** the form SHALL display a validation error and NOT create a goal

### Requirement: Mark a goal as complete
The system SHALL allow a user to mark an active goal as complete using a checkbox control. Upon completion the goal SHALL be removed from the active column and added to the completed column.

#### Scenario: Checking the goal checkbox
- **WHEN** a user clicks the checkbox on an active goal card
- **THEN** the goal's `completed` field is set to `true` in storage and the card moves from the active column to the completed column

### Requirement: Revert a completed goal to active
The system SHALL allow a user to revert a completed goal back to active status by unchecking the checkbox on the completed goal card. The goal SHALL be removed from the completed column and returned to the active column.

#### Scenario: Unchecking the checkbox on a completed goal card
- **WHEN** a user unchecks the checkbox on a completed goal card
- **THEN** the goal's `completed` field is set to `false` in storage and the card moves from the completed column back to the active column

#### Scenario: Reverted goal is editable again
- **WHEN** a goal has been reverted to active status
- **THEN** the edit icon SHALL be visible on the card and the goal can be edited via the modal

### Requirement: Edit a goal
The system SHALL allow a user to edit an active goal using an clickable edit icon which launches the `add_new_goal_modal_orange` modal. Upon validation of the modal, the active goals list SHALL be refreshed in the active column.

#### Scenario: Pressing the Edit goal icon
- **WHEN** a user clicks the Edit icon on an active goal card
- **THEN** the `add_new_goal_modal_orange` modal pops up and allows the user to update title, end date and focus area fields


#### Scenario: Pressing the Save Changes button
- **WHEN** a user clicks the Save Changes in the Edit Goal modal
- **THEN** the goal is saved to storage and appears in the active goals column with the correct title and days-remaining count

#### Scenario: Cancelling the Edit Goal modal
- **WHEN** a user clicks Cancel or presses Escape in the Edit Goal modal
- **THEN** the modal closes and the goal remains unchanged in storage

### Requirement: Delete a goal permanently
The system SHALL allow a user to permanently delete a goal from either the active or completed column. Deletion SHALL be irreversible and remove the goal from storage entirely.

#### Scenario: Delete an active goal
- **WHEN** a user clicks the delete action on an active goal card
- **THEN** the goal is removed from storage and no longer appears in the active column

#### Scenario: Delete a completed goal
- **WHEN** a user clicks the delete action on a completed goal card
- **THEN** the goal is removed from storage and no longer appears in the completed column

### Requirement: Goal data model
Each goal SHALL contain the following fields: a unique identifier (`id`), a non-empty `title` string, an `endDate` date value, a `completed` boolean, a `focus_area` string field (personal|professional) and a `createdAt` timestamp.

#### Scenario: New goal has required fields
- **WHEN** a new goal is created
- **THEN** the persisted goal record SHALL have a non-null `id`, `title`, `endDate`, `completed` (false), `focus_area`, and `createdAt`
