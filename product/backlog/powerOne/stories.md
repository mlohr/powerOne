# powerOne — User Story Cards

> Platform: Canvas App on Microsoft Dataverse
> Admin master data CRUD is handled by [power1Admin](../power1Admin/stories.md) (Model-Driven App)

---

## E0: Foundation & Infrastructure

---

### US-001: Deploy Dataverse Schema

**Story:** As an admin, I want the complete Dataverse schema deployed to the environment, so that the Canvas App has a data foundation to build on.

**Story Points:** 8
**Priority:** P1 - Must Have
**Tags:** dataverse, infrastructure, schema
**Dependencies:** None

#### Acceptance Criteria
- [ ] All 11 custom tables created with correct schema names and `po_` prefix
- [ ] All columns created with correct data types (String, Choice, Decimal, DateTime, Memo, Boolean, Integer)
- [ ] All 10 choice columns (option sets) created with correct values starting at 100000000
- [ ] All 16 1:N relationships created with correct cascade behaviors
- [ ] All 4 N:N relationships created with intersect tables
- [ ] Self-referential lookups work (OrganizationalUnit parent, Objective parent)
- [ ] Schema matches `product/data-model/dataverse-data-model.md`

#### Power Platform Notes
- Use the Python SDK script at `product/data-model/create_powerone_schema.py` for automated deployment
- Memo columns and relationships require Web API (not supported by SDK)
- Deploy to a sandbox environment first, validate, then promote
- This schema is shared by both powerOne (Canvas App) and power1Admin (Model-Driven App)

---

### US-002: Configure Security Roles

**Story:** As an admin, I want security roles configured in Dataverse, so that users have appropriate access to tables based on their role.

**Story Points:** 5
**Priority:** P1 - Must Have
**Tags:** dataverse, security, admin
**Dependencies:** US-001

#### Acceptance Criteria
- [ ] Admin role: full CRUD on all custom tables, org unit/sprint/ritual management
- [ ] Program Lead role: CRUD on Programs/ActivityUpdates, read/update Objectives
- [ ] Objective Owner role: CRUD on owned Objectives and child KRs/Metrics/Tasks
- [ ] Team Member role: read all, update assigned Tasks and Metrics, create MetricUpdates
- [ ] Viewer role: read-only access to all custom tables
- [ ] Roles use Business Unit scoping for data isolation
- [ ] Row-level ownership enforced: users only edit records they own or are assigned to

#### Power Platform Notes
- Configure roles in the Dataverse solution under Security Roles
- Use Organization-level read for most tables (everyone can see OKRs)
- Use User-level write for owned records
- Admin role should be assigned to a small group
- These roles apply to both the Canvas App and the Model-Driven App

---

### US-003: Set Up ALM Pipeline

**Story:** As a developer, I want a Dev/Test/Prod ALM pipeline configured, so that solution changes flow through environments safely.

**Story Points:** 5
**Priority:** P2 - Should Have
**Tags:** alm, devops, governance
**Dependencies:** US-001

#### Acceptance Criteria
- [ ] Three environments provisioned: Development, Test, Production
- [ ] Power Platform Pipeline configured with Dev → Test → Prod stages
- [ ] Solution created with `po_` publisher prefix
- [ ] All components stored in the managed solution (both Canvas App and Model-Driven App)
- [ ] Export/import tested successfully between environments
- [ ] Solution checker enabled on Test/Prod import

#### Power Platform Notes
- Use built-in Power Platform Pipelines (no Azure DevOps required for MVP)
- Unmanaged solution in Dev, Managed in Test/Prod
- Both powerOne and power1Admin apps are in the same solution
- Consider Git integration later for source control

---

### US-004: Create Canvas App Project

**Story:** As a developer, I want the Canvas App project created in the solution with basic screen scaffolding, so that feature development can begin.

**Story Points:** 8
**Priority:** P1 - Must Have
**Tags:** canvas-app, infrastructure
**Dependencies:** US-001, US-002

#### Acceptance Criteria
- [ ] Canvas App created inside the PowerOne solution
- [ ] App dimensions set for responsive web layout (optimize for 1920x1080, support 1024+)
- [ ] Dataverse connection configured as primary data source
- [ ] App.OnStart initializes user context (current user, org unit membership)
- [ ] Named formulas (App.Formulas) set up for shared computed values
- [ ] Global color constants defined matching design tokens (teal primary, blue secondary, slate neutral)
- [ ] Inter font family applied throughout
- [ ] Blank placeholder screens created for all sections (OKR Hierarchy, Programs, Metrics, Rituals)
- [ ] App published and playable with navigation stubs

