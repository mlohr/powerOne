# PowerOne — Complete Implementation Instructions

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Test-Driven Development

Each section includes a `tests.md` file with detailed test-writing instructions. These are **framework-agnostic** — adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write failing tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

The test instructions include:
- Specific UI elements, button labels, and interactions to verify
- Expected success and failure behaviors
- Empty state handling (when no records exist yet)
- Data assertions and state validations

---

# Product Overview

PowerOne is an outcome-driven OKR management tool that connects strategy to execution across distributed organizations. It enables everyone—from leadership to individual contributors across multiple entities, countries, and teams—to clearly understand what matters, why it matters, who owns it, how it's being executed, and how progress is tracking.

**Sections:**
1. **OKR Hierarchy** — Core OKR browsing, filtering, CRUD, and cascade navigation
2. **Programs** — Cross-entity strategic initiative management
3. **Metrics & Progress** — Sprint metric updates for KR team members
4. **OKR Rituals** — Ritual scheduling and facilitation

**Design System:**
- Primary: teal | Secondary: blue | Neutral: slate
- Typography: Inter (headings/body), JetBrains Mono (code)

See `product-plan/product-overview.md` for full details.

---

# Milestone 1: Foundation

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Organizational level colors:** Group=purple, Entity=teal, Domain=blue, Department=amber, Team=rose

**Lifecycle status colors:** Draft=slate, Accepted=blue, Active=teal, Done=emerald, Archived=slate(muted), Cancelled=red

### 2. Data Model Types

See `product-plan/data-model/types.ts` for all interface definitions.

Core entities: `OrganizationalUnit`, `User`, `Sprint`, `Objective`, `KeyResult`, `Metric`, `MetricUpdate`, `Program`, `Ritual`, `Task`, `SavedFilter`

### 3. Routing Structure

| Route | Section |
|-------|---------|
| `/` or `/okrs` | OKR Hierarchy |
| `/programs` | Programs |
| `/metrics` | Metrics & Progress |
| `/rituals` | OKR Rituals |

### 4. Application Shell

Copy shell components from `product-plan/shell/components/`:
- `AppShell.tsx` — Fixed sidebar layout (240-280px)
- `MainNav.tsx` — Navigation with section links (Target, Layers, BarChart2, Calendar icons)
- `UserMenu.tsx` — User avatar and logout

**Nav items:** OKR Hierarchy (`/okrs`), Programs (`/programs`), Metrics & Progress (`/metrics`), OKR Rituals (`/rituals`)

## Done When
- [ ] Design tokens configured
- [ ] Data model types defined
- [ ] Routes exist for all 4 sections
- [ ] Shell renders with navigation
- [ ] Navigation links to correct routes
- [ ] User menu shows user info
- [ ] Responsive on mobile

---

# Milestone 2: OKR Hierarchy

## Goal

Implement the primary OKR Hierarchy section — viewing, filtering, and managing Objectives and Key Results across the organizational hierarchy.

## Overview

The core of PowerOne. Displays all OKRs across the hierarchy (Group → Entity → Domain → Department → Team) with filtering, cascade alignment, and task management. Three view modes: Full, Compact, Hierarchy.

**Key Functionality:**
- View OKRs in full/compact/hierarchy view modes
- Filter by org unit, sprint, status, program, owner
- Create/edit/delete Objectives with owner, org unit, sprint, lifecycle status
- Create/edit/delete Key Results with metric definitions (scale, direction, baseline, target)
- Manage tasks within Key Results
- Save custom filters for reuse
- Navigate cascade relationships

## TDD

See `product-plan/sections/okr-hierarchy/tests.md` for test-writing instructions.

## Components

From `product-plan/sections/okr-hierarchy/components/`:
- `OKRHierarchyList` — Main list with filters and expandable OKRs
- `ObjectiveForm` — Slide-in create/edit panel
- `KeyResultForm` — Slide-in create/edit panel with metrics
- `FilterBar` — Multi-select searchable filter dropdowns
- `FilterForm` — Slide-in save/edit filter panel
- `TaskList` — Collapsible task list within a KR
- `TaskItem` — Individual task row

## Data Layer

See `product-plan/sections/okr-hierarchy/types.ts` for full interfaces.

Key data: `Objective` (with keyResults[], progress, parentObjectiveId), `KeyResult` (with metrics[], tasks[], linkedChildObjectiveId), `SavedFilter` (with filter criteria)

