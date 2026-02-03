# OKR Hierarchy Specification

## Overview
The OKR Hierarchy section allows users to create, view, edit, and manage Objectives and Key Results across all organizational levels (Group → Entity → Domain → Department → Team). Users can navigate the hierarchy using breadcrumbs, filter using pre-set and custom filters with searchable dropdowns, toggle between full, compact, and hierarchy views, and manage the complete OKR lifecycle including cascading alignment through an intuitive accordion-style list interface. The section includes advanced cascade navigation features with clickable parent/child links, visual hierarchy view with indentation and connector lines, and dynamic breadcrumb switching to show OKR cascade chains.

## User Flows
- Browse OKRs in filterable list with hierarchy navigation via breadcrumbs
- Filter OKRs using pre-set filters (My OKRs, My Entity, My Domain) or custom saved filters accessible from sidebar
- Search within filter dropdowns (organizational units, programs, owners, sprints) for quick filtering
- Toggle between full, compact, and hierarchy list views
- Expand/collapse Objectives inline to view Key Results (accordion-style)
- Navigate cascade chains by clicking parent/child objective links
- Navigate to cascaded objectives by clicking Key Result cascade indicators
- View OKR cascade chain in breadcrumb when objective is focused/highlighted
- Create new Objective via side panel that slides in from right
- Create new Key Result via side panel (from within expanded Objective or from top-level with Objective selector)
- Edit Objective or Key Result via inline edit buttons in all view modes
- Change lifecycle status (Draft → Accepted → Active → Done → Archived/Cancelled)
- Link Key Result to lower-level Objective (cascading alignment) within Key Result form
- Assign Objective to Sprint
- Assign Objective to Program(s)
- Create, edit, and save custom filters
- Navigate organizational hierarchy using breadcrumbs and level filters in filter bar
- View cascade hierarchy with visual indentation and connector lines in hierarchy view
- View tasks associated with each Key Result (collapsible section with task counter)
- Add new task to a Key Result with description and owner assignment
- Toggle task completion status (open ↔ completed) via checkbox
- Delete tasks from a Key Result

## UI Requirements

### View Modes
- **Full view**: Displaying Objective title and description, organizational unit (with level), owner name, lifecycle status, sprint assignment, number of Key Results, progress indicator, linked Program(s), clickable parent/child Objective links
- **Compact view**: Showing title (truncated), owner avatar/name, status badge, progress indicator, organizational unit badge, inline edit buttons
- **Hierarchy view**: Visual tree structure with progressive indentation (48px per cascade level), connector lines showing parent-child relationships, compact objective cards with all key metadata, child count indicators

### Navigation & Breadcrumbs
- **Organizational breadcrumb** (default): Shows current position in organizational hierarchy (e.g., All Organizations → Entity → Domain)
- **Cascade breadcrumb** (dynamic): Automatically switches to show OKR cascade chain when objective is focused/highlighted, displaying full ancestor chain from top-level to current objective with clickable navigation
- **Parent/Child links**: Clickable "↑ Cascades from" and "↓ Cascades to" links on objectives that smoothly scroll and highlight target objectives
- **Breadcrumb navigation**: All ancestor items in cascade breadcrumb are clickable for quick navigation up the hierarchy

### Filter Bar
- Positioned at top of list with filters for: organizational unit, status, sprint, owner, program
- **Searchable dropdowns**: All filter dropdowns (organizational units, programs, owners, sprints) include search input with real-time filtering
- **Multi-select filters**: Organizational Units, Status, and Programs support multiple selections
- **Single-select filters**: Sprint and Owner support single selection with clear option
- Filter chips display active filters with quick remove buttons
- Save and update custom filter functionality
- Active filter indicator shows currently applied preset or custom filter

### Interactive Elements
- **Objective edit buttons**: Inline "Edit" button on all objectives (visible in all view modes)
- **Key Result edit buttons**: "Edit" button on each key result (hover-reveal in compact/hierarchy views, visible in full view)
- **Add Key Result buttons**: "+ Add Key Result" button in expanded key results section header
- **Cascade navigation**: Clickable cascade indicators on key results showing "Cascades to objective" with arrow icon
- **Highlight system**: 2-second teal glow effect on objectives when navigating via cascade links
- Accordion-style expand/collapse for viewing Key Results inline beneath Objectives
- Auto-expand objectives when navigating to them via cascade links

### Forms & Panels
- Organizational units are master data managed by Admins, available as dropdown selections when creating/editing Objectives
- Secondary navigation in sidebar under "OKR Hierarchy" displaying pre-set filters (My OKRs, My Entity, My Domain), saved custom filters, and "+ Create Filter" option
- Side panel/drawer (slides from right) for all create/edit operations
- Key Result form includes field to link to lower-level Objective for cascading alignment
- Key Result form includes metrics definition section (1-3 metrics per Key Result) with fields for: metric name, scale (%, absolute, score), baseline value, target value, and direction (increase/decrease)
- Top-level Key Result creation includes Objective selector dropdown

### Tasks (Embedded in Key Results)
- **Task list**: Collapsible section within each Key Result showing task counter (e.g., "Tasks (5 open, 3 completed)")
- **Task items**: Display checkbox, description, owner avatar/name, and relative timestamp
- **Completed tasks**: Remain visible with strikethrough text and reduced opacity
- **Add task form**: Inline "+ Add Task" button expands to show description input and owner dropdown
- **Task actions**: Hover-reveal edit/delete buttons on each task
- **Visual separation**: Open tasks displayed first, then completed tasks with visual divider
- **Scroll handling**: Max height with internal scroll for lists with 5-15+ tasks

### Visual Design
- Progressive indentation in hierarchy view (48px per level)
- Connector lines (vertical and horizontal) showing parent-child relationships in hierarchy view
- Teal accent color for primary actions (Edit Objective, Add Key Result, Add Task, navigation links)
- Blue accent color for key result actions (Edit Key Result)
- Hover states on all interactive elements with smooth transitions
- Truncated text with tooltips showing full content
- Dark mode support across all components and view modes

## Out of Scope
- Updating metric current values during sprints (handled in Metrics & Progress section)
- Managing Programs (handled in Programs section)
- Ritual management (handled in OKR Rituals section)
- User and organizational structure management (handled in Admin section)

## Configuration
- shell: true
