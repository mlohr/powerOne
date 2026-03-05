# OKR Hierarchy — Test Instructions

## Overview

These tests cover the OKR Hierarchy section: the main list view, objective/key result forms, filter system, and task management. Tests are framework-agnostic and describe user flows and expected behaviors.

---

## 1. List View — Full Mode

### 1.1 Default Render
- [ ] Page renders with header "OKR Hierarchy"
- [ ] Subheading "Manage objectives and key results across all organizational levels" is visible
- [ ] View mode buttons (full, compact, hierarchy) are visible
- [ ] "New Key Result" and "New Objective" buttons are visible
- [ ] Breadcrumb shows "All Organizations > [entity] > [domain]"

### 1.2 Objective Cards
- [ ] Each objective card shows: title, description, owner avatar+name, status badge, progress bar+%, organizational unit badge, sprint
- [ ] Progress bars render with correct width (e.g., 65% = 65% width)
- [ ] Status badges use correct colors (teal=Active, slate=Draft, emerald=Done, red=Cancelled)
- [ ] Organizational unit badges use level colors (purple=Group, teal=Entity, blue=Domain, amber=Department, rose=Team)

### 1.3 Expand/Collapse
- [ ] Clicking an objective card expands it to show Key Results
- [ ] Clicking again collapses it
- [ ] Expanded section shows "Key Results" header and "+ Add Key Result" button
- [ ] Each Key Result shows: numbered badge, title, progress bar+%, status badge
- [ ] Key Results with linked child objectives show "Cascades to objective" link with arrow icon

### 1.4 Parent/Child Links
- [ ] Full view shows "↑ Cascades from: [parent title]" for child objectives
- [ ] Full view shows "↓ Cascades to: [child titles]" for parent objectives
- [ ] Clicking a cascade link scrolls to and highlights the linked objective
- [ ] Highlighted objective has teal border and ring effect
- [ ] Highlight disappears after ~2 seconds
- [ ] When navigating to an objective, breadcrumb changes to show OKR cascade path

### 1.5 Programs
- [ ] Objectives belonging to programs show program names in teal/blue text
- [ ] Objectives with no programs don't show the programs row

---

## 2. Compact View

### 2.1 Layout
- [ ] Clicking compact view button switches to compact layout
- [ ] Active view button has white background and teal icon
- [ ] Compact rows show: expand chevron, title, owner (avatar+name), status, progress, org unit badge
- [ ] No description shown in compact view

### 2.2 Expansion
- [ ] Clicking a compact row expands to show key results (same as full view)
- [ ] Expanded compact view shows key results with progress bars

---

## 3. Hierarchy View

### 3.1 Indentation
- [ ] Top-level objectives (no parent) have no indent
- [ ] Level-1 child objectives are indented 48px
- [ ] Level-2 child objectives are indented 96px
- [ ] Connector lines (vertical + horizontal) appear for child objectives

### 3.2 Cards
- [ ] Hierarchy view cards show: expand chevron, target icon, title, edit button, owner avatar, status, progress, org unit badge
- [ ] Child count shown when objective has children (e.g., "2 children")

---

## 4. Filter Bar

### 4.1 Filter Dropdowns
- [ ] "Organizational Unit" dropdown opens on click with search input and grouped options (by level)
- [ ] Selecting an org unit adds it to active filters
- [ ] "Status" dropdown shows all 6 statuses with checkboxes
- [ ] "Programs" dropdown shows available programs with checkboxes
- [ ] "Sprint" single-select dropdown with search
- [ ] "Owner" single-select dropdown with search

### 4.2 Active Filter Chips
- [ ] Selected org units appear as colored chips (using level colors)
- [ ] Selected statuses appear as colored chips (using status colors)
- [ ] Selected programs appear as indigo chips
- [ ] Selected sprint appears as cyan chip
- [ ] Selected owner appears as violet chip
- [ ] Clicking a chip removes that filter
- [ ] "Clear" button removes all active filters

### 4.3 Save Filter
- [ ] "Save" button appears when any filter is active
- [ ] Clicking "Save" shows name input and "Share" checkbox
- [ ] Entering a name and clicking "Save Filter" calls `onSaveAsNewFilter`
- [ ] Pressing Enter in name field also saves
- [ ] Pressing Escape cancels save

### 4.4 Update Filter
- [ ] When an active non-preset filter is loaded, "Update" button appears
- [ ] Clicking "Update" calls `onUpdateFilter` with current criteria

### 4.5 Active Filter Label
- [ ] When a filter is active, its name appears above the dropdowns with a filter icon
- [ ] Preset filters show a sparkle icon and "(Preset)" label

### 4.6 Search in Dropdowns
- [ ] Typing in org unit search filters the list
- [ ] Typing in sprint/owner search filters the list
- [ ] "No results found" shown when search has no matches
- [ ] Clicking outside dropdown closes it

---

## 5. Empty States

### 5.1 No Objectives
- [ ] When no objectives match filter criteria, a message is shown (implementation-defined)
- [ ] "Clear" button is still visible to reset filters

