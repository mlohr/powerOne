# Milestone 2: OKR Hierarchy

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

## Goal

Implement the OKR Hierarchy section — the primary screen in PowerOne for viewing, filtering, and managing Objectives and Key Results across the organizational hierarchy.

## Overview

The OKR Hierarchy section is the core of PowerOne. It displays all Objectives and Key Results across the organizational hierarchy (Group → Entity → Domain → Department → Team) with filtering, cascade alignment navigation, and task management. Users can browse OKRs in three view modes, create and edit objectives and key results, manage tasks, and save custom filter configurations for quick access.

**Key Functionality:**
- View all Objectives and Key Results in full, compact, or hierarchy view modes
- Filter by organizational unit, sprint, status, program, and owner
- Create/edit/delete Objectives with owner, org unit, sprint, lifecycle status, and cascade links
- Create/edit/delete Key Results with metric definitions (scale, direction, baseline, target)
- Manage tasks within each Key Result (add, toggle complete, delete)
- Save custom filters for reuse
- Navigate cascade relationships between parent/child objectives

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/okr-hierarchy/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

The test instructions are framework-agnostic — adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/okr-hierarchy/components/`:

- `OKRHierarchyList` — Main list view with filters, view modes, and expandable OKRs
- `ObjectiveForm` — Slide-in panel for create/edit Objectives
- `KeyResultForm` — Slide-in panel for create/edit Key Results with metrics
- `FilterBar` — Multi-select searchable filter dropdowns with active filter chips
- `FilterForm` — Slide-in panel for saving/editing named filters
- `TaskList` — Collapsible task list within a Key Result
- `TaskItem` — Individual task row

### Data Layer

The components expect these data shapes (see `product-plan/sections/okr-hierarchy/types.ts`):

- `OKRHierarchyProps` — Full component props with objectives, org units, sprints, programs, saved filters
- `Objective` — id, title, description, organizationalUnit (with level), owner, sprint, status, keyResults, progress, parentObjectiveId
- `KeyResult` — id, title, metric (with baseline/target/current), team, status, tasks, linkedChildObjectiveId
- `SavedFilter` — id, name, filters (orgUnit, status, sprint, program, owner), isPreset

You'll need to:
- Create API endpoints to fetch/create/update/delete objectives and key results
- Implement cascade linking between objectives (parentObjectiveId / linkedChildObjectiveId)
- Calculate progress rollup from KR metrics to objective
- Persist saved filters per user

### Callbacks to Wire Up

| Callback | Description |
|----------|-------------|
| `onCreateObjective` | Open ObjectiveForm in create mode |
| `onEditObjective(objectiveId)` | Open ObjectiveForm pre-filled with objective data |
| `onDeleteObjective(objectiveId)` | Delete objective (with confirmation) |
| `onCreateKeyResult(objectiveId)` | Open KeyResultForm for a specific objective |
| `onEditKeyResult(keyResultId)` | Open KeyResultForm pre-filled |
| `onDeleteKeyResult(keyResultId)` | Delete key result (with confirmation) |
| `onFilterChange(filters)` | Apply filters to the OKR list |
| `onSaveAsNewFilter(name, filters)` | Save current filters as a named filter |
| `onUpdateFilter(filterId, filters)` | Update an existing saved filter |
| `onDeleteFilter(filterId)` | Delete a saved filter |
| `onClearFilters` | Reset all active filters |
| `onAddTask(keyResultId, title)` | Create a new task on a KR |
| `onToggleTaskStatus(taskId)` | Toggle task between open/done |
| `onEditTask(taskId, title)` | Update task title |
| `onDeleteTask(taskId)` | Delete task |
| `onViewObjective(objectiveId)` | Navigate to objective detail or scroll to it |

### Empty States

Implement empty state UI for when no records exist yet:

- **No OKRs yet:** When objectives list is empty, show a helpful message and "Create First Objective" CTA
- **No KRs on an objective:** Show "Add Key Result" button inline
- **No tasks on a KR:** Show "Add task" input inline in TaskList
- **Filter returns no results:** Show "No matching OKRs" with "Clear filters" option

## Files to Reference

- `product-plan/sections/okr-hierarchy/README.md` — Feature overview
- `product-plan/sections/okr-hierarchy/tests.md` — Test-writing instructions (TDD)
- `product-plan/sections/okr-hierarchy/components/` — React components
- `product-plan/sections/okr-hierarchy/types.ts` — TypeScript interfaces
- `product-plan/sections/okr-hierarchy/sample-data.json` — Test data
- `product-plan/sections/okr-hierarchy/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: Browse OKRs

1. User navigates to `/okrs`
2. User sees the OKR Hierarchy with all objectives and their key results
3. User clicks view mode buttons to switch between Full / Compact / Hierarchy
4. **Outcome:** OKRs displayed in selected view mode with progress indicators

### Flow 2: Create an Objective

1. User clicks "New Objective" button
2. User fills in title, description, selects org unit, owner, sprint, and optionally a parent objective
3. User selects lifecycle status (starts as Draft)
4. User clicks "Create Objective"
5. **Outcome:** New objective appears in the list with correct org unit color and status badge

### Flow 3: Add a Key Result with Metric

1. User expands an objective and clicks "Add Key Result"
2. User fills in KR title, defines metric (name, scale, direction, baseline, target)
3. User assigns KR team members
4. User clicks "Create Key Result"
5. **Outcome:** KR appears under the objective with metric definition and 0% progress

### Flow 4: Filter OKRs

1. User opens filter dropdowns (org unit, sprint, status, etc.)
2. User selects filter values
3. **Outcome:** OKR list filters in real-time, active filters shown as chips

### Flow 5: Save a Custom Filter

1. User applies a set of filters
2. User clicks "Save as Filter" and names it
3. **Outcome:** Filter appears in the saved filters list for quick reuse

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] OKR list renders with real data from API
- [ ] Three view modes work (full, compact, hierarchy)
- [ ] Filter bar filters the list in real-time
- [ ] Saved filters persist across sessions
- [ ] Create/edit/delete Objective works end-to-end
- [ ] Create/edit/delete Key Result with metrics works
- [ ] Tasks can be added, toggled, and deleted on KRs
- [ ] Cascade links between objectives display correctly
- [ ] Empty states display properly
- [ ] Responsive on mobile