#### Power Platform Notes
- Avoid heavy logic in App.OnStart — use App.Formulas for lazy evaluation
- Set delegation warning to 10 during development
- Enable explicit column selection for performance
- Use screen templates for consistent layout patterns
- Admin section not needed in Canvas App — handled by power1Admin

---

## E1: Application Shell

---

### US-005: Build Sidebar Navigation

**Story:** As a user, I want a persistent sidebar with navigation links to all sections, so that I can move between OKR Hierarchy, Programs, Metrics, and Rituals.

**Story Points:** 5
**Priority:** P1 - Must Have
**Tags:** canvas-app, shell, navigation, frontend
**Dependencies:** US-004

#### Acceptance Criteria
- [ ] Fixed sidebar (240-280px) on the left side of the screen
- [ ] PowerOne logo/brand at top of sidebar
- [ ] Navigation items: OKR Hierarchy, Programs, Metrics & Progress, OKR Rituals
- [ ] Utility items below divider: Settings, Help
- [ ] Active section highlighted with teal accent
- [ ] Hover states on all navigation items
- [ ] Icons displayed next to each label (Target, Folder, TrendingUp, Calendar, Settings, HelpCircle)
- [ ] Content area fills remaining width on the right

#### Power Platform Notes
- Implement sidebar as a component or container group on each screen
- Use a global variable (gblActiveSection) to track active screen
- Consider a component library for reuse across screens
- No "Admin" link in Canvas App sidebar — admin access is via the separate power1Admin app

---

### US-006: Implement User Context

**Story:** As a user, I want the app to know who I am and what organizational units I belong to, so that filters and assignments default to my context.

**Story Points:** 3
**Priority:** P1 - Must Have
**Tags:** canvas-app, authentication, user-context
**Dependencies:** US-004

#### Acceptance Criteria
- [ ] Current user identified via User() function and matched to systemuser record
- [ ] User's organizational unit memberships loaded (via po_user_orgunit N:N)
- [ ] User avatar (initials fallback) and name displayed in sidebar user menu
- [ ] Logout dropdown accessible from user menu
- [ ] User context available globally for pre-set filters and default assignments

#### Power Platform Notes
- Use `User().Email` to look up the systemuser record
- Cache user context in a global variable on app start
- Load org unit memberships via the N:N intersect table
- Org unit assignments are managed in power1Admin — Canvas App only reads them

---

### US-007: Build Section Routing

**Story:** As a user, I want clicking a navigation item to display the corresponding section content, so that each area of the app is accessible.

**Story Points:** 8
**Priority:** P1 - Must Have
**Tags:** canvas-app, shell, routing, frontend
**Dependencies:** US-005, US-006

#### Acceptance Criteria
- [ ] Navigate() between screens when clicking sidebar items
- [ ] Active section indicator updates correctly in sidebar
- [ ] Smooth transition between screens (no flicker or delay)
- [ ] Back navigation preserves filter/scroll state within sections
- [ ] Deep linking to specific records (e.g., open Objective detail) works via context variables

#### Power Platform Notes
- Use Navigate() with ScreenTransition.None for instant switching
- Pass context via Navigate() second parameter for deep linking
- Consider using a single screen with visible container switching for simpler state management (trade-off: larger screen definition)

---

## E3: OKR Hierarchy

---

### US-011: OKR List View

**Story:** As a user, I want to see a list of Objectives with expandable Key Results, so that I can browse the OKR structure at a glance.

**Story Points:** 8
**Priority:** P1 - Must Have
**Tags:** canvas-app, okr-hierarchy, frontend, dataverse
**Dependencies:** US-007
**Cross-project data dependency:** Requires org units and sprints to exist in Dataverse (managed by power1Admin)

#### Acceptance Criteria
- [ ] Gallery displays Objectives: title, org unit (with level badge), owner name, status badge, sprint, progress indicator, KR count
- [ ] Clicking/expanding an Objective reveals its Key Results in accordion style
- [ ] Each Key Result shows: title, status badge, progress percentage, metric count
- [ ] Default sort: by organizational unit level, then alphabetically
- [ ] Empty state when no Objectives match current filters
- [ ] Loading indicator while Dataverse query runs
- [ ] Delegable query against po_Objective and po_KeyResult

#### Power Platform Notes
- Use nested Gallery or expandable container pattern for accordion
- Load Key Results on expand (not all at once) to manage payload size
- Use delegable Filter() and SortByColumns() only
- Consider ClearCollect for the active sprint's data if row count <2,000
- Org unit and sprint reference data must exist — enter via power1Admin before testing

---

### US-012: Objective Create/Edit Form

**Story:** As an Objective Owner, I want to create and edit Objectives via a side panel, so that I can define outcome-focused goals with proper context.

**Story Points:** 8
**Priority:** P1 - Must Have
**Tags:** canvas-app, okr-hierarchy, forms, dataverse
**Dependencies:** US-011

