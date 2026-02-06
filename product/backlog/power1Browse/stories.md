# power1Browse — User Story Cards

> Platform: Canvas App on SharePoint Lists (standard connector)
> Data synced from Dataverse via Power Automate

---

## BS-001: Create SharePoint Site & Lists

**Story:** As a developer, I want a SharePoint site provisioned with all required lists, columns, indexes, and views, so that the Canvas App has a data source to read from.

**Story Points:** 5
**Priority:** P1 - Must Have
**Epic:** B0: Foundation
**Tags:** sharepoint, infrastructure
**Dependencies:** US-001 (Dataverse schema)

### Acceptance Criteria

- [ ] SharePoint site created at `sites/PowerOneBrowse`
- [ ] 6 entity lists created: Objectives, KeyResults, Metrics, Sprints, OrgUnits, Programs
- [ ] 4 junction lists created: ProgramObjectives, ProgramLeads, KeyResultTeam, UserOrgUnits
- [ ] Each entity list includes `DataverseId` (single line text, indexed) for sync correlation
- [ ] Entity lists include `IsDeleted` (Yes/No, default No) for soft delete handling
- [ ] Column types match Dataverse schema (see backlog.md data model section)
- [ ] Indexed columns configured: Objectives(Status, SprintId, OrgUnitId), KeyResults(ObjectiveId, Status), Metrics(KeyResultId)
- [ ] Default views created per list filtered to `IsDeleted = No`
- [ ] Site permissions set: Everyone in org has Read access

### SharePoint Notes

- Use number columns for ID references (SprintId, OrgUnitId, etc.) — not SharePoint Lookup type
- Text columns for email-based user references (OwnerEmail, LeadEmail, MemberEmail)
- Multi-line text for Description fields (exempt from 8,000 byte row limit)
- Index columns that will be used in Canvas App Filter formulas for delegation support

---

## BS-002: Build Dataverse-to-SharePoint Sync Flows

**Story:** As a developer, I want Power Automate flows that sync data from Dataverse to SharePoint Lists, so that the read-only browser always has current data.

**Story Points:** 5
**Priority:** P1 - Must Have
**Epic:** B0: Foundation
**Tags:** power-automate, sync, dataverse
**Dependencies:** BS-001

### Acceptance Criteria

- [ ] 6 event-triggered flows created (one per entity table): triggered on "When a row is added, modified or deleted" in Dataverse
- [ ] 1 event-triggered flow for ProgramObjectives junction table
- [ ] Each flow creates a new SharePoint item when a Dataverse row is added
- [ ] Each flow updates the matching SharePoint item (by DataverseId) when a Dataverse row is modified
- [ ] Each flow sets `IsDeleted = Yes` when a Dataverse row is deleted
- [ ] 1 scheduled reconciliation flow (runs every 4 hours) that queries all tables for `modifiedon > lastRunTime` and upserts to SharePoint
- [ ] All flows owned by a single service account with Power Automate Premium license
- [ ] Retry policies configured (3 retries with exponential backoff) on all SharePoint actions
- [ ] Flows run without errors for 24 hours with test data

### Power Automate Notes

- Use the Dataverse "When a row is added, modified or deleted" trigger (premium connector)
- Match records in SharePoint using Filter Query on `DataverseId eq '{guid}'`
- For the reconciliation flow, use "List rows" with OData filter `modifiedon gt {lastRunTime}`
- Store last run timestamp in a SyncStatus SharePoint list or Dataverse config row
- Only the flow owner needs a Premium license — automated flows don't trigger multiplexing

---

## BS-003: Validate Sync & Data Integrity

**Story:** As a developer, I want to validate that all synced data in SharePoint matches Dataverse, so that we can confirm the sync mechanism works correctly before building the Canvas App.

**Story Points:** 1
**Priority:** P1 - Must Have
**Epic:** B0: Foundation
**Tags:** testing, sync, validation
**Dependencies:** BS-002

### Acceptance Criteria

- [ ] Create 10+ test records in each Dataverse entity table via power1Admin / powerOne
- [ ] Verify all records appear in corresponding SharePoint lists within 5 minutes
- [ ] Modify 5 records in Dataverse and verify updates propagate to SharePoint
- [ ] Delete 2 records in Dataverse and verify `IsDeleted = Yes` in SharePoint
- [ ] Verify junction list records sync correctly (Program-Objective links)
- [ ] Verify reconciliation flow catches a manually missed record
- [ ] Document any edge cases or timing issues discovered

---

## BS-004: Create Canvas App with Navigation Shell

**Story:** As a user, I want to open the power1Browse app and see a navigation sidebar, so that I can access different sections of the OKR browser.

