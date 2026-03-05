# Milestone 4: Metrics & Progress

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) and Milestone 2 (OKR Hierarchy) complete

## Goal

Implement the Metrics & Progress section — a simple, focused interface for team members to update metric values on their Key Results during the active sprint.

## Overview

A simple interface for updating metric values on Key Results during the active sprint. Users see only KRs where they're part of the team, can update values with a basic input field, and see progress as text percentages. No charts, no graphs, no historical data for MVP — the focus is on quick, friction-free metric updates.

**Key Functionality:**
- View all Key Results in the active sprint where the logged-in user is on the KR team
- See each KR's parent objective title and organizational unit level
- Update any metric value by entering a new number
- See progress calculated as a percentage based on baseline, target, and direction
- Save the update (auto-timestamped on backend)

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/metrics-and-progress/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/metrics-and-progress/components/`:

- `MetricsProgress` — Full page with sprint header, KR list, metric inputs, and empty state

### Data Layer

The components expect these data shapes (see `product-plan/sections/metrics-and-progress/types.ts`):

- `MetricsProgressProps` — currentUser, activeSprint, organizationalUnits, objectives, keyResults
- `KeyResult` — with `metrics[]` each having id, name, scale, direction, baseline, currentValue, target, unit
- The component receives pre-filtered data (active sprint + user is on team) — filtering happens server-side

**Progress calculation logic (for backend validation):**
- Direction `increase`: `progress = (currentValue - baseline) / (target - baseline) * 100`
- Direction `decrease`: `progress = (baseline - currentValue) / (baseline - target) * 100`

You'll need to:
- Determine the active sprint from the sprints table
- Filter KRs where the logged-in user appears in the KeyResultTeam
- Create a `MetricUpdate` record when `onUpdateMetric` is called (timestamp it server-side)
- Update `Metric.currentValue` after saving

### Callbacks to Wire Up

| Callback | Description |
|----------|-------------|
| `onUpdateMetric(metricId, newValue)` | Save the new metric value to the database, create a MetricUpdate record |

### Empty States

- **No KRs assigned:** Show "No Key Results to update" with explanation that the user has no KRs in the active sprint

## Files to Reference

- `product-plan/sections/metrics-and-progress/README.md` — Feature overview
- `product-plan/sections/metrics-and-progress/tests.md` — Test-writing instructions (TDD)
- `product-plan/sections/metrics-and-progress/components/` — React component
- `product-plan/sections/metrics-and-progress/types.ts` — TypeScript interfaces
- `product-plan/sections/metrics-and-progress/sample-data.json` — Test data

## Expected User Flows

### Flow 1: View My Key Results

1. User navigates to `/metrics`
2. User sees a list of KRs they're assigned to in the active sprint
3. Each KR shows the parent objective title and org unit level
4. Each metric shows baseline, current, and target values with units
5. **Outcome:** User has a clear view of all their metrics and current progress

### Flow 2: Update a Metric

1. User sees a KR with metric "Enterprise deals closed — 3 deals (target: 10)"
2. User clears the input field and types "5"
3. User clicks "Save"
4. **Outcome:** `onUpdateMetric("metric-001", 5)` is called, database updates, UI reflects new value and recalculated progress percentage

### Flow 3: No Assignments

1. User navigates to `/metrics` when they have no KRs in the active sprint
2. **Outcome:** Empty state shown with "No Key Results to update" message — not a blank screen

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] Active sprint is determined automatically
- [ ] KR list filtered to logged-in user's assignments
- [ ] Metric values update and persist to database
- [ ] MetricUpdate records created with timestamps
- [ ] Progress percentages reflect current values
- [ ] Empty state shown when user has no KRs
- [ ] Responsive on mobile
