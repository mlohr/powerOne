# PowerOne — Product Overview

## Summary

PowerOne is an outcome-driven OKR management tool that connects strategy to execution across distributed organizations. It enables everyone—from leadership to individual contributors across multiple entities, countries, and teams—to clearly understand what matters, why it matters, who owns it, how it's being executed, and how progress is tracking. PowerOne makes Programs, ownership, tasks, and progress transparent at all times through an intuitive interface that requires minimal OKR expertise.

## Planned Sections

1. **OKR Hierarchy** — Create, edit, and manage Objectives and Key Results across all organizational levels (Group → Entity → Domain → Department → Team) with clear ownership, cascade linking, lifecycle management, metric definition, searchable filter dropdowns, custom saved filters, and three view modes (full, compact, hierarchy) with visual tree structure.

2. **Programs** — Create and manage cross-entity strategic initiatives with program leads, assign them to Objectives, and visualize rolled-up progress.

3. **Metrics & Progress** — Update metric values during sprints, track progress with real-time visualization across all levels.

4. **OKR Rituals** — Create and facilitate planning sessions, check-ins, reviews, and retrospectives linked to relevant Objectives and Key Results.

## Data Model

Core entities: OrganizationalUnit, User, Admin, ObjectiveOwner, ProgramLead, KeyResultTeam, Objective, KeyResult, Metric, MetricUpdate, Program, Task, Sprint, Ritual, SavedFilter

## Design System

**Colors:**
- Primary: teal
- Secondary: blue
- Neutral: slate

**Typography:**
- Heading: Inter
- Body: Inter
- Mono: JetBrains Mono

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, routing structure, and application shell
2. **OKR Hierarchy** — Core OKR browsing, filtering, CRUD, and cascade navigation
3. **Programs** — Cross-entity strategic initiative management
4. **Metrics & Progress** — Sprint metric updates for KR team members
5. **OKR Rituals** — Ritual scheduling and facilitation

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