#### Acceptance Criteria
- [ ] Side panel slides in from right when "Create Objective" or "Edit" is clicked
- [ ] Form fields: Title (required), Description (memo), Organizational Unit dropdown (required), Owner dropdown (required), Sprint dropdown (required), Status dropdown (required)
- [ ] Default values: current user as owner, active sprint, Draft status
- [ ] Validation: Title is required, org unit is required
- [ ] Submit creates new po_Objective record or patches existing
- [ ] Cancel closes panel without saving
- [ ] Success feedback (brief notification)
- [ ] OKR list refreshes after save

#### Power Platform Notes
- Use an overlay/container that slides in with X position animation
- Patch() for create, Patch() with record reference for update
- Dropdowns load from Dataverse with delegable queries
- Description is a Memo field — use multi-line text input

---

### US-013: Key Result Create/Edit Form

**Story:** As a team member, I want to create and edit Key Results within an Objective, so that I can define metric-driven success measures.

**Story Points:** 8
**Priority:** P1 - Must Have
**Tags:** canvas-app, okr-hierarchy, forms, dataverse
**Dependencies:** US-012

#### Acceptance Criteria
- [ ] Side panel form for Key Result create/edit
- [ ] Form fields: Title (required), Status dropdown, parent Objective selector
- [ ] When created from within an expanded Objective, parent Objective is pre-filled
- [ ] When created from top-level "+ Add Key Result", Objective selector is shown
- [ ] Submit creates new po_KeyResult record linked to Objective
- [ ] Key Results list within parent Objective refreshes after save
- [ ] Edit mode loads existing values into form

#### Power Platform Notes
- Reuse the same side panel pattern as Objective form
- Objective selector: ComboBox searching po_Objective by title (delegable)
- Pre-filling parent requires passing context via Navigate() or UpdateContext()

---

### US-014: Metric Definition on Key Results

**Story:** As a team member, I want to define 1-3 metrics on each Key Result with scale, baseline, and target, so that progress can be quantified.

**Story Points:** 5
**Priority:** P1 - Must Have
**Tags:** canvas-app, okr-hierarchy, forms, dataverse
**Dependencies:** US-013

#### Acceptance Criteria
- [ ] Metrics section within Key Result form shows existing metrics
- [ ] Add Metric: name, scale (Percentage/Absolute/Score), direction (Increase/Decrease), baseline value, target value, unit
- [ ] Edit existing metrics inline
- [ ] Remove metric (with confirmation)
- [ ] Validation: at least 1 metric required, maximum 3 metrics per Key Result
- [ ] Baseline and target are required decimal values
- [ ] Metrics saved to po_Metric table linked to po_KeyResult

#### Power Platform Notes
- Use a sub-gallery or repeating section within the KR form panel
- Each metric is a separate po_Metric record — use ForAll() + Patch() for bulk save
- Consider saving metrics in a collection, then committing on form submit

---

### US-015: Lifecycle Status Management

**Story:** As an Objective Owner, I want to change the lifecycle status of Objectives and Key Results, so that I can manage them through Draft → Accepted → Active → Done → Archived/Cancelled.

**Story Points:** 5
**Priority:** P1 - Must Have
**Tags:** canvas-app, okr-hierarchy, business-logic, dataverse
**Dependencies:** US-012, US-013

#### Acceptance Criteria
- [ ] Status dropdown on both Objective and Key Result forms shows valid transitions
- [ ] Valid transitions enforced: Draft→Accepted, Accepted→Active, Active→Done, Active→Cancelled, Done→Archived, Cancelled→Archived
- [ ] Status change updates the record immediately via Patch()
- [ ] Status badge color coding: Draft=gray, Accepted=blue, Active=teal, Done=green, Archived=slate, Cancelled=red
- [ ] Changing Objective status does NOT automatically cascade to Key Results
- [ ] Confirmation dialog for terminal statuses (Cancelled, Archived)

#### Power Platform Notes
- Implement transition validation with a Switch() or If() formula
- Consider a Dataverse business rule for server-side enforcement as backup
- Status badge: use conditional formatting on Label/Container background

---

### US-016: Cascade Linking

**Story:** As an Objective Owner, I want to link a Key Result to a lower-level Objective, so that cascading alignment between organizational levels is visible.

**Story Points:** 5
**Priority:** P1 - Must Have
**Tags:** canvas-app, okr-hierarchy, business-logic, dataverse
**Dependencies:** US-013, US-012

