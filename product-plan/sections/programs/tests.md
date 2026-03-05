# Test Instructions: Programs

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

The Programs section manages cross-entity strategic initiatives. Key functionality to test includes: viewing a dashboard of programs, creating/editing programs with leads and linked objectives, viewing program details with progress and activity feed, and filtering/searching programs.

---

## User Flow Tests

### Flow 1: View Programs Dashboard

**Scenario:** User navigates to the Programs section to see all programs

#### Success Path

**Setup:**
- Multiple programs exist with different leads, objectives, and progress levels

**Steps:**
1. User navigates to `/programs`
2. User sees the Programs dashboard with a list of program cards
3. Each card shows: program name, description, program leads (with initials), linked objectives count, overall progress %, and entity tags

**Expected Results:**
- [ ] Program cards are visible with correct data
- [ ] Progress percentage is shown (rolled up from linked objectives)
- [ ] Program leads are displayed with avatar initials
- [ ] Entity tags are shown as chips
- [ ] "New Program" button is visible

---

### Flow 2: Create a New Program

**Scenario:** User creates a new cross-entity strategic program

#### Success Path

**Setup:**
- Available leads, objectives, and entities are loaded
- User is on the programs dashboard

**Steps:**
1. User clicks "New Program" button
2. Slide-in panel appears from the right
3. User enters program name: "Global Revenue Acceleration"
4. User enters description
5. User selects one or more program leads (checkboxes)
6. User optionally selects linked objectives
7. User selects entities involved (toggle buttons)
8. User clicks "Create Program"

**Expected Results:**
- [ ] Form panel slides in from the right
- [ ] New program appears in the dashboard
- [ ] Program card shows correct name, leads, and entity tags
- [ ] Form panel closes after successful creation
- [ ] Progress shows 0% if no objectives linked yet

#### Failure Path: Missing Required Fields

**Setup:**
- User opens create form but leaves required fields empty

**Steps:**
1. User opens the "New Program" form
2. User leaves the name field empty
3. User clicks "Create Program"

**Expected Results:**
- [ ] "Create Program" button is disabled when name is empty
- [ ] Button is also disabled when no leads selected or no entities selected
- [ ] Validation messages shown: "Please select at least one program lead" and "Please select at least one entity"
- [ ] Form is not submitted

---

### Flow 3: View Program Details

**Scenario:** User clicks a program to view its full details

#### Success Path

**Setup:**
- A program exists with linked objectives and activity updates

**Steps:**
1. User clicks on a program card
2. User is navigated to the program detail page
3. User sees program header with name, description, leads, and entity tags
4. User sees linked objectives list with individual progress bars
5. User sees progress chart
6. User sees activity feed

**Expected Results:**
- [ ] Program name and description are displayed prominently
- [ ] All program leads shown with initials and names
- [ ] Entity tags displayed in header
- [ ] Linked objectives rendered as list with progress
- [ ] Activity feed shows recent updates
- [ ] "Edit" and "Delete" buttons are visible
- [ ] "Back to Programs" navigation works

---

### Flow 4: Edit an Existing Program

**Scenario:** User edits a program to update its details or reassign objectives

#### Success Path

**Steps:**
1. User navigates to program detail
2. User clicks "Edit" button
3. Slide-in form panel appears pre-populated with existing data
4. User modifies the program name
5. User adds/removes a program lead
6. User clicks "Save Changes"

**Expected Results:**
- [ ] Form pre-populates with existing program data
- [ ] Checkboxes show currently selected leads/objectives
- [ ] "Save Changes" button label (not "Create Program")
- [ ] After save, program detail updates to reflect changes
- [ ] Form panel closes

---

### Flow 5: Delete a Program

**Scenario:** User deletes a program from the detail view

**Steps:**
1. User navigates to program detail
2. User clicks "Delete" button
3. Deletion is confirmed (if confirmation dialog shown)
4. User is redirected back to programs dashboard