**Story Points:** 5
**Priority:** P1 - Must Have
**Epic:** B1: Shell
**Tags:** canvas-app, shell, navigation
**Dependencies:** BS-003

### Acceptance Criteria

- [ ] Canvas App created in the PowerOne solution (named "PowerOne Browse")
- [ ] Uses **only** SharePoint and Office 365 Users connectors (standard — verify license designation is "Standard")
- [ ] Sidebar navigation with links: OKRs, Programs
- [ ] User context displayed: current user's name and avatar via Office365Users connector
- [ ] App shell is responsive (adapts to desktop and tablet widths)
- [ ] Navigation highlights the active section
- [ ] App loads within 3 seconds on first open

### Canvas App Notes

- Use `Office365Users.MyProfile()` to get current user info (standard connector)
- Cache reference data (Sprints, OrgUnits) in collections at `App.OnStart` for fast filtering
- Set `App.OnStart` to load active sprint: `ClearCollect(colSprints, Filter(Sprints, Status = "Active"))`
- Verify the app license designation shows "Standard" in Power Apps admin — this is critical

---

## BS-005: Implement Sprint Selector

**Story:** As a user, I want to select a sprint from a global dropdown, so that all views filter to show data for the selected time period.

**Story Points:** 3
**Priority:** P1 - Must Have
**Epic:** B1: Shell
**Tags:** canvas-app, shell, filtering
**Dependencies:** BS-004

### Acceptance Criteria

- [ ] Sprint dropdown in the app header/sidebar showing all sprints from the Sprints SharePoint list
- [ ] Default selection: the sprint with Status = "Active"
- [ ] Changing the sprint updates a global variable (`varSelectedSprint`) used by all galleries
- [ ] Sprint display format: "{Name} ({StartDate} – {EndDate})"
- [ ] Dropdown is delegable-safe (Sprints list will always be < 500 items)

---

## BS-006: OKR List View with Expandable Key Results

**Story:** As a user, I want to see a list of Objectives for the selected sprint with expandable Key Results, so that I can browse the OKR hierarchy.

**Story Points:** 8
**Priority:** P1 - Must Have
**Epic:** B2: OKR Browser
**Tags:** canvas-app, okr, gallery
**Dependencies:** BS-005

### Acceptance Criteria

- [ ] Gallery displaying Objectives filtered by selected sprint and `IsDeleted = false`
- [ ] Each Objective row shows: Title, Status (text badge), Progress (percentage), Owner name
- [ ] Tapping an Objective expands to show child Key Results (filtered by `ObjectiveId`)
- [ ] Each Key Result row shows: Title, Status, Progress percentage
- [ ] Gallery query uses only delegable functions: `Filter(Objectives, SprintId = varSelectedSprint.ID && IsDeleted = false)`
- [ ] Gallery supports scrolling and progressive loading (paging)
- [ ] Empty state shown when no Objectives exist for the selected sprint
- [ ] Tapping an Objective title navigates to the Objective Detail view (BS-008)
- [ ] Tapping a Key Result title navigates to the KR Detail view (BS-009)

### Delegation Notes

- `Filter` with `=` on indexed columns (SprintId, Status) is delegable for SharePoint
- `Sort` on a single column is delegable
- Avoid `CountRows`, `GroupBy`, or `Distinct` — these are non-delegable with SharePoint
- Set data row limit to 2,000 in app settings as safety net

---

## BS-007: Filter Bar (Org Unit, Status, Owner)

**Story:** As a user, I want to filter Objectives by org unit, lifecycle status, and owner, so that I can narrow down the OKR list.

**Story Points:** 5
**Priority:** P1 - Must Have
**Epic:** B2: OKR Browser
**Tags:** canvas-app, okr, filtering
**Dependencies:** BS-006

### Acceptance Criteria

- [ ] Dropdown filter for Org Unit (populated from cached OrgUnits collection)
- [ ] Dropdown filter for Status (Draft, Active, Achieved, Missed, Cancelled)
- [ ] Text input for Owner name filter (using `StartsWith` — delegable)
- [ ] Filters compose with AND logic: all active filters apply simultaneously
- [ ] "Clear filters" button resets all filters
- [ ] Active filter count displayed as badge
- [ ] All filter queries remain delegable: `Filter(Objectives, SprintId = x && OrgUnitId = y && Status = z && StartsWith(OwnerName, searchText))`

### Delegation Notes

- `StartsWith` is delegable with SharePoint; `Search` is also delegable but searches all text columns
- Avoid `Contains` or `Mid` in filter formulas — these are non-delegable
- Use `in` operator for multi-select status filter if needed (delegable on base columns)

---

## BS-008: Objective Detail View

**Story:** As a user, I want to view an Objective's full details including its Key Results and metrics, so that I can understand the objective's progress and structure.

