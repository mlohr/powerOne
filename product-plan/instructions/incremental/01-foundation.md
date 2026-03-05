# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

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

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Color palette:**
- Primary: `teal` — buttons, links, active states, key accents
- Secondary: `blue` — secondary actions, hover highlights
- Neutral: `slate` — backgrounds, text, borders, surfaces

**Organizational level colors** (for visual hierarchy):
- Group: purple
- Entity: teal
- Domain: blue
- Department: amber
- Team: rose

**Lifecycle status colors:**
- Draft: slate
- Accepted: blue
- Active: teal
- Done: emerald
- Archived: slate (muted)
- Cancelled: red

**Typography:**
- Headings and body: Inter
- Code/technical: JetBrains Mono

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

**Core entities:**
- `OrganizationalUnit` — Group, Entity, Domain, Department, Team in a tree hierarchy
- `User` — base user with roles (Admin, ObjectiveOwner, ProgramLead, KeyResultTeam member)
- `Sprint` — time period with name (format: `yy.n`, e.g., "26.1"), start/end dates, status
- `Objective` — outcome-focused goal with lifecycle status, owner, sprint, org unit
- `KeyResult` — measurable outcome with metrics, team members, lifecycle status
- `Metric` — defines how a KR is quantified (scale, direction, baseline, target, current value)
- `Program` — cross-entity initiative with leads, linked objectives, progress
- `Ritual` — structured session (planning/check-in/review/retrospective) linked to a sprint
- `Task` — action item linked to a KR

### 3. Routing Structure

Create placeholder routes for each section:

| Route | Section |
|-------|---------|
| `/` or `/okrs` | OKR Hierarchy |
| `/programs` | Programs |
| `/metrics` | Metrics & Progress |
| `/rituals` | OKR Rituals |

### 4. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with fixed sidebar
- `MainNav.tsx` — Navigation component with section links
- `UserMenu.tsx` — User menu with avatar and logout

**Wire Up Navigation:**

Connect navigation to your routing:

| Nav Item | Route | Icon |
|----------|-------|------|
| OKR Hierarchy | `/okrs` | Target |
| Programs | `/programs` | Layers |
| Metrics & Progress | `/metrics` | BarChart2 |
| OKR Rituals | `/rituals` | Calendar |

**User Menu:**

The user menu expects:
- User name (string)
- User email (string)
- Initials (string, 2 chars)
- `onLogout` callback

**Shell Layout:**
- Fixed left sidebar (240-280px width on desktop)
- Content area fills remaining width
- Sidebar collapses on mobile (hamburger menu)
- Teal gradient accent in sidebar header

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions and sample data
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components
- `product-plan/shell/screenshot.png` — Shell visual reference (if available)

## Done When

- [ ] Design tokens configured (colors and typography applied)
- [ ] Data model types defined (all core entities)
- [ ] Routes exist for all 4 sections (can be placeholder pages)
- [ ] Shell renders with navigation sidebar
- [ ] Navigation links to correct routes
- [ ] Active nav item is highlighted
- [ ] User menu shows user info and logout
- [ ] Responsive on mobile (sidebar collapses)