You'll need to:
- Create CRUD endpoints for objectives and key results
- Implement cascade linking (parentObjectiveId / linkedChildObjectiveId)
- Calculate progress rollup from KR metrics
- Persist saved filters per user

## Callbacks

`onCreateObjective`, `onEditObjective(id)`, `onDeleteObjective(id)`, `onCreateKeyResult(objectiveId)`, `onEditKeyResult(id)`, `onDeleteKeyResult(id)`, `onFilterChange(filters)`, `onSaveAsNewFilter(name, filters)`, `onUpdateFilter(id, filters)`, `onDeleteFilter(id)`, `onClearFilters`, `onAddTask(krId, title)`, `onToggleTaskStatus(taskId)`, `onEditTask(taskId, title)`, `onDeleteTask(taskId)`, `onViewObjective(id)`

## Empty States

- No OKRs: "Create First Objective" CTA
- No KRs on an objective: "Add Key Result" button
- Filter returns nothing: "No matching OKRs" with "Clear filters"

## Expected User Flows

1. **Browse OKRs** — User views hierarchy, switches view modes
2. **Create Objective** — User fills form, objective appears with status badge
3. **Add Key Result** — User defines KR with metric (baseline/target/direction)
4. **Filter OKRs** — User selects filters, list updates real-time
5. **Save Filter** — User saves named filter for reuse

## Done When
- [ ] Tests written and passing
- [ ] OKR list renders with real data
- [ ] Three view modes work
- [ ] Filter bar filters real-time
- [ ] Saved filters persist
- [ ] CRUD operations work end-to-end
- [ ] Tasks work (add/toggle/delete)
- [ ] Empty states display correctly
- [ ] Responsive on mobile

---

# Milestone 3: Programs

## Goal

Implement cross-entity strategic initiative management with linked objectives, rolled-up progress, and activity feeds.

## Overview

Programs are cross-entity strategic initiatives. Users define programs with designated leads, link them to multiple objectives, and track rolled-up progress. The dashboard shows all programs as cards; clicking navigates to a detail view with progress chart, linked objectives list, and activity feed.

**Key Functionality:**
- Dashboard of program cards with name, leads, progress, entity tags
- Search and filter by lead or entity
- Create/edit programs with leads, linked objectives, entity scope
- Program detail with progress chart, objectives list, activity feed
- Overall progress rolled up from linked objectives

## TDD

See `product-plan/sections/programs/tests.md` for test-writing instructions.

## Components

From `product-plan/sections/programs/components/`:
- `ProgramsDashboard` — Card grid with search/filter
- `ProgramCard` — Individual program card
- `ProgramDetail` — Full detail view
- `ProgramForm` — Slide-in create/edit panel
- `ProgressChart` — Progress visualization
- `ObjectiveListItem` — Objective row in detail
- `ActivityFeedItem` — Activity entry

## Data Layer

See `product-plan/sections/programs/types.ts` for interfaces.

`Program` has: leads (ProgramLead[]), linkedObjectives (LinkedObjective[]), entitiesInvolved (string[]), overallProgress (number), activityUpdates (ActivityUpdate[])

You'll need to calculate `overallProgress` as average of linked objective progress values.

## Callbacks

`onCreate`, `onView(id)`, `onEdit`, `onDelete`, `onSubmit(data)`, `onCancel`, `onViewObjective(id)`, `onBack`

## Empty States

- No programs: "New Program" CTA
- Program with no objectives: "Edit Program" CTA in detail view
- No activity: "No activity yet" in feed
- Search/filter no results: "No programs found" with clear option

## Expected User Flows

1. **Browse Programs** — Cards with progress percentages
2. **Create Program** — Slide-in form, program appears in dashboard
3. **View Detail** — Progress chart, objectives list, activity feed
4. **Edit Program** — Pre-populated form, updates detail view

## Done When
- [ ] Tests written and passing
- [ ] Dashboard renders from real data
- [ ] Search and filter work
- [ ] CRUD operations work end-to-end
- [ ] Progress rolls up from objectives
- [ ] Activity feed shows updates
- [ ] Empty states correct
- [ ] Responsive on mobile

---

# Milestone 4: Metrics & Progress

## Goal

Implement a simple, focused interface for team members to update metric values on their Key Results during the active sprint.

## Overview

A minimal metric update interface. Users see only KRs where they're on the KR team in the active sprint. They enter new numeric values and save. No charts, no graphs — just fast metric updates.

