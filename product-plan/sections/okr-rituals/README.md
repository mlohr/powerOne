# OKR Rituals

## Overview

The OKR Rituals section enables users to schedule and facilitate structured sessions for managing OKRs throughout the sprint lifecycle. Users can create planning sessions, check-ins, reviews, and retrospectives linked to specific sprints, capture notes during facilitation, and access a history of past rituals.

## User Flows

- View dashboard showing upcoming rituals (next 14 days), recent rituals, and "New Ritual" button
- Create a new ritual by selecting type, setting date/time, linking to a sprint, and setting facilitator
- Facilitate a ritual session by opening it and capturing notes in the markdown textarea
- Mark a ritual as completed to lock the notes
- View past rituals filtered by sprint to review historical notes
- Browse all rituals organized by sprint via sprint selector dropdown

## Design Decisions

- Ritual types have distinct colors: Planning (teal), Check-in (blue), Review (purple), Retrospective (amber)
- Dashboard splits rituals into "Upcoming" (next 14 days) and "Recent" (last 4 completed)
- Facilitation view uses a large monospace textarea to encourage structured markdown notes
- Completed rituals show notes in read-only mode
- Sprint filter persists during the session

## Data Used

**Entities:** `Ritual`, `Sprint`

**From global model:** Rituals reference Sprints from the OKR data model

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `RitualsDashboard` — Main view with sprint filter, upcoming rituals grid, and recent rituals grid
- `RitualCard` — Individual ritual card with type badge, date/time, sprint, participants, and Start button
- `RitualFacilitation` — Full detail/facilitation view with notes textarea and "Mark as Completed" action
- `RitualForm` — Slide-in panel for creating and editing rituals

## Callback Props

| Callback | Description |
|----------|-------------|
| `onCreate` | Called when user clicks "New Ritual" to create a ritual |
| `onView` | Called with ritualId when user clicks a ritual card |
| `onFacilitate` | Called with ritualId when user clicks "Start" on an upcoming ritual |
| `onEdit` | Called with ritualId when user clicks edit from dashboard (or onEdit with no args from detail) |
| `onDelete` | Called with ritualId from dashboard (or no args from detail) |
| `onFilterBySprint` | Called with sprintId when user selects a sprint filter |
| `onSaveNotes` | Called with notes string when user saves notes during facilitation |
| `onMarkCompleted` | Called when user marks the ritual as completed |
| `onBack` | Called when user navigates back from facilitation to dashboard |
| `onSubmit` | Called with partial Ritual when create/edit form is submitted |
| `onCancel` | Called when user cancels the create/edit form |
