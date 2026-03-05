# Test Instructions: OKR Rituals

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

The OKR Rituals section lets users schedule and facilitate structured OKR sessions (planning, check-ins, reviews, retrospectives). Key functionality: viewing upcoming/recent rituals, creating rituals linked to sprints, facilitating sessions with live note-taking, and completing rituals.

---

## User Flow Tests

### Flow 1: View Rituals Dashboard

**Scenario:** User views upcoming and recent rituals

#### Success Path

**Setup:**
- Multiple rituals exist across different sprints and types
- Some are upcoming (within next 14 days), some are completed

**Steps:**
1. User navigates to `/rituals`
2. User sees the OKR Rituals dashboard with header and "New Ritual" button
3. User sees "Upcoming Rituals" section with rituals in the next 14 days
4. User sees "Recent Rituals" section with last completed rituals

**Expected Results:**
- [ ] "OKR Rituals" heading is visible
- [ ] "New Ritual" button is visible
- [ ] Ritual cards show: type badge (Planning/Check-in/Review/Retrospective), title, date, time, sprint name, participant count, facilitator
- [ ] Completed rituals show a checkmark icon
- [ ] Upcoming rituals show a "Start" button
- [ ] Sprint filter dropdown is present and defaults to "All Sprints"

---

### Flow 2: Create a New Ritual

**Scenario:** User schedules a new ritual session

#### Success Path

**Setup:**
- Available sprints are loaded

**Steps:**
1. User clicks "New Ritual" button
2. Slide-in form panel appears from the right
3. User selects "Check-in" ritual type
4. User enters title: "February Check-in"
5. User selects a sprint from the dropdown
6. User selects date/time
7. User enters facilitator name
8. User enters participant count
9. User clicks "Schedule Ritual"

**Expected Results:**
- [ ] Form panel slides in from right
- [ ] Ritual type toggles highlight the selected type
- [ ] After submit, ritual appears in dashboard (in upcoming or recent as appropriate)
- [ ] Form closes after successful creation

#### Failure Path: Missing Required Fields

**Steps:**
1. User opens form but leaves title empty
2. User clicks "Schedule Ritual"

**Expected Results:**
- [ ] "Schedule Ritual" button is disabled when title, sprint, datetime, or facilitator is missing
- [ ] Form is not submitted

---

### Flow 3: Facilitate a Ritual

**Scenario:** User opens a ritual and captures notes during the session

#### Success Path

**Setup:**
- An upcoming ritual exists

**Steps:**
1. User clicks "Start" on an upcoming ritual card
2. User is navigated to the facilitation view
3. User sees ritual header with type, date, sprint, participants
4. User types notes in the large textarea
5. User clicks "Save Notes"
6. User clicks "Mark as Completed"

**Expected Results:**
- [ ] Facilitation view shows ritual details in header
- [ ] Notes textarea is visible and editable
- [ ] "Unsaved changes" indicator appears when notes are modified
- [ ] Clicking "Save Notes" calls `onSaveNotes` with notes content
- [ ] "Save Notes" button disabled when no changes
- [ ] Clicking "Mark as Completed" calls `onMarkCompleted`
- [ ] After completing, notes section becomes read-only

#### Failure Path: Unsaved Notes

**Steps:**
1. User types notes
2. User clicks "Mark as Completed" without saving first

**Expected Results:**
- [ ] Notes are auto-saved before completing (or user is warned)
- [ ] Notes are not lost when marking as completed

---

### Flow 4: View Completed Ritual Notes

**Scenario:** User reviews notes from a past ritual

**Steps:**
1. User clicks on a completed ritual card
2. User sees the facilitation view in read-only mode

**Expected Results:**
- [ ] "Session Notes" heading (not "Capture Notes")
- [ ] Notes are displayed as read-only formatted text
- [ ] Edit and Delete buttons are hidden for completed rituals
- [ ] "Mark as Completed" button is not shown

---

### Flow 5: Filter by Sprint

**Scenario:** User filters rituals to see only one sprint

**Steps:**
1. User clicks the sprint filter dropdown
2. User selects "Sprint 26.1"

**Expected Results:**
- [ ] Only rituals linked to Sprint 26.1 are shown
- [ ] `onFilterBySprint` is called with the sprint id
- [ ] Selecting "All Sprints" restores all rituals

---

## Empty State Tests

### No Rituals at All

**Scenario:** No rituals exist (first-time user)