#### Acceptance Criteria
- [ ] Key Result form includes optional "Cascades to Objective" field
- [ ] Dropdown shows Objectives from lower organizational levels only
- [ ] Selecting a child Objective sets po_LinkedChildObjectiveId on the Key Result
- [ ] Cascade indicators shown on Key Results in list view ("↓ Cascades to: [Objective title]")
- [ ] Objective shows "↑ Cascades from: [KR title]" when it's a cascade target
- [ ] Clearing the field removes the cascade link
- [ ] Validation: cannot cascade to an Objective at the same or higher org level

#### Power Platform Notes
- Filter cascade target dropdown by org level: must be lower than current Objective's org unit level
- Use LookUp() to resolve display names for cascade indicators
- Self-referential lookup on po_Objective via po_ParentObjectiveId

---

### US-017: Filter Bar with Searchable Dropdowns

**Story:** As a user, I want a filter bar at the top of the OKR list with searchable dropdowns, so that I can quickly narrow down Objectives by org unit, status, sprint, owner, or program.

**Story Points:** 8
**Priority:** P1 - Must Have
**Tags:** canvas-app, okr-hierarchy, filtering, frontend
**Dependencies:** US-011

#### Acceptance Criteria
- [ ] Filter bar positioned at top of OKR list
- [ ] Dropdowns: Organizational Unit (multi-select), Status (multi-select), Sprint (single-select), Owner (single-select), Program (multi-select)
- [ ] All dropdowns include search input with real-time filtering
- [ ] Active filters displayed as chips below the bar with "x" remove buttons
- [ ] "Clear All" button resets all filters
- [ ] Filter changes immediately update the OKR list gallery
- [ ] All filtering uses delegable Dataverse functions

#### Power Platform Notes
- ComboBox controls support search and multi-select natively
- For delegable multi-filter: chain Filter() calls or use a single Filter() with And()
- Status multi-select: use the `in` operator (delegable on Dataverse)
- Org Unit filter should include descendant units (if "Germany" selected, show Domain/Department/Team under Germany)

---

### US-018: Pre-set Filters

**Story:** As a user, I want quick-access pre-set filters (My OKRs, My Entity, My Domain) in the sidebar, so that I can instantly view relevant subsets.

**Story Points:** 3
**Priority:** P1 - Must Have
**Tags:** canvas-app, okr-hierarchy, filtering
**Dependencies:** US-017

#### Acceptance Criteria
- [ ] Sidebar sub-navigation under "OKR Hierarchy" shows: My OKRs, My Entity, My Domain
- [ ] "My OKRs" filters to Objectives where current user is Owner
- [ ] "My Entity" filters to Objectives in the user's Entity-level org unit (and descendants)
- [ ] "My Domain" filters to Objectives in the user's Domain-level org unit (and descendants)
- [ ] Active pre-set filter highlighted in sidebar
- [ ] Selecting a pre-set clears any custom filters and applies the preset

#### Power Platform Notes
- Derive user's Entity and Domain from their org unit memberships (walk up the hierarchy)
- Cache these values in global variables on app start (from US-006)

---

### US-019: Custom Saved Filters

**Story:** As a user, I want to save my current filter combination as a named custom filter, so that I can reuse it without reconfiguring each time.

**Story Points:** 5
**Priority:** P2 - Should Have
**Tags:** canvas-app, okr-hierarchy, filtering, dataverse
**Dependencies:** US-017, US-018

#### Acceptance Criteria
- [ ] "Save Filter" button captures current filter state
- [ ] Dialog: enter filter name, optional "Share with others" toggle
- [ ] Filter criteria serialized as JSON and saved to po_SavedFilter table
- [ ] Saved filters appear in sidebar under "OKR Hierarchy" section
- [ ] Clicking a saved filter applies its criteria to the filter bar
- [ ] Edit/delete saved filters via context menu
- [ ] Shared filters visible to all users (po_IsShared = true)

#### Power Platform Notes
- Serialize filter state using JSON() function
- Store in po_CriteriaJson Memo column
- Load saved filters gallery from po_SavedFilter filtered by current user OR po_IsShared = true
- Apply filter by parsing JSON back to filter values

---

### US-020: View Modes (Full, Compact, Hierarchy)

**Story:** As a user, I want to switch between full, compact, and hierarchy views of the OKR list, so that I can choose the level of detail and visual structure I need.

**Story Points:** 8
**Priority:** P2 - Should Have
**Tags:** canvas-app, okr-hierarchy, frontend
**Dependencies:** US-011

#### Acceptance Criteria
- [ ] Toggle buttons for three view modes at top of list
- [ ] **Full view**: title, description snippet, org unit with level, owner, status, sprint, KR count, progress, program links, cascade links
- [ ] **Compact view**: title (truncated), owner avatar, status badge, progress, org unit badge, inline edit buttons
- [ ] **Hierarchy view**: visual tree with 48px indentation per cascade level, connector lines, compact cards, child count indicators
- [ ] View mode persists during session (resets on app close)
- [ ] Data content is the same across modes, only layout changes