**Expected Results:**
- [ ] Program is removed from the dashboard
- [ ] If last program deleted, empty state is shown
- [ ] User is navigated back to dashboard

---

### Flow 6: Search and Filter Programs

**Scenario:** User searches for a specific program or filters by lead/entity

**Steps:**
1. User types in the search bar
2. Program cards filter in real-time

**Expected Results:**
- [ ] Search filters programs by name
- [ ] Filter by lead shows only programs with that lead
- [ ] Filter by entity shows only programs involving that entity
- [ ] "No results" state shown when nothing matches
- [ ] Clearing filters restores all programs

---

## Empty State Tests

### Primary Empty State

**Scenario:** No programs exist yet (first-time user or all deleted)

**Setup:**
- Programs list is empty (`[]`)

**Expected Results:**
- [ ] Empty state message is visible (e.g., "No programs yet")
- [ ] Helpful description shown
- [ ] "New Program" or "Create Program" CTA is visible and functional
- [ ] No blank screen

### Program with No Linked Objectives

**Scenario:** A program exists but has no linked objectives

**Setup:**
- Program with `linkedObjectives: []`

**Expected Results:**
- [ ] Program renders in dashboard (0% progress shown)
- [ ] Detail view shows "No objectives linked yet" empty state
- [ ] "Edit Program" CTA shown to add objectives
- [ ] No crashes or missing sections

### Search/Filter Empty State

**Scenario:** Filter/search returns no results

**Expected Results:**
- [ ] "No programs found" message displayed
- [ ] Option to clear filters shown

---

## Component Interaction Tests

### ProgramCard

- [ ] Displays program name, description, and progress percentage
- [ ] Shows lead initials in avatar circles
- [ ] Shows entity tags as chips
- [ ] Shows linked objectives count
- [ ] Clicking the card calls `onView` with the program id

### ProgramForm

- [ ] "Create Program" / "Save Changes" button disabled when required fields empty
- [ ] Lead checkboxes toggle lead selection
- [ ] Entity toggle buttons highlight selected entities
- [ ] Objective checkboxes multi-select linked objectives
- [ ] Clicking cancel calls `onCancel`
- [ ] Pressing X in header calls `onCancel`

### ProgramDetail

- [ ] Clicking "Back to Programs" calls `onBack`
- [ ] Clicking "Edit" calls `onEdit`
- [ ] Clicking "Delete" calls `onDelete`
- [ ] Clicking an objective in the list calls `onViewObjective` with objective id

---

## Edge Cases

- [ ] Program with many linked objectives (10+) renders without layout issues
- [ ] Long program names truncate gracefully on cards
- [ ] Program with multiple leads displays all leads correctly
- [ ] Progress percentage clamped between 0% and 100%
- [ ] After creating first program, empty state disappears and card appears
- [ ] After deleting last program, empty state reappears

---

## Accessibility Checks

- [ ] All form fields have associated labels
- [ ] Checkboxes for leads and objectives are keyboard accessible
- [ ] Slide-in panel is focusable and can be dismissed with Escape
- [ ] Error messages are announced to screen readers

---

## Sample Test Data

```typescript
const mockLead = {
  userId: "user-001",
  name: "Sarah Chen",
  email: "sarah.chen@company.com",
  initials: "SC"
}

const mockObjective = {
  id: "obj-001",
  title: "Expand market share in enterprise segment",
  organizationalUnit: "Germany",
  owner: "Sarah Chen",
  progress: 45
}

const mockProgram = {
  id: "prog-001",
  name: "Global Revenue Acceleration",
  description: "Cross-entity initiative to accelerate revenue growth",
  leads: [mockLead],
  linkedObjectives: [mockObjective],
  entitiesInvolved: ["Germany", "UK", "India"],
  overallProgress: 45,
  activityUpdates: []
}

const mockProgramWithNoObjectives = {
  ...mockProgram,
  id: "prog-002",
  linkedObjectives: [],
  overallProgress: 0
}

const mockEmptyPrograms: typeof mockProgram[] = []
```