**Story Points:** 5
**Priority:** P1 - Must Have
**Epic:** B2: OKR Browser
**Tags:** canvas-app, okr, detail
**Dependencies:** BS-006

### Acceptance Criteria

- [ ] Detail screen accessed by tapping an Objective in the list view
- [ ] Displays: Title, Description, Status, Progress, Owner (name + email), Org Unit, Sprint
- [ ] Shows parent Objective link (if ParentObjectiveId is set) — tapping navigates to parent
- [ ] Gallery of child Key Results with: Title, Status, Progress, linked metrics count
- [ ] For each Key Result, shows inline Metrics: Name, Current/Target, Progress bar
- [ ] Back button returns to the OKR list view (preserving filter state)
- [ ] If Objective has a LinkedChildObjective (cascade), show cascade link

---

## BS-009: Key Result Detail with Metrics

**Story:** As a user, I want to view a Key Result's full details including its metrics, team members, and linked Objective, so that I can understand how progress is tracked.

**Story Points:** 5
**Priority:** P1 - Must Have
**Epic:** B2: OKR Browser
**Tags:** canvas-app, okr, detail, metrics
**Dependencies:** BS-006

### Acceptance Criteria

- [ ] Detail screen accessed by tapping a Key Result in the list or Objective detail view
- [ ] Displays: Title, Status, Progress, parent Objective (link), LinkedChildObjective (if set)
- [ ] Gallery of Metrics: Name, Scale, Direction, Baseline, Current, Target, Unit, Progress bar
- [ ] Progress bar shows `(Current - Baseline) / (Target - Baseline) * 100` with color coding
- [ ] Shows team members from KeyResultTeam junction list (MVP: from cached collection; P2: from sync flow)
- [ ] Back button returns to previous screen

---

## BS-010: Search Functionality

**Story:** As a user, I want to search across Objective and Key Result titles, so that I can quickly find specific OKRs.

**Story Points:** 3
**Priority:** P1 - Must Have
**Epic:** B2: OKR Browser
**Tags:** canvas-app, okr, search
**Dependencies:** BS-006

### Acceptance Criteria

- [ ] Search text input in the OKR section header
- [ ] Searches Objective titles using delegable `Search` function
- [ ] Results show matching Objectives with their Key Results
- [ ] Minimum 3 characters before search executes
- [ ] Clear search button resets to the full filtered list
- [ ] Search combines with active sprint selector and filters

### Delegation Notes

- `Search` function is delegable with SharePoint — searches across all text columns in the list
- For targeted column search, use `Filter` with `StartsWith` instead

---

## BS-011: Programs Dashboard

**Story:** As a user, I want to see all programs displayed as cards on a dashboard, so that I can browse program progress at a glance.

**Story Points:** 5
**Priority:** P1 - Must Have
**Epic:** B3: Programs
**Tags:** canvas-app, programs, dashboard
**Dependencies:** BS-005

### Acceptance Criteria

- [ ] Gallery showing Programs as cards with: Name, Description (truncated), OverallProgress
- [ ] Progress displayed as percentage with simple visual indicator
- [ ] Tapping a program card navigates to Program Detail view (BS-012)
- [ ] Programs filtered to `IsDeleted = false`
- [ ] Empty state when no programs exist
- [ ] Responsive layout: 2 cards per row on desktop, 1 on tablet

---

## BS-012: Program Detail with Linked OKRs

**Story:** As a user, I want to view a program's full details including its linked objectives, so that I can understand program scope and progress.

**Story Points:** 3
**Priority:** P1 - Must Have
**Epic:** B3: Programs
**Tags:** canvas-app, programs, detail
**Dependencies:** BS-011

### Acceptance Criteria

- [ ] Detail screen accessed by tapping a program card
- [ ] Displays: Name, Description, OverallProgress
- [ ] Shows Program Leads (from ProgramLeads junction list — display names via Office365Users)
- [ ] Gallery of linked Objectives (via ProgramObjectives junction): Title, Status, Progress
- [ ] Tapping a linked Objective navigates to Objective Detail (BS-008)
- [ ] Back button returns to Programs dashboard

### Implementation Notes

- Load ProgramObjectives junction records matching the program's SharePoint ID
- For each junction record, look up the Objective by ObjectiveId
- Use `AddColumns` to enrich junction data with Objective fields — keep within delegation limits
- Consider caching program-specific data in a collection on screen load

---

## BS-013: Build N:N Junction Sync Flows

**Story:** As a developer, I want sync flows for the remaining junction tables (ProgramLeads, KeyResultTeam, UserOrgUnits), so that team assignments and user-org mappings are available in the browse app.