#### Power Platform Notes
- Use Visible property to toggle between three gallery/container templates
- Hierarchy view is the most complex: requires computing indentation level from cascade chain
- Connector lines: use vertical/horizontal line shapes or HTML text with CSS in an HTML viewer
- Consider simplifying hierarchy view for MVP (indentation without connector lines)

---

### US-021: Breadcrumb Navigation

**Story:** As a user, I want breadcrumb navigation that shows my position in the organizational hierarchy or OKR cascade chain, so that I always know where I am.

**Story Points:** 5
**Priority:** P2 - Should Have
**Tags:** canvas-app, okr-hierarchy, navigation, frontend
**Dependencies:** US-011, US-016

#### Acceptance Criteria
- [ ] **Organizational breadcrumb** (default): "All → [Entity] → [Domain] → [Department]" based on current filter
- [ ] **Cascade breadcrumb** (dynamic): switches to show OKR cascade chain when an Objective is focused (e.g., "Group OKR → Entity OKR → Current OKR")
- [ ] All breadcrumb items are clickable, navigating to that level/objective
- [ ] Breadcrumb smoothly transitions between org and cascade modes
- [ ] Current position (last item) is non-clickable and styled differently

#### Power Platform Notes
- Build breadcrumb as a horizontal Gallery with dynamic items
- Walk up the parent chain using recursive LookUp() on po_ParentObjectiveId
- Limit depth to prevent performance issues (max 5-6 levels)

---

### US-022: Cascade Navigation

**Story:** As a user, I want to click cascade links on Objectives and Key Results to navigate directly to linked parent/child OKRs, so that I can trace the strategic alignment chain.

**Story Points:** 5
**Priority:** P2 - Should Have
**Tags:** canvas-app, okr-hierarchy, navigation
**Dependencies:** US-016, US-021

#### Acceptance Criteria
- [ ] Clickable "↑ Cascades from: [KR title]" link on child Objectives
- [ ] Clickable "↓ Cascades to: [Objective title]" link on Key Results
- [ ] Clicking scrolls/navigates to the target record in the list
- [ ] Target record highlighted with 2-second teal glow animation
- [ ] Target Objective auto-expands if collapsed
- [ ] Breadcrumb switches to cascade mode showing the full ancestor chain

#### Power Platform Notes
- Use ScrollTo() or Gallery.Selected to navigate to the target
- Highlight effect: use a Timer control that sets a teal border, then fades after 2 seconds
- Auto-expand: set the expanded state variable when navigating

---

### US-023: Task Management on Key Results

**Story:** As a team member, I want to create, complete, and delete tasks within a Key Result, so that daily work items are tracked alongside the metrics they support.

**Story Points:** 5
**Priority:** P1 - Must Have
**Tags:** canvas-app, okr-hierarchy, tasks, dataverse
**Dependencies:** US-013

#### Acceptance Criteria
- [ ] Collapsible "Tasks" section within each expanded Key Result
- [ ] Task counter shows "(X open, Y completed)"
- [ ] Each task: checkbox, description, owner name/avatar, timestamp
- [ ] "+ Add Task" inline form: description input, owner dropdown, submit button
- [ ] Toggle checkbox: updates po_Task status (Open ↔ Completed) and sets po_CompletedAt
- [ ] Delete task via hover-reveal trash icon (with confirmation)
- [ ] Open tasks displayed first, completed tasks below with strikethrough and reduced opacity
- [ ] Max height with scroll for lists exceeding ~8 tasks

#### Power Platform Notes
- Nested gallery within the KR expanded section
- Patch() for create/update, Remove() for delete
- Sort by status then creation date
- Owner dropdown: ComboBox searching systemuser

---

### US-024: Assign Objectives to Sprint & Programs

**Story:** As an Objective Owner, I want to assign an Objective to a Sprint and optionally to one or more Programs, so that the OKR is connected to time periods and strategic initiatives.

**Story Points:** 3
**Priority:** P1 - Must Have
**Tags:** canvas-app, okr-hierarchy, forms, dataverse
**Dependencies:** US-012

#### Acceptance Criteria
- [ ] Sprint dropdown on Objective form showing all sprints (active sprint pre-selected for new)
- [ ] Program multi-select on Objective form showing all programs
- [ ] Changing sprint updates po_SprintId lookup
- [ ] Changing programs updates po_program_objective N:N relationship
- [ ] Current sprint and program assignments displayed in OKR list view

#### Power Platform Notes
- Sprint: simple Patch() on the lookup column
- Programs N:N: use Relate() and Unrelate() to manage the relationship
- ComboBox for multi-select program picker
- Sprint data managed by power1Admin — dropdowns read from Dataverse

---

## E4: Programs

