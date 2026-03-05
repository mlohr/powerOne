# OKR Hierarchy Section

## Overview

The OKR Hierarchy section is the primary screen in PowerOne. It displays all Objectives and Key Results across the organizational hierarchy, with filtering, cascading alignment, and task management.

## Components

- `OKRHierarchyList` — Main list with full/compact/hierarchy view modes, filter bar, and expandable objectives
- `ObjectiveForm` — Side panel for creating and editing Objectives
- `KeyResultForm` — Side panel for creating and editing Key Results with metric definitions
- `FilterBar` — Multi-select filter dropdowns with searchable options and filter chip display
- `FilterForm` — Side panel for creating and editing custom saved filters
- `TaskList` — Collapsible task list inside a Key Result with inline task creation
- `TaskItem` — Individual task row with checkbox, owner, and timestamp

## Key Features

- Three view modes: Full (detailed cards), Compact (dense list), Hierarchy (indented tree)
- Filter by organizational unit, status, program, sprint, and owner
- Save and share custom filters
- Cascade navigation: click a KR's link to jump to the linked child objective
- Breadcrumb showing OKR cascade path when navigating
- Tasks under each Key Result (collapsible, with add/toggle/delete)

## Props

### OKRHierarchyList (main component)
See `types.ts` for the full `OKRHierarchyProps` interface.

Key props:
- `objectives` — List of objectives to display
- `organizationalUnits` — Master data for org unit selection
- `sprints` — Available sprints
- `programs` — Available programs
- `savedFilters` — Preset and user-defined filters
- `currentUser` — Logged-in user for breadcrumb and "My" filter defaults
- `viewMode` — `'full' | 'compact' | 'hierarchy'`
- `onCreateObjective`, `onEditObjective`, `onDeleteObjective` — CRUD callbacks
- `onCreateKeyResult`, `onEditKeyResult`, `onDeleteKeyResult` — CRUD callbacks
- `onFilterChange`, `onSaveAsNewFilter`, `onUpdateFilter`, `onClearFilters` — Filter callbacks
- `onAddTask`, `onToggleTaskStatus`, `onEditTask`, `onDeleteTask` — Task callbacks

## Design Tokens

- Primary: teal (`teal-600`, `teal-500`, etc.)
- Secondary: blue (`blue-500`, `blue-600`, etc.)
- Neutral: slate (`slate-900` → `slate-50`)
- Organizational level colors: purple (Group), teal (Entity), blue (Domain), amber (Department), rose (Team)
- Status colors: slate (Draft), blue (Accepted), teal (Active), emerald (Done), slate-muted (Archived), red (Cancelled)

## Visual Reference

See `screenshot.png` in this directory for the target UI design (if available).
