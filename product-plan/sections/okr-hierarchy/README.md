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

## Visual Reference (ASCII wireframe)

╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║  OKR Hierarchy                                          [≡] [⊞] [⛁]  [New Key Result] [+New Objective] ║
║  Manage objectives and key results across all organizational levels                          ║
║                                                                                              ║
║  All Organizations > Germany > HR                                                            ║
╠══════════════════════════════════════════════════════════════════════════════════════════════╣
║  ▼ FILTERS                                                                                   ║
║  [Organizational Unit ▾] [Status ▾] [Programs ▾] [Sprint 26.1 ▾] [Owner ▾]   [💾 Save] [✕ Clear] ║
║                                                                                              ║
║  Active filters: [Germany ✕] [Accepted ✕] [Global Revenue Acceleration ✕] [Sprint 26.1 ✕]  ║
╠══════════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                              ║
║  ┌────────────────────────────────────────────────────────────────────────────────────────┐  ║
║  │ ▼ ⊙  Increase company-wide revenue growth                              [Edit]          │  ║
║  │      Drive sustainable revenue growth across all entities by expanding                 │  ║
║  │      market share and improving customer retention.                                    │  ║
║  │                                                                                        │  ║
║  │  Owner              Organizational Unit   Status          Sprint                       │  ║
║  │  [SC] Sarah Chen    [group] Group          [● Active]      26.1                        │  ║
║  │                                                                                        │  ║
║  │  Progress                          Key Results    Programs                             │  ║
║  │  [████████████████░░░░░░░░] 65%    3 KRs          [Global Revenue Acceleration]        │  ║
║  │                                                                                        │  ║
║  │  ↓ Cascades to: [Scale Germany entity revenue to €20M]  [Launch operations in India]  │  ║
║  └────────────────────────────────────────────────────────────────────────────────────────┘  ║
║                                                                                              ║
║  KEY RESULTS                                                        [+ Add Key Result]        ║
║  ─────────────────────────────────────────────────────────────────────────────────────────   ║
║                                                                                              ║
║  ┌────────────────────────────────────────────────────────────────────────────────────────┐  ║
║  │ [1]  Achieve €50M in total revenue                                                     │  ║
║  │      [████████████████████████████████████░░░░░░░░░░] 70%  [Active]  [→ Cascades to…] │  ║
║  │                                                                                        │  ║
║  │      ▼ Tasks  (5 open, 2 completed)                                                    │  ║
║  │      ┌──────────────────────────────────────────────────────────────────────────────┐  │  ║
║  │      │ [ ] Schedule revenue review meetings with entity leads                        │  │  ║
║  │      │     [S] Sarah Chen · created 1 month ago                                     │  │  ║
║  │      │                                                                               │  │  ║
║  │      │ [ ] Update revenue dashboard with real-time data from all regions             │  │  ║
║  │      │     [E] Emma Schmidt · created 1 month ago                                   │  │  ║
║  │      │                                                                               │  │  ║
║  │      │ [ ] Prepare mid-sprint revenue report for leadership team                     │  │  ║
║  │      │     [M] Michael Park · created 1 month ago                                   │  │  ║
║  │      │                                                                               │  │  ║
║  │      │ [ ] Identify and escalate revenue risks from underperforming entities         │  │  ║
║  │      │     [S] Sarah Chen · created 1 month ago                                     │  │  ║
║  │      │                                                                               │  │  ║
║  │      │ [ ] Review pricing strategy impact on revenue across product lines            │  │  ║
║  │      │     [L] Lisa Schneider · created 1 month ago                                 │  │  ║
║  │      │                                                                               │  │  ║
║  │      │ [✓] Review and approve Q1 revenue forecasts from all entities   ← COMPLETED  │  │  ║
║  │      │     [S] Sarah Chen · completed 1 month ago                                   │  │  ║
║  │      └──────────────────────────────────────────────────────────────────────────────┘  │  ║
║  │      [+ Add Task]                                                                       │  ║
║  └────────────────────────────────────────────────────────────────────────────────────────┘  ║
║                                                                                              ║
║  ┌────────────────────────────────────────────────────────────────────────────────────────┐  ║
║  │ [2]  Improve customer retention rate to 92%                                            │  ║
║  │      [███████████████████████░░░░░░░░░░░░░░░░░░░░░░░] 55%  [Active]                   │  ║
║  │                                                                                        │  ║
║  │      ▶ Tasks  (6 open, 2 completed)                          ← COLLAPSED               │  ║
║  └────────────────────────────────────────────────────────────────────────────────────────┘  ║
║                                                                                              ║
║  ┌────────────────────────────────────────────────────────────────────────────────────────┐  ║
║  │ [3]  Expand into 3 new markets                                                         │  ║
║  │      [████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 33%  [Active]  [→ Cascades to…] │  ║
║  │                                                                                        │  ║
║  │      ▶ Tasks  (4 open, 2 completed)                          ← COLLAPSED               │  ║
║  └────────────────────────────────────────────────────────────────────────────────────────┘  ║
║                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════
COMPONENT MAP & ANNOTATIONS
═══════════════════════════════════════════════════════

PAGE HEADER
├── Title: "OKR Hierarchy"  [H1, bold]
├── Subtitle: descriptive text  [muted/secondary color]
├── Breadcrumb: All Organizations > Germany > HR  [clickable links]
└── Action buttons (top-right):
    ├── [≡] List view toggle
    ├── [⊞] Grid view toggle
    ├── [⛁] Hierarchy view toggle
    ├── [New Key Result]  secondary outlined button
    └── [+ New Objective]  primary CTA button (green/teal)

FILTER BAR
├── Filter icon + label "Filters:"
├── Dropdown pills (each has label + badge count + chevron):
│   ├── Organizational Unit [1]
│   ├── Status [1]
│   ├── Programs [1]
│   ├── Sprint 26.1
│   └── Owner
├── [💾 Save]  outlined button
└── [✕ Clear]  text button

ACTIVE FILTER TAGS  (chips/badges below filter bar)
└── Each tag: [Label ✕]  — dismissible pill

OBJECTIVE CARD  (expandable/collapsible panel)
├── Collapse toggle [▼/▶]
├── Status icon [⊙]  (e.g., colored ring indicating active)
├── Title  [H2]
├── Description  [body text, muted]
├── Metadata grid (4 columns):
│   ├── Owner: avatar + name
│   ├── Organizational Unit: badge pill
│   ├── Status: colored badge [Active]
│   └── Sprint: plain text
├── Metrics row:
│   ├── Progress bar + percentage  (green fill)
│   ├── Key Results count
│   └── Programs: clickable link
└── Cascade links row:
    └── ↓ Cascades to: [Link1] [Link2]  (teal hyperlinks)

KEY RESULTS SECTION
├── Section header "KEY RESULTS"  [uppercase label]
├── [+ Add Key Result]  text/link button (top-right)
└── KEY RESULT CARDS (numbered list):

    KEY RESULT CARD
    ├── Number badge [1]  [2]  [3]
    ├── Title  [H3]
    ├── Progress bar + percentage + status badge + cascade link
    └── TASK LIST (expandable ▼/▶):
        ├── Collapse toggle + count "(N open, N completed)"
        ├── TASK ROW (repeated):
        │   ├── Checkbox [ ] / [✓]  (completed = strikethrough text)
        │   ├── Task title text
        │   └── Assignee: [avatar initial] Name · "created/completed N ago"
        └── [+ Add Task]  inline text button

STATE INDICATORS
├── Progress bar fill color: green (active/healthy)
├── Status badge: [Active] = teal/green pill
├── Completed tasks: checkbox checked + strikethrough text
├── Collapsed task list: shows ▶ toggle + summary count only
└── Cascade link: small arrow icon + teal hyperlink text