---

### US-025: Programs Dashboard

**Story:** As a user, I want to view all programs as cards on a dashboard with key metrics, so that I can see strategic initiatives at a glance.

**Story Points:** 5
**Priority:** P1 - Must Have
**Tags:** canvas-app, programs, frontend, dataverse
**Dependencies:** US-007, US-012

#### Acceptance Criteria
- [ ] Dashboard screen displaying program cards in a responsive grid
- [ ] Each card shows: program name, description (truncated), lead(s), linked objectives count, overall progress percentage, entities involved
- [ ] Search bar for filtering by program name
- [ ] Filter dropdown for program lead
- [ ] Clickable cards navigate to program detail view
- [ ] "+ Create Program" button prominent at top
- [ ] Empty state when no programs exist

#### Power Platform Notes
- Use a Gallery with wrap or flexible-width template for card grid
- Progress percentage from po_OverallProgress column
- Lead names: resolve from po_program_lead N:N

---

### US-026: Program Create/Edit Form

**Story:** As a Program Lead, I want to create and edit programs with description, leads, and linked objectives, so that I can define strategic initiatives.

**Story Points:** 5
**Priority:** P1 - Must Have
**Tags:** canvas-app, programs, forms, dataverse
**Dependencies:** US-025

#### Acceptance Criteria
- [ ] Side panel form for program create/edit
- [ ] Fields: name (required), description (memo), lead(s) multi-select, objectives multi-select, entities scope
- [ ] Lead selector searches systemuser by name
- [ ] Objectives selector shows all Objectives with org unit context
- [ ] Entities involved auto-derived from selected objectives' org units
- [ ] Submit creates/patches po_Program and manages N:N relationships (leads, objectives)
- [ ] Creates po_ActivityUpdate record for "Program Created" or "Program Edited"

#### Power Platform Notes
- N:N for leads: Relate()/Unrelate() on po_program_lead
- N:N for objectives: Relate()/Unrelate() on po_program_objective
- Activity logging: Patch() a new po_ActivityUpdate record on save

---

### US-027: Program Detail View

**Story:** As a user, I want to view a program's full details including linked objectives with progress breakdown, so that I can understand the initiative's health.

**Story Points:** 5
**Priority:** P1 - Must Have
**Tags:** canvas-app, programs, frontend, dataverse
**Dependencies:** US-026

#### Acceptance Criteria
- [ ] Program header: name, description, lead(s), entities involved, overall progress
- [ ] Linked objectives list: title, org unit, owner, individual progress bar, status
- [ ] Objectives sorted by org level then alphabetically
- [ ] "Edit Program" button opens side panel
- [ ] Back navigation to programs dashboard
- [ ] Empty state for programs with no linked objectives

#### Power Platform Notes
- Load linked objectives via the po_program_objective N:N intersect table
- Use Filter() on the intersect to get related po_Objective records
- Individual progress from po_Progress column on each Objective

---

### US-028: Program Progress Rollup

**Story:** As a user, I want program progress automatically calculated from linked objectives' progress, so that the overall health is always current.

**Story Points:** 5
**Priority:** P2 - Should Have
**Tags:** dataverse, business-logic, automation
**Dependencies:** US-027, US-014

#### Acceptance Criteria
- [ ] Program overall progress = average of linked Objectives' progress percentages
- [ ] Objective progress = average of its Key Results' progress percentages
- [ ] Key Result progress = average of its Metrics' progress percentages
- [ ] Metric progress = ((currentValue - baseline) / (target - baseline)) x 100, clamped 0-100
- [ ] Progress recalculated when metric values are updated
- [ ] po_OverallProgress on Program, po_Progress on Objective and Key Result updated

#### Power Platform Notes
- **Option A**: Power Automate flow triggered on po_MetricUpdate create — walks up: Metric → KR → Objective → Program and patches progress
- **Option B**: Calculated/rollup columns in Dataverse (limited for cross-table aggregation)
- **Recommended**: Power Automate flow for reliability and auditability
- Consider direction (Increase vs Decrease) in metric progress formula

---

### US-029: Activity Feed

**Story:** As a user, I want to see a chronological activity feed on the program detail page, so that I can track what changed and when.

**Story Points:** 3
**Priority:** P3 - Could Have
**Tags:** canvas-app, programs, frontend, dataverse
**Dependencies:** US-027

#### Acceptance Criteria
- [ ] Activity feed section on program detail page
- [ ] Shows po_ActivityUpdate records sorted by timestamp (newest first)
- [ ] Each entry: icon by type, description, user name, relative timestamp
- [ ] Types: Program Created, Edited, Objective Added/Removed, Progress Update, Lead Added/Removed
- [ ] Scrollable list (max 10 visible, load more)