**Story Points:** 3
**Priority:** P2 - Should Have
**Epic:** B4: Sync Enhancements
**Tags:** power-automate, sync, n-n
**Dependencies:** BS-002

### Acceptance Criteria

- [ ] 3 additional event-triggered flows created for junction tables
- [ ] ProgramLeads: sync po_program_lead → ProgramLeads SharePoint list
- [ ] KeyResultTeam: sync po_keyresult_team → KeyResultTeam SharePoint list
- [ ] UserOrgUnits: sync po_user_orgunit → UserOrgUnits SharePoint list
- [ ] Add junction tables to the reconciliation flow
- [ ] Validate sync with test data

---

## BS-014: Add "Last Synced" Indicator

**Story:** As a user, I want to see when the data was last synced, so that I know how current the information is.

**Story Points:** 3
**Priority:** P2 - Should Have
**Epic:** B4: Sync Enhancements
**Tags:** canvas-app, sync, monitoring
**Dependencies:** BS-004

### Acceptance Criteria

- [ ] Create a `SyncStatus` SharePoint list with columns: TableName, LastSyncTime, Status
- [ ] Each sync flow updates the SyncStatus record for its table after successful run
- [ ] Canvas App displays "Last synced: {relative time}" in the footer
- [ ] If last sync is older than 1 hour, show a warning icon
- [ ] If last sync is older than 4 hours, show an error indicator
- [ ] Tapping the indicator shows per-table sync status

---

## BS-015: Progress Visualization (bars, badges)

**Story:** As a user, I want polished progress bars and status badges, so that OKR status is immediately visually clear.

**Story Points:** 5
**Priority:** P2 - Should Have
**Epic:** B5: Visual Enhancements
**Tags:** canvas-app, ui, visualization
**Dependencies:** BS-006

### Acceptance Criteria

- [ ] Progress bars with color coding: Green (≥70%), Amber (40–69%), Red (<40%)
- [ ] Status badges with distinct colors per lifecycle status (Draft=gray, Active=blue, Achieved=green, Missed=red, Cancelled=slate)
- [ ] Progress bars used consistently in: OKR list, Objective detail, KR detail, Programs
- [ ] Visual design matches powerOne Canvas App styling where possible
- [ ] Smooth rendering without layout shift

---

## BS-016: Dark Mode Support

**Story:** As a user, I want the app to support a dark color scheme, so that I can use it comfortably in different lighting conditions.

**Story Points:** 3
**Priority:** P3 - Could Have
**Epic:** B5: Visual Enhancements
**Tags:** canvas-app, ui, theming
**Dependencies:** BS-004

### Acceptance Criteria

- [ ] Toggle button in the shell navigation to switch between light and dark mode
- [ ] Dark mode uses appropriate dark background and light text colors
- [ ] All screens and components render correctly in both modes
- [ ] User's mode preference persists across sessions (stored in local storage / user settings)

---

## BS-017: Embedded Power BI Dashboard

**Story:** As a user, I want to see an analytics dashboard with OKR completion rates and trends, so that I can understand overall performance.

**Story Points:** 8
**Priority:** P2 - Should Have
**Epic:** B6: Analytics
**Tags:** power-bi, analytics, embedded
**Dependencies:** BS-005

### Acceptance Criteria

- [ ] Power BI report created with visuals: OKR completion rate by org unit, progress distribution, trend over sprints
- [ ] Power BI connects to Dataverse directly (via TDS endpoint) — not SharePoint
- [ ] Report embedded in Canvas App using the Power BI tile control (standard connector)
- [ ] Dashboard section added to sidebar navigation
- [ ] Filters sync with selected sprint
- [ ] Users need Power BI Pro license (included in M365 E5) to view embedded reports

### Licensing Notes

- Power BI connector in Canvas Apps is a standard connector
- Users need Power BI Pro (included in M365 E5) or Power BI Premium capacity for viewing
- The Power BI report itself connects to Dataverse — this is fine because the Power BI service has its own licensing model separate from Power Apps

---

## BS-018: Metric History View

**Story:** As a user, I want to see the history of metric value updates, so that I can track progress trends over time.

**Story Points:** 4
**Priority:** P2 - Should Have
**Epic:** B6: Analytics
**Tags:** canvas-app, metrics, history
**Dependencies:** BS-009, BS-002

### Acceptance Criteria

- [ ] Create MetricUpdates SharePoint list (optional list #11)
- [ ] Add sync flow for po_MetricUpdate → MetricUpdates
- [ ] On KR Detail screen, show metric history as a sortable list: Date, Value, Updated By
- [ ] Display trend direction (improving/declining) based on metric Direction field
- [ ] History loads on demand (tapping "Show history" on a metric)