### 5.2 No Key Results
- [ ] Expanding an objective with no key results shows only the "+ Add Key Result" button

---

## 6. Objective Form

### 6.1 Create Mode
- [ ] Clicking "New Objective" opens the side panel
- [ ] Panel has header "New Objective" with target icon
- [ ] Required fields: Title, Description, Organizational Unit, Owner, Status, Sprint
- [ ] Organizational Unit select is grouped by level (Group, Entity, Domain, Department, Team)
- [ ] Status defaults to "Draft"
- [ ] Sprint defaults to active sprint (if available)
- [ ] Programs shown as checkboxes (multi-select)
- [ ] Parent Objective shown as optional select (excludes self in edit mode)
- [ ] "Create Objective" button submits the form
- [ ] "Cancel" button closes without submitting
- [ ] Clicking overlay closes the panel

### 6.2 Edit Mode
- [ ] Clicking "Edit" on an objective opens the panel in edit mode
- [ ] Panel has header "Edit Objective"
- [ ] All fields pre-populated with objective data
- [ ] "Save Changes" button submits
- [ ] "Delete" button (red, with trash icon) calls `onDeleteObjective`

### 6.3 Validation
- [ ] Required fields prevent submission when empty
- [ ] Form shows native browser validation

---

## 7. Key Result Form

### 7.1 Create Mode
- [ ] Clicking "New Key Result" opens the side panel
- [ ] Panel has header "New Key Result" with trending up icon
- [ ] Required fields: Title, Objective, Status
- [ ] When opened from expanded objective, that objective is pre-selected
- [ ] Shows selected objective preview box (title + description)
- [ ] "Link to Child Objective" select shows lower-level objectives only
- [ ] Cascading info box explains how linking works

### 7.2 Metrics
- [ ] At least 1 metric required (name, scale, baseline, target, direction)
- [ ] "Add Metric" button adds up to 3 metrics
- [ ] Remove button (minus icon) removes a metric (not shown when only 1)
- [ ] Scale options: Percentage, Absolute Number, Score
- [ ] Direction options: Increase, Decrease
- [ ] Visual preview shows "MetricName: baseline → target (↑/↓)" when name is entered

### 7.3 Edit Mode
- [ ] Edit mode pre-fills title, objective, status, linked child objective
- [ ] "Delete" button calls `onDeleteKeyResult`

---

## 8. Task Management

### 8.1 Task List
- [ ] Each Key Result shows a "Tasks" toggle at the bottom
- [ ] Toggle shows count: "(N open, M completed)"
- [ ] Clicking toggle expands/collapses the task list
- [ ] Open tasks shown first, completed tasks below with a divider
- [ ] Completed tasks section has 75% opacity

### 8.2 Task Items
- [ ] Each task shows: checkbox, description, owner avatar+name, relative timestamp
- [ ] Completed tasks have strikethrough text
- [ ] Checkbox is teal when completed
- [ ] Hovering a task reveals edit and delete buttons
- [ ] Clicking checkbox calls `onToggleTaskStatus`
- [ ] Clicking delete calls `onDeleteTask`
- [ ] Timestamps show relative time: "today", "yesterday", "N days ago", "N weeks ago"

### 8.3 Add Task
- [ ] "+ Add Task" link appears at bottom of expanded task list
- [ ] Clicking shows description input and owner select
- [ ] Owner defaults to current user
- [ ] Pressing Enter submits the task
- [ ] Pressing Escape cancels
- [ ] "Add" button disabled when description is empty
- [ ] After adding, input clears and form collapses

---

## 9. Filter Form (Custom Filter)

### 9.1 Create Mode
- [ ] Filter form opens as side panel
- [ ] Name input required
- [ ] Level toggle buttons (multi-select): Group, Entity, Domain, Department, Team
- [ ] Status toggle buttons (multi-select)
- [ ] Sprint single-select
- [ ] Owner single-select
- [ ] "Share" checkbox
- [ ] "Show Preview" button toggles a preview section
- [ ] Preview shows matched objectives count

### 9.2 Preview
- [ ] Preview lists active criteria (levels, statuses, sprint, owner)
- [ ] Shows "N objective(s) match this filter"
- [ ] When no criteria: "This filter will show all objectives"

### 9.3 Edit Mode
- [ ] Pre-fills all fields from existing filter
- [ ] Preset filters cannot be edited (form opens in create mode for presets)
- [ ] "Delete Filter" button calls `onDeleteFilter`

---

## 10. Accessibility

- [ ] All interactive elements are keyboard-accessible
- [ ] Form inputs have associated labels
- [ ] Buttons have descriptive text or aria-labels
- [ ] Checkboxes have aria-label or visible label
- [ ] Modals trap focus when open
- [ ] Color is not the only indicator of state (badges also have text)

---

## 11. Responsive Behavior

- [ ] On mobile (<768px): header actions stack vertically, filter bar wraps
- [ ] On tablet (768px-1024px): metadata grid shows 2 columns instead of 4
- [ ] On desktop (1024px+): full layout with all columns visible