**Key Functionality:**
- View assigned KRs in active sprint (pre-filtered server-side)
- See baseline, current, target values with units
- Update any metric value
- Progress shown as color-coded percentage

## TDD

See `product-plan/sections/metrics-and-progress/tests.md` for test-writing instructions.

## Components

From `product-plan/sections/metrics-and-progress/components/`:
- `MetricsProgress` — Full page with sprint badge, KR list, metric inputs

## Data Layer

See `product-plan/sections/metrics-and-progress/types.ts` for interfaces.

**Important:** The component receives pre-filtered data (active sprint + user is on team). Filtering happens server-side.

**Progress calculation:**
- Direction `increase`: `(currentValue - baseline) / (target - baseline) * 100`
- Direction `decrease`: `(baseline - currentValue) / (baseline - target) * 100`

You'll need to:
- Determine the active sprint
- Filter KRs by logged-in user's team membership
- Create MetricUpdate records (with server-side timestamp) when values are saved
- Update Metric.currentValue

## Callbacks

`onUpdateMetric(metricId, newValue)` — Save new value to database, create MetricUpdate record

## Empty States

- No KRs assigned: "No Key Results to update" with explanation

## Expected User Flows

1. **View KRs** — Assigned KRs with context (objective, org unit level)
2. **Update Metric** — Enter new value, click Save, progress recalculates
3. **No Assignments** — Empty state shown

## Done When
- [ ] Tests written and passing
- [ ] Active sprint determined automatically
- [ ] KR list filtered to logged-in user
- [ ] Metric values update and persist
- [ ] MetricUpdate records created with timestamps
- [ ] Progress percentages reflect current values
- [ ] Empty state shown when no KRs
- [ ] Responsive on mobile

---

# Milestone 5: OKR Rituals

## Goal

Implement scheduling and facilitation of structured OKR sessions (planning, check-ins, reviews, retrospectives) linked to sprints.

## Overview

OKR Rituals enables teams to schedule and run structured sessions throughout the sprint lifecycle. Users see upcoming rituals (next 14 days) and recent completed rituals. They can facilitate live sessions with a notes textarea, then mark sessions as completed to lock the notes.

**Key Functionality:**
- Dashboard of upcoming and recent rituals
- Create rituals: type, title, date/time, sprint, facilitator, participant count
- Facilitate sessions with a large markdown notes textarea
- Mark as completed to lock notes
- Filter by sprint to browse historical rituals

## TDD

See `product-plan/sections/okr-rituals/tests.md` for test-writing instructions.

## Components

From `product-plan/sections/okr-rituals/components/`:
- `RitualsDashboard` — Dashboard with sprint filter, upcoming grid, recent grid
- `RitualCard` — Type badge, date/time, sprint, participants, Start button
- `RitualFacilitation` — Notes editor and complete action
- `RitualForm` — Slide-in create/edit panel

## Data Layer

See `product-plan/sections/okr-rituals/types.ts` for interfaces.

`Ritual` has: type (planning/check-in/review/retrospective), status (upcoming/in-progress/completed), notes (string)

You'll need to:
- CRUD endpoints for rituals
- Provide available sprints for filter and form
- Handle status transitions: upcoming → in-progress → completed
- Timestamp note saves server-side

## Callbacks

`onCreate`, `onView(id)`, `onFacilitate(id)`, `onEdit(id)`, `onDelete(id)`, `onFilterBySprint(sprintId)`, `onSaveNotes(notes)`, `onMarkCompleted`, `onBack`, `onSubmit(data)`, `onCancel`

## Empty States

- No rituals: "Schedule First Ritual" CTA
- No upcoming (next 14 days): "No upcoming rituals" with CTA within that section
- Filtered sprint empty: "No rituals found" with guidance
- Completed ritual no notes: "No notes were captured"

## Expected User Flows

1. **View Dashboard** — Upcoming grid and recent grid
2. **Schedule Ritual** — Slide-in form, ritual appears in upcoming
3. **Facilitate Session** — Notes textarea, Save Notes, Mark as Completed
4. **Review Past Notes** — Read-only completed ritual view
5. **Browse by Sprint** — Sprint filter shows historical rituals

## Done When
- [ ] Tests written and passing
- [ ] Dashboard renders from real data
- [ ] Sprint filter works
- [ ] CRUD operations work end-to-end
- [ ] Notes save and persist
- [ ] Mark as Completed transitions status and locks notes
- [ ] Completed ritual shows read-only notes
- [ ] Empty states correct
- [ ] Responsive on mobile