**Setup:**
- `rituals: []`

**Expected Results:**
- [ ] Empty state shown (not blank screen)
- [ ] "No rituals found" message displayed
- [ ] "Schedule First Ritual" CTA is visible and calls `onCreate`

### No Upcoming Rituals

**Scenario:** Rituals exist but none are upcoming in the next 14 days

**Setup:**
- Only completed or far-future rituals exist

**Expected Results:**
- [ ] "Upcoming Rituals" section shows empty state with "No upcoming rituals" message
- [ ] "Schedule First Ritual" CTA is visible within that section
- [ ] "Recent Rituals" section still renders with completed rituals

### Filtered Sprint Has No Rituals

**Scenario:** User selects a sprint with no associated rituals

**Expected Results:**
- [ ] "No rituals found" empty state with "Try selecting a different sprint" guidance
- [ ] "Schedule First Ritual" button visible

### Completed Ritual with No Notes

**Scenario:** Ritual is completed but no notes were captured

**Setup:**
- `ritual.status === 'completed'` and `ritual.notes === ''`

**Expected Results:**
- [ ] "No notes were captured for this session." message shown
- [ ] No crash or missing sections

---

## Component Interaction Tests

### RitualCard

- [ ] Displays ritual type badge with correct color (teal=planning, blue=check-in, purple=review, amber=retrospective)
- [ ] Shows formatted date and time
- [ ] Shows sprint name
- [ ] Shows participant count
- [ ] Shows facilitator name
- [ ] Completed rituals show checkmark icon
- [ ] Clicking card calls `onView`
- [ ] Clicking "Start" button (upcoming only) calls `onFacilitate` (not `onView`)
- [ ] "Start" button click does NOT bubble to card click

### RitualFacilitation

- [ ] Shows "Capture Notes" for upcoming/in-progress rituals
- [ ] Shows "Session Notes" for completed rituals
- [ ] Notes textarea only rendered for non-completed rituals
- [ ] "Unsaved changes" badge appears when notes differ from initial
- [ ] "Save Notes" button enabled only when there are unsaved changes
- [ ] Clicking "Back to Dashboard" calls `onBack`
- [ ] Edit/Delete buttons hidden for completed rituals

### RitualForm

- [ ] Shows "Schedule New Ritual" heading in create mode
- [ ] Shows "Edit Ritual" heading in edit mode
- [ ] Ritual type selection highlights selected type
- [ ] "Schedule Ritual" / "Save Changes" button disabled when required fields empty
- [ ] Clicking Cancel calls `onCancel`

---

## Edge Cases

- [ ] Ritual exactly 14 days from now appears in upcoming (boundary condition)
- [ ] Ritual 15 days from now does NOT appear in upcoming
- [ ] Recent rituals limited to last 4 completed
- [ ] Very long ritual title truncates on card without layout break
- [ ] Notes with markdown (##, -, **bold**) display correctly in read-only mode
- [ ] After creating first ritual, empty state disappears and card appears
- [ ] After filtering by sprint, creating a ritual should still work

---

## Accessibility Checks

- [ ] Form fields have associated labels
- [ ] Ritual type selection buttons are keyboard accessible
- [ ] Sprint filter dropdown is keyboard accessible
- [ ] Notes textarea has accessible label
- [ ] "Mark as Completed" button has clear purpose
- [ ] Back button is keyboard accessible

---

## Sample Test Data

```typescript
const mockSprint = {
  id: "26.1",
  name: "Sprint 26.1",
  startDate: "2026-01-01",
  endDate: "2026-03-31",
  status: "active" as const
}

const mockUpcomingRitual = {
  id: "ritual-001",
  type: "check-in" as const,
  title: "February Check-in",
  sprintId: "26.1",
  sprintName: "Sprint 26.1",
  dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  facilitator: "Sarah Chen",
  status: "upcoming" as const,
  notes: "",
  participantCount: 8,
  duration: 60
}

const mockCompletedRitual = {
  id: "ritual-002",
  type: "planning" as const,
  title: "Q1 2026 Planning Session",
  sprintId: "26.1",
  sprintName: "Sprint 26.1",
  dateTime: "2026-01-08T10:00:00Z",
  facilitator: "Marcus Weber",
  status: "completed" as const,
  notes: "## Key Decisions\n- Decision 1\n- Decision 2",
  participantCount: 12,
  duration: 120
}

const mockEmptyRituals: typeof mockUpcomingRitual[] = []
```
