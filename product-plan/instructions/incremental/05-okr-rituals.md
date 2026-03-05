# Milestone 5: OKR Rituals

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

## Goal

Implement the OKR Rituals section — scheduling and facilitation of structured OKR sessions (planning, check-ins, reviews, retrospectives) linked to sprints.

## Overview

The OKR Rituals section enables users to schedule and facilitate structured sessions for managing OKRs throughout the sprint lifecycle. Users can create planning sessions, check-ins, reviews, and retrospectives linked to specific sprints, capture notes during facilitation, and access a history of past rituals. The dashboard provides an overview of upcoming and recent rituals organized by sprint.

**Key Functionality:**
- View dashboard of upcoming rituals (next 14 days) and recently completed rituals
- Create new rituals by selecting type, date/time, sprint, facilitator, and participant count
- Facilitate a ritual session by opening it and capturing notes in a markdown textarea
- Mark a ritual as completed to lock the notes
- Filter rituals by sprint to review historical sessions

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/okr-rituals/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/okr-rituals/components/`:

- `RitualsDashboard` — Main view with sprint filter, upcoming grid, and recent grid
- `RitualCard` — Individual ritual card with type badge, date/time, sprint, participants, Start button
- `RitualFacilitation` — Full detail/facilitation view with notes editor and complete action
- `RitualForm` — Slide-in panel for creating and editing rituals

### Data Layer

The components expect these data shapes (see `product-plan/sections/okr-rituals/types.ts`):

- `Ritual` — id, type (planning/check-in/review/retrospective), title, sprintId, sprintName, dateTime, facilitator, status (upcoming/in-progress/completed), notes, participantCount, duration
- `Sprint` — id, name, startDate, endDate, status

You'll need to:
- Create API endpoints for ritual CRUD
- Provide all available sprints for the filter and form dropdowns
- Store and retrieve notes per ritual
- Handle status transitions: upcoming → in-progress → completed
- Timestamp note saves server-side

### Callbacks to Wire Up

| Callback | Description |
|----------|-------------|
| `onCreate` | Open RitualForm in create mode |
| `onView(ritualId)` | Navigate to RitualFacilitation view for that ritual |
| `onFacilitate(ritualId)` | Navigate to RitualFacilitation (same as onView, but "Start" button intent) |
| `onEdit(ritualId)` | Open RitualForm pre-filled with ritual data |
| `onDelete(ritualId)` | Delete ritual with confirmation |
| `onFilterBySprint(sprintId)` | Filter rituals by sprint (pass filtered data to component) |
| `onSaveNotes(notes)` | Save notes to the database for the current ritual |
| `onMarkCompleted` | Update ritual status to "completed" in database |
| `onBack` | Navigate from facilitation view back to dashboard |
| `onSubmit(ritualData)` | Save create/edit form data to API |
| `onCancel` | Close the form panel |

### Empty States

- **No rituals at all:** Show "No rituals found" with "Schedule First Ritual" CTA
- **No upcoming rituals (next 14 days):** Show "No upcoming rituals" with "Schedule First Ritual" CTA within that section
- **Filtered sprint has no rituals:** Show "No rituals found" for that sprint with guidance to select another
- **Completed ritual with no notes:** Show "No notes were captured for this session."

## Files to Reference

- `product-plan/sections/okr-rituals/README.md` — Feature overview
- `product-plan/sections/okr-rituals/tests.md` — Test-writing instructions (TDD)
- `product-plan/sections/okr-rituals/components/` — React components
- `product-plan/sections/okr-rituals/types.ts` — TypeScript interfaces
- `product-plan/sections/okr-rituals/sample-data.json` — Test data

## Expected User Flows

### Flow 1: View Upcoming Rituals

1. User navigates to `/rituals`
2. User sees "Upcoming Rituals" section with rituals in the next 14 days
3. User sees "Recent Rituals" section with last completed rituals
4. **Outcome:** Dashboard gives clear view of what's coming and what's been done

### Flow 2: Schedule a New Ritual

1. User clicks "New Ritual"
2. User selects type "Check-in", enters title, selects sprint and date/time
3. User enters facilitator name and participant count
4. User clicks "Schedule Ritual"
5. **Outcome:** Ritual appears in the dashboard (in upcoming if within 14 days)

### Flow 3: Facilitate a Session

1. User clicks "Start" on an upcoming ritual card
2. Facilitation view opens with ritual header details
3. User types meeting notes in the large textarea
4. User clicks "Save Notes" periodically
5. User clicks "Mark as Completed" when done
6. **Outcome:** Notes saved and locked, ritual moves to completed status

### Flow 4: Review Past Notes

1. User clicks on a completed ritual card
2. Facilitation view opens in read-only mode
3. **Outcome:** Past notes displayed for reference

### Flow 5: Browse by Sprint

1. User selects a sprint from the filter dropdown
2. Only rituals for that sprint are displayed
3. **Outcome:** Historical view of all rituals in a specific sprint

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] Dashboard renders upcoming and recent rituals from real data
- [ ] Sprint filter works
- [ ] Create/edit/delete ritual works end-to-end
- [ ] Facilitation view opens with correct ritual data
- [ ] Notes save and persist to database
- [ ] "Mark as Completed" transitions status and locks notes
- [ ] Completed ritual shows notes in read-only mode
- [ ] All empty states display correctly
- [ ] Responsive on mobile