#### Power Platform Notes
- Simple Gallery filtered by po_ProgramId, sorted by po_Timestamp descending
- Activity records created automatically when program changes happen (in US-026, US-028)

---

## E5: Metrics & Progress

---

### US-030: My Key Results List

**Story:** As a team member, I want to see all Key Results in the active sprint where I'm part of the KR team, so that I know which metrics I need to update.

**Story Points:** 3
**Priority:** P1 - Must Have
**Tags:** canvas-app, metrics, frontend, dataverse
**Dependencies:** US-007, US-014

#### Acceptance Criteria
- [ ] List filtered to: active sprint AND current user is in po_keyresult_team N:N
- [ ] Each KR shows: title, parent Objective title, org unit, status badge
- [ ] For each KR, display its metrics: name, current value, target, baseline, progress %
- [ ] Empty state: "No Key Results assigned to you this sprint"
- [ ] Loading indicator while data loads

#### Power Platform Notes
- Resolving "user is in KR team" via N:N requires querying the intersect table
- Filter po_keyresult_team where user = current user, then use results to filter KR gallery
- Collect team memberships first, then filter KR gallery

---

### US-031: Metric Value Update

**Story:** As a team member, I want to enter a new value for a metric and save it, so that progress is tracked over the sprint.

**Story Points:** 5
**Priority:** P1 - Must Have
**Tags:** canvas-app, metrics, forms, dataverse
**Dependencies:** US-030

#### Acceptance Criteria
- [ ] Input field next to each metric showing current value (editable)
- [ ] "Update" button submits the new value
- [ ] On save: creates new po_MetricUpdate record (value, timestamp, user, sprint, metric)
- [ ] On save: patches po_Metric.po_CurrentValue with the new value
- [ ] Progress percentage recalculates and displays immediately
- [ ] Success confirmation after update
- [ ] Validation: value must be a valid number

#### Power Platform Notes
- Patch() on po_Metric for currentValue
- Patch() on po_MetricUpdate for the audit trail
- Use a transaction-like pattern: update both in sequence, handle errors
- Trigger progress rollup (US-028) via Power Automate after MetricUpdate create

---

### US-032: Progress Calculation & Display

**Story:** As a user, I want to see progress as a percentage next to each Key Result and metric, so that I can assess how close we are to targets.

**Story Points:** 3
**Priority:** P1 - Must Have
**Tags:** canvas-app, metrics, frontend
**Dependencies:** US-031

#### Acceptance Criteria
- [ ] Each metric shows progress: ((current - baseline) / (target - baseline)) x 100
- [ ] Progress clamped between 0% and 100%
- [ ] Direction-aware: for "Decrease" metrics, formula is inverted
- [ ] Progress displayed as text percentage (e.g., "75%")
- [ ] Color coding: <33% red, 33-66% amber, >66% green
- [ ] Overall KR progress = average of its metrics' progress

#### Power Platform Notes
- All calculation in Power Fx formulas (client-side)
- Use With() for cleaner formula structure
- No charts for MVP — text percentages only (per spec)

---

### US-033: Metric Update History

**Story:** As a team member, I want to see the history of updates for a metric, so that I can track the trend of value changes over time.

**Story Points:** 3
**Priority:** P2 - Should Have
**Tags:** canvas-app, metrics, frontend, dataverse
**Dependencies:** US-031

#### Acceptance Criteria
- [ ] Expandable "History" section per metric
- [ ] Shows po_MetricUpdate records: value, date, updated by (user name)
- [ ] Sorted by date descending (most recent first)
- [ ] Shows last 10 updates (load more on scroll)
- [ ] Empty state: "No updates yet"

#### Power Platform Notes
- Gallery filtered by po_MetricId, sorted by po_RecordedAt descending
- Delegable query on Dataverse
- Keep it simple — list only, no charts for MVP

---

## E6: OKR Rituals

---

### US-034: Rituals Dashboard

**Story:** As a user, I want a dashboard showing upcoming and recently completed rituals, so that I can plan for and review OKR ceremonies.

**Story Points:** 3
**Priority:** P1 - Must Have
**Tags:** canvas-app, rituals, frontend, dataverse
**Dependencies:** US-007
**Cross-project data dependency:** Requires sprint data in Dataverse (managed by power1Admin)

#### Acceptance Criteria
- [ ] "Upcoming" section: rituals in next 14 days (po_Status = Upcoming, po_DateTime > Now())
- [ ] "Recent" section: completed rituals from past 14 days
- [ ] Each ritual card: type badge (Planning/Check-in/Review/Retro), date/time, sprint name, status
- [ ] Sprint filter dropdown to scope rituals
- [ ] "+ Create Ritual" button at top
- [ ] Empty state per section

