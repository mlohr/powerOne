# Milestone 3: Programs

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) and Milestone 2 (OKR Hierarchy) complete

## Goal

Implement the Programs section — cross-entity strategic initiative management with linked objectives, rolled-up progress, and activity feeds.

## Overview

The Programs section enables users to create and manage cross-entity strategic initiatives. Users define programs with designated leads, link them to multiple objectives across different entities, and track rolled-up progress. Programs provide a high-level view of strategic work that spans organizational boundaries.

**Key Functionality:**
- View a dashboard of all programs as cards with name, leads, progress, and entity tags
- Search programs by name and filter by lead or entity
- Create programs with name, description, leads, linked objectives, and cross-entity scope
- View program detail with progress chart, linked objectives list, and activity feed
- Edit program details to update assignments or linked objectives

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/programs/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/programs/components/`:

- `ProgramsDashboard` — Main view with search/filter and program card grid
- `ProgramCard` — Individual program card
- `ProgramDetail` — Full detail view with progress chart, objectives, and activity feed
- `ProgramForm` — Slide-in panel for create/edit
- `ProgressChart` — Progress visualization across linked objectives
- `ObjectiveListItem` — Objective row in detail view
- `ActivityFeedItem` — Activity entry in feed

### Data Layer

The components expect these data shapes (see `product-plan/sections/programs/types.ts`):

- `Program` — id, name, description, leads (ProgramLead[]), linkedObjectives (LinkedObjective[]), entitiesInvolved (string[]), overallProgress, activityUpdates
- `ProgramLead` — userId, name, email, initials
- `LinkedObjective` — id, title, organizationalUnit, owner, progress
- `ActivityUpdate` — id, type, message, timestamp, user

You'll need to:
- Create API endpoints for program CRUD
- Calculate `overallProgress` as average of linked objective progress values
- Generate activity updates when programs are modified (or pass them from a separate activity service)
- Provide `availableLeads` from the users data
- Provide `availableObjectives` from the OKR hierarchy data
- Provide `availableEntities` from the organizational units data (entity names)

### Callbacks to Wire Up

| Callback | Description |
|----------|-------------|
| `onCreate` | Open ProgramForm in create mode |
| `onView(programId)` | Navigate to program detail page |
| `onEdit` | Open ProgramForm pre-filled with program data |
| `onDelete` | Delete program (with confirmation), navigate back |
| `onSubmit(programData)` | Save create/edit form data to API |
| `onCancel` | Close the form panel |
| `onViewObjective(objectiveId)` | Navigate to OKR Hierarchy filtered to that objective |
| `onBack` | Navigate from program detail back to dashboard |

### Empty States

- **No programs yet:** Show "No programs yet" message with "Create Program" CTA
- **Program with no linked objectives:** Show "No objectives linked yet" with "Edit Program" CTA
- **No activity yet:** Show "No activity yet" in the activity feed panel
- **Search/filter no results:** Show "No programs found" with option to clear filters

## Files to Reference

- `product-plan/sections/programs/README.md` — Feature overview
- `product-plan/sections/programs/tests.md` — Test-writing instructions (TDD)
- `product-plan/sections/programs/components/` — React components
- `product-plan/sections/programs/types.ts` — TypeScript interfaces
- `product-plan/sections/programs/sample-data.json` — Test data

## Expected User Flows

### Flow 1: Browse Programs

1. User navigates to `/programs`
2. User sees program cards with name, description, leads, progress, and entity tags
3. **Outcome:** All programs displayed with rolled-up progress percentages

### Flow 2: Create a Program

1. User clicks "New Program"
2. Slide-in form appears
3. User enters name, description, selects leads, optionally links objectives, selects entities
4. User clicks "Create Program"
5. **Outcome:** New program card appears in the dashboard

### Flow 3: View Program Detail

1. User clicks a program card
2. User sees detailed view with progress chart, linked objectives list, and activity feed
3. **Outcome:** Full program context visible with per-objective progress breakdown

### Flow 4: Edit Program

1. User is on program detail, clicks "Edit"
2. Form pre-populated with existing data
3. User updates assignments
4. User clicks "Save Changes"
5. **Outcome:** Program detail updates immediately

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] Program dashboard renders with real data
- [ ] Search and filter work
- [ ] Create/edit/delete program works end-to-end
- [ ] Program detail shows linked objectives with progress
- [ ] Activity feed shows updates
- [ ] Overall progress rolls up from linked objectives
- [ ] Empty states display correctly
- [ ] Responsive on mobile