#### Power Platform Notes
- Two Gallery controls: one filtered for upcoming, one for recent
- Delegable Filter() on po_DateTime and po_Status
- Date comparison: DateDiff() for the 14-day window
- Sprint dropdown reads from Dataverse — data managed by power1Admin

---

### US-035: Ritual Create/Edit Form

**Story:** As a facilitator, I want to create and edit rituals with type, date, and sprint assignment, so that OKR ceremonies are scheduled.

**Story Points:** 3
**Priority:** P1 - Must Have
**Tags:** canvas-app, rituals, forms, dataverse
**Dependencies:** US-034

#### Acceptance Criteria
- [ ] Form fields: title (required), type dropdown (Planning/Check-in/Review/Retrospective), date/time picker (required), sprint dropdown (required), facilitator name
- [ ] Optional fields: duration (minutes), participant count
- [ ] Status defaults to "Upcoming" on create
- [ ] Edit loads existing values
- [ ] Submit creates/patches po_Ritual record
- [ ] Dashboard refreshes after save

#### Power Platform Notes
- Use DatePicker and TimePicker controls (or DateTimeZone input)
- Type as ComboBox/Dropdown bound to po_RitualType choice column
- Sprint dropdown: all sprints, active sprint pre-selected

---

### US-036: Ritual Facilitation View

**Story:** As a facilitator, I want a dedicated view for conducting a ritual session where I can capture notes, so that meeting outcomes are documented.

**Story Points:** 5
**Priority:** P2 - Should Have
**Tags:** canvas-app, rituals, frontend, dataverse
**Dependencies:** US-035

#### Acceptance Criteria
- [ ] Ritual detail header: title, type, date, sprint, facilitator, status
- [ ] Large notes text area (multi-line, po_Notes Memo field)
- [ ] Auto-save notes every 30 seconds or on blur
- [ ] "Start Session" button: sets status to "In Progress"
- [ ] "Mark as Completed" button: sets status to "Completed", records participant count and duration
- [ ] Back navigation to rituals dashboard
- [ ] Read-only mode for completed rituals (notes still visible)

#### Power Platform Notes
- Memo field: use multi-line text input with sufficient height
- Auto-save: use a Timer control that triggers Patch() every 30 seconds
- Status transitions: Upcoming → In Progress → Completed

---

### US-037: Past Rituals List

**Story:** As a user, I want to browse past rituals filtered by sprint, so that I can review notes and outcomes from previous ceremonies.

**Story Points:** 2
**Priority:** P3 - Could Have
**Tags:** canvas-app, rituals, frontend, dataverse
**Dependencies:** US-035

#### Acceptance Criteria
- [ ] List view of completed rituals
- [ ] Sprint filter dropdown to scope by time period
- [ ] Each entry: type, date, facilitator, notes preview (truncated)
- [ ] Click to view full facilitation view (read-only)
- [ ] Sorted by date descending

#### Power Platform Notes
- Gallery with Filter(po_Ritual, po_Status = "Completed", po_SprintId = selectedSprint)
- Delegable query, straightforward implementation

---

## Cross-Cutting

---

### US-038: Responsive Layout

**Story:** As a user, I want the app to adapt between desktop and tablet screen sizes, so that I can use it on different devices.

**Story Points:** 8
**Priority:** P3 - Could Have
**Tags:** canvas-app, frontend, responsive
**Dependencies:** US-007

#### Acceptance Criteria
- [ ] Desktop (1024px+): fixed sidebar, full content area
- [ ] Tablet (768-1023px): narrower sidebar or collapsible
- [ ] All galleries and forms adjust to available width
- [ ] No horizontal scrolling at any supported size
- [ ] Touch-friendly tap targets (min 44px) for tablet

#### Power Platform Notes
- Canvas apps can use App.Width to conditionally adjust layout
- Sidebar visibility toggle: use a hamburger icon on narrow screens
- Significant effort: every screen needs conditional layout logic
- Consider deferring to post-MVP

---

### US-039: Dark Mode Support

**Story:** As a user, I want the app to support a dark color scheme, so that I can use it comfortably in low-light environments.

**Story Points:** 3
**Priority:** P3 - Could Have
**Tags:** canvas-app, frontend, theming
**Dependencies:** US-007

#### Acceptance Criteria
- [ ] Toggle in Settings to switch between light and dark mode
- [ ] All backgrounds, text, borders adapt to selected mode
- [ ] Charts/progress indicators remain legible in both modes
- [ ] User preference persisted (saved to user settings or local)

#### Power Platform Notes
- Canvas apps have no native dark mode — must be implemented with global color variables
- Define two color palettes and reference variables throughout all controls
- Significant effort per screen — every control's Fill, Color, BorderColor needs conditional logic
- Consider deferring to post-MVP or implementing for new screens only
